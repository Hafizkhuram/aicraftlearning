#!/usr/bin/env node

// Patches the 62 hand-crafted lesson HTML files in /public/content/ to make
// them iframe-aware: emit postMessage events on completion and navigation,
// and (for certificate.html) read learner data from query params instead of
// prompting the user.
//
// Idempotent: each file type has a marker the script checks for before
// patching. Re-running the script on already-patched files is a no-op.
//
// Usage:
//   node scripts/patch-html-lessons.js                    Patch all files
//   node scripts/patch-html-lessons.js --dry-run          Show planned changes, write nothing
//   node scripts/patch-html-lessons.js --single-file=PATH Patch only this one file

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "public", "content");
const COURSES = ["ai-fundamentals", "claude-code-mastery", "ai-agents-workflows"];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const singleFileArg = args.find((a) => a.startsWith("--single-file="));
const singleFilePath = singleFileArg
  ? path.resolve(singleFileArg.split("=")[1])
  : null;

const PATCHED_MARKER = "aicraft:lesson-complete";
const PATCHED_MARKER_ASSESS = "aicraft:assessment-complete";
const PATCHED_MARKER_CERT = "from-query-params-only";

// -------------------- File classification --------------------
function classify(filePath) {
  const base = path.basename(filePath);
  if (base === "certificate.html") return "certificate";
  if (base === "final-assessment.html") return "final-assessment";
  if (/^module-\d+-review\.html$/.test(base)) return "module-review";
  if (/^lesson-\d+-\d+\.html$/.test(base)) return "lesson";
  return "unknown";
}

// -------------------- Patch: standard lesson --------------------
// Two transformations:
//  1. After the "Lesson complete" branch in updateCompletion(), inject postMessage.
//  2. Rewrite the .next-lesson anchor to emit aicraft:lesson-navigate-next.
//
// Detects the no-op finale variant (lesson-4-3 in ai-fundamentals, lesson-4-4
// in the other two courses) by the literal "no-op, finale carries the weight"
// and applies a different shape: synthesize an updateCompletion(), call it
// from the action listener and at the end of showResults().
function patchLesson(content, filePath) {
  if (content.includes(PATCHED_MARKER)) {
    return { changed: false, reason: "already patched" };
  }

  const isNoOpFinale = content.includes("no-op, finale carries the weight");

  if (isNoOpFinale) {
    return patchNoOpFinaleLesson(content, filePath);
  }

  return patchStandardLesson(content, filePath);
}

function patchStandardLesson(content, filePath) {
  let result = content;

  // 1. Inject postMessage in the "lesson complete" branch.
  // The pattern in every standard lesson varies slightly — the innerHTML may
  // say 'Lesson complete' or 'Lesson complete · Module N done'. Match the
  // common prefix and insert the postMessage line after it (preserving indent).
  const completeInsertPattern =
    /(^[ \t]*)statusEl\.innerHTML = '<span>✓<\/span><span>Lesson complete[^']*<\/span>';/m;
  if (!completeInsertPattern.test(result)) {
    return {
      changed: false,
      reason: `lesson-complete branch not found (missing innerHTML 'Lesson complete' line)`,
      error: true,
    };
  }
  result = result.replace(
    completeInsertPattern,
    (line, indent) =>
      `${line}\n` +
      `${indent}window.parent.postMessage({\n` +
      `${indent}  type: 'aicraft:lesson-complete',\n` +
      `${indent}  score: quizScore ?? answers.filter(a=>a===true).length,\n` +
      `${indent}  total: 3\n` +
      `${indent}}, window.location.origin);`,
  );

  // 2. Rewrite the next-lesson anchor.
  // Pattern: <a href="..." class="next-lesson">  (href can be # or some/path.html)
  const nextAnchorPattern = /<a\s+href="[^"]*"\s+class="next-lesson"\s*>/;
  if (!nextAnchorPattern.test(result)) {
    return {
      changed: false,
      reason: "next-lesson anchor not found",
      error: true,
    };
  }
  result = result.replace(
    nextAnchorPattern,
    `<a href="#" class="next-lesson" onclick="window.parent.postMessage({type:'aicraft:lesson-navigate-next'},window.location.origin);return false;">`,
  );

  return { changed: true, content: result, kind: "lesson" };
}

function patchNoOpFinaleLesson(content, filePath) {
  let result = content;

  // 1. Replace the no-op listener with a call to updateCompletion().
  const noOpPattern =
    /actionCheck\.addEventListener\('change',\s*\(\)\s*=>\s*\{\s*\/\* no-op, finale carries the weight \*\/\s*\}\);/;
  if (!noOpPattern.test(result)) {
    return {
      changed: false,
      reason: "no-op finale listener not found",
      error: true,
    };
  }

  // 2. Inject an updateCompletion function and call it from the listener.
  // Insert before the actionCheck = ... line so the function is defined first.
  // The optional preceding comment varies, so we match only on the const decl.
  const actionCheckDeclPattern =
    /(^[ \t]*const actionCheck = document\.getElementById\('actionDone'\);\s*\n)([ \t]*)actionCheck\.addEventListener\('change',\s*\(\)\s*=>\s*\{\s*\/\* no-op, finale carries the weight \*\/\s*\}\);/m;

  if (!actionCheckDeclPattern.test(result)) {
    return {
      changed: false,
      reason: "actionCheck declaration block not found",
      error: true,
    };
  }

  result = result.replace(
    actionCheckDeclPattern,
    (_m, beforeListener, indent) =>
      `${beforeListener}${indent}function updateCompletion(quizScore) {\n` +
      `${indent}  const quizDone = answered.every(Boolean);\n` +
      `${indent}  const actionDone = actionCheck.checked;\n` +
      `${indent}  const score = quizScore ?? answers.filter(a=>a===true).length;\n` +
      `${indent}  if (quizDone && actionDone && score >= 2) {\n` +
      `${indent}    window.parent.postMessage({\n` +
      `${indent}      type: 'aicraft:lesson-complete',\n` +
      `${indent}      score: score,\n` +
      `${indent}      total: 3\n` +
      `${indent}    }, window.location.origin);\n` +
      `${indent}  }\n` +
      `${indent}}\n` +
      `${indent}actionCheck.addEventListener('change', () => updateCompletion());`,
  );

  // 3. Call updateCompletion(score) at the end of showResults().
  // showResults computes `const score = answers.filter(...)` and ends with a closing brace.
  // We inject right before the final `}` of showResults. Find the function body.
  const showResultsCallPattern =
    /(document\.getElementById\('quizResult'\)\.classList\.add\('show'\);)(\s*\n\s*\})/;
  if (!showResultsCallPattern.test(result)) {
    return {
      changed: false,
      reason: "showResults end-of-function pattern not found",
      error: true,
    };
  }
  result = result.replace(
    showResultsCallPattern,
    (_m, before, after) => `${before}\n    updateCompletion(score);${after}`,
  );

  // 4. Rewrite the finale primary button (the "next" link in these lessons).
  // Filename suffix varies across courses (module-4-review.html,
  // module-4-review-claude-code.html, module-4-review-agents.html).
  const finaleBtnPattern =
    /<a\s+href="[^"]+\.html"\s+class="finale-btn primary">/;
  if (!finaleBtnPattern.test(result)) {
    return {
      changed: false,
      reason: "finale primary button not found",
      error: true,
    };
  }
  result = result.replace(
    finaleBtnPattern,
    `<a href="#" class="finale-btn primary" onclick="window.parent.postMessage({type:'aicraft:lesson-navigate-next'},window.location.origin);return false;">`,
  );

  return { changed: true, content: result, kind: "lesson (no-op finale)" };
}

// -------------------- Patch: module review --------------------
// Two shapes exist in the wild:
//
//   Shape A (ai-fundamentals, claude-code-mastery):
//     const passed = (score / totalQuestions) >= PASS_THRESHOLD;
//     ...
//     actions.innerHTML = `<a href="lesson-X.html" class="btn btn-primary btn-big">...</a>...`;
//
//   Shape B (ai-agents-workflows):
//     const passed = score >= 3;
//     ...
//     cta.href = '#';
//     cta.innerHTML = 'Start Module N — ... →';
//
// In both cases we inject the same postMessage when passed is true. The
// continue-link rewrite differs per shape.
function patchModuleReview(content) {
  if (content.includes(PATCHED_MARKER)) {
    return { changed: false, reason: "already patched" };
  }

  let result = content;

  // Inject postMessage block after whichever passed-assignment exists.
  const passedThresholdPattern =
    /(^[ \t]*)(const passed = \(score \/ totalQuestions\) >= PASS_THRESHOLD;)/m;
  const passedScorePattern = /(^[ \t]*)(const passed = score >= \d+;)/m;

  let passedMatcher = null;
  if (passedThresholdPattern.test(result)) passedMatcher = passedThresholdPattern;
  else if (passedScorePattern.test(result)) passedMatcher = passedScorePattern;

  if (!passedMatcher) {
    return {
      changed: false,
      reason: "passed-assignment not found (neither PASS_THRESHOLD nor score>=N shape)",
      error: true,
    };
  }

  result = result.replace(
    passedMatcher,
    (_m, indent, line) =>
      `${indent}${line}\n` +
      `${indent}if (passed) {\n` +
      `${indent}  window.parent.postMessage({\n` +
      `${indent}    type: 'aicraft:lesson-complete',\n` +
      `${indent}    score: score,\n` +
      `${indent}    total: totalQuestions,\n` +
      `${indent}    isReview: true\n` +
      `${indent}  }, window.location.origin);\n` +
      `${indent}}`,
  );

  // Continue-link rewrite — try Shape A first (templated anchor inside
  // actions.innerHTML), fall back to Shape B (cta DOM property assignment).
  const shapeAAnchor =
    /<a\s+href="[^"]+\.html"\s+class="btn btn-primary btn-big">/;
  const shapeBCtaInnerHTML =
    /(^[ \t]*)(cta\.innerHTML = 'Start [^']*';)/gm;

  let kindLabel = "module-review";
  if (shapeAAnchor.test(result)) {
    result = result.replace(
      shapeAAnchor,
      `<a href="#" class="btn btn-primary btn-big" onclick="window.parent.postMessage({type:'aicraft:lesson-navigate-next'},window.location.origin);return false;">`,
    );
  } else if (shapeBCtaInnerHTML.test(result)) {
    shapeBCtaInnerHTML.lastIndex = 0;
    result = result.replace(
      shapeBCtaInnerHTML,
      (_m, indent, line) =>
        `${indent}${line}\n${indent}cta.onclick = function () { window.parent.postMessage({ type: 'aicraft:lesson-navigate-next' }, window.location.origin); return false; };`,
    );
  } else {
    // Some module reviews intentionally have no forward CTA in the pass
    // branch (e.g. claude-code-mastery/module-4-review shows a "course done"
    // celebration instead). The completion postMessage still fires above;
    // the parent's sidebar surfaces the next step.
    kindLabel = "module-review (no continue-link, parent sidebar handles next)";
  }

  return { changed: true, content: result, kind: kindLabel };
}

// -------------------- Patch: final assessment --------------------
// 1. Inject postMessage after `const passed = ... PASS_THRESHOLD;` regardless of pass/fail.
// 2. Rewrite the "View your certificate" anchor to emit aicraft:assessment-navigate-certificate.
function patchFinalAssessment(content) {
  if (content.includes(PATCHED_MARKER_ASSESS)) {
    return { changed: false, reason: "already patched" };
  }

  let result = content;

  const passedLinePattern =
    /(^[ \t]*)(const passed = \(score \/ totalQuestions\) >= PASS_THRESHOLD;)/m;
  if (!passedLinePattern.test(result)) {
    return {
      changed: false,
      reason: "PASS_THRESHOLD assignment not found",
      error: true,
    };
  }

  result = result.replace(
    passedLinePattern,
    (_m, indent, line) =>
      `${indent}${line}\n` +
      `${indent}window.parent.postMessage({\n` +
      `${indent}  type: 'aicraft:assessment-complete',\n` +
      `${indent}  score: score,\n` +
      `${indent}  total: totalQuestions,\n` +
      `${indent}  passed: passed,\n` +
      `${indent}  answers: answers\n` +
      `${indent}}, window.location.origin);`,
  );

  // Rewrite the certificate anchor inside the dynamic actions.innerHTML.
  const certAnchorPattern =
    /<a\s+href="certificate\.html"\s+class="btn btn-primary btn-big">/;
  if (!certAnchorPattern.test(result)) {
    return {
      changed: false,
      reason: "certificate anchor not found in actions.innerHTML",
      error: true,
    };
  }
  result = result.replace(
    certAnchorPattern,
    `<a href="#" class="btn btn-primary btn-big" onclick="window.parent.postMessage({type:'aicraft:assessment-navigate-certificate'},window.location.origin);return false;">`,
  );

  return { changed: true, content: result, kind: "final-assessment" };
}

// -------------------- Patch: certificate --------------------
// Replaces the entire <script>...</script> block with a query-param reader,
// removes the privacy note, and removes the "Edit name" button (which calls
// backToName, no longer defined).
function patchCertificate(content) {
  if (content.includes(PATCHED_MARKER_CERT)) {
    return { changed: false, reason: "already patched" };
  }

  let result = content;

  // 1. Remove the privacy note paragraph.
  // Original structure (just the note block):
  //   <div class="name-note">
  //     <span>...</span>
  //     <div>...<strong>A note on privacy.</strong>...</div>
  //   </div>
  // Replace it (and the surrounding whitespace) with nothing — the
  // surrounding name-card and name-screen close tags stay intact.
  const privacyPattern =
    /\s*<div class="name-note">[\s\S]*?<strong>A note on privacy\.<\/strong>[\s\S]*?<\/div>\s*<\/div>/;
  if (!privacyPattern.test(result)) {
    return {
      changed: false,
      reason: "privacy note block not found",
      error: true,
    };
  }
  result = result.replace(privacyPattern, "");

  // 2. Remove the "Edit name" button (calls backToName, no longer present).
  const editNameBtnPattern =
    /<button\s+class="btn btn-ghost"\s+onclick="backToName\(\)">[^<]*<\/button>\s*/;
  if (!editNameBtnPattern.test(result)) {
    return {
      changed: false,
      reason: "Edit name button not found",
      error: true,
    };
  }
  result = result.replace(editNameBtnPattern, "");

  // 3. Replace the entire <script> block with the new query-param reader.
  const scriptPattern = /<script>[\s\S]*?<\/script>/;
  if (!scriptPattern.test(result)) {
    return {
      changed: false,
      reason: "<script> block not found",
      error: true,
    };
  }

  const newScript = `<script>
  // ${PATCHED_MARKER_CERT}
  // ============ READ FROM QUERY PARAMS ============
  (function () {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const dateRaw = params.get('date');
    const id = params.get('id');

    const nameScreen = document.getElementById('nameScreen');
    const certScreen = document.getElementById('certScreen');

    if (!name || !dateRaw || !id) {
      if (nameScreen) {
        nameScreen.innerHTML =
          '<div class="name-meta"><span>AICraft Learning certificate</span></div>' +
          '<h1 class="name-title">This certificate page must be opened from the AICraft learning area.</h1>' +
          '<p class="name-lede">Sign in and open your certificate from the course home page to view it.</p>';
      }
      return;
    }

    let prettyDate = dateRaw;
    try {
      const d = new Date(dateRaw);
      if (!isNaN(d.getTime())) {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        prettyDate = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
      }
    } catch (e) {
      // keep raw value
    }

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('certName', name);
    setText('certDate', prettyDate);
    setText('certId', id);
    setText('headerDate', prettyDate);
    setText('headerId', id);

    if (nameScreen) nameScreen.style.display = 'none';
    if (certScreen) certScreen.classList.add('show');
  })();

  // ------------------ COPY SHARE TEXT ------------------
  function copyShareText() {
    const text = document.getElementById('shareTemplate').textContent;
    const btn = document.getElementById('copyBtn');
    const btnText = document.getElementById('copyBtnText');

    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      btnText.textContent = '✓ Copied';
      setTimeout(() => {
        btn.classList.remove('copied');
        btnText.textContent = 'Copy to clipboard';
      }, 2200);
    }).catch(() => {
      btnText.textContent = 'Press Ctrl+C / ⌘+C';
      setTimeout(() => { btnText.textContent = 'Copy to clipboard'; }, 2200);
    });
  }
</script>`;

  result = result.replace(scriptPattern, newScript);

  return { changed: true, content: result, kind: "certificate" };
}

// -------------------- Driver --------------------
function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const kind = classify(filePath);

  let outcome;
  switch (kind) {
    case "lesson":
      outcome = patchLesson(content, filePath);
      break;
    case "module-review":
      outcome = patchModuleReview(content);
      break;
    case "final-assessment":
      outcome = patchFinalAssessment(content);
      break;
    case "certificate":
      outcome = patchCertificate(content);
      break;
    default:
      return { skipped: true, reason: `unknown file type: ${kind}` };
  }

  if (outcome.error) {
    return { error: true, reason: outcome.reason };
  }

  if (!outcome.changed) {
    return { skipped: true, reason: outcome.reason };
  }

  if (!dryRun) {
    fs.writeFileSync(filePath, outcome.content, "utf8");
  }
  return { patched: true, kind: outcome.kind };
}

function gatherFiles() {
  if (singleFilePath) {
    if (!fs.existsSync(singleFilePath)) {
      console.error(`ERROR: --single-file does not exist: ${singleFilePath}`);
      process.exit(1);
    }
    return [singleFilePath];
  }
  const out = [];
  for (const course of COURSES) {
    const dir = path.join(ROOT, course);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".html")) out.push(path.join(dir, name));
    }
  }
  return out.sort();
}

function relPath(p) {
  return path.relative(process.cwd(), p).replace(/\\/g, "/");
}

function main() {
  const files = gatherFiles();
  console.log(
    `Patch script: ${dryRun ? "DRY RUN — no writes." : "WRITING CHANGES."}` +
      (singleFilePath ? ` (single file)` : ""),
  );
  console.log(`Targeting ${files.length} file(s).\n`);

  let patched = 0;
  let skipped = 0;
  const errors = [];

  for (const filePath of files) {
    const rel = relPath(filePath);
    const r = processFile(filePath);
    if (r.error) {
      console.log(`  ERROR  ${rel}  —  ${r.reason}`);
      errors.push({ file: rel, reason: r.reason });
    } else if (r.patched) {
      console.log(`  PATCHED  ${rel}  (${r.kind})`);
      patched++;
    } else if (r.skipped) {
      console.log(`  skipped  ${rel}  —  ${r.reason}`);
      skipped++;
    }
  }

  console.log(
    `\nSummary: Patched ${patched}. Skipped (already patched or unchanged) ${skipped}. Errors ${errors.length}.`,
  );
  if (errors.length > 0) {
    console.log("\nErrors:");
    for (const e of errors) console.log(`  - ${e.file}: ${e.reason}`);
    process.exit(2);
  }
}

main();
