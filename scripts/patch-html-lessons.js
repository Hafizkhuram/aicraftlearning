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
  // The exact pattern in every standard lesson:
  //   if (quizDone && actionDone && (quizScore ?? answers.filter(a=>a===true).length) >= 2) {
  //     statusEl.classList.add('complete');
  //     statusEl.innerHTML = '<span>✓</span><span>Lesson complete</span>';
  //   }
  // Insert the postMessage line after the innerHTML line and before the closing brace.
  const completeInnerLine =
    "statusEl.innerHTML = '<span>✓</span><span>Lesson complete</span>';";
  if (!result.includes(completeInnerLine)) {
    return {
      changed: false,
      reason: `lesson-complete branch not found (missing innerHTML 'Lesson complete' line)`,
      error: true,
    };
  }

  // Match the line plus its leading indent so we can preserve the indent on the inserted block.
  const completeInsertPattern =
    /(^[ \t]*)statusEl\.innerHTML = '<span>✓<\/span><span>Lesson complete<\/span>';/m;
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
  const actionCheckDeclPattern =
    /(\/\/ Action checkbox[^\n]*\n\s*const actionCheck = document\.getElementById\('actionDone'\);\s*\n)\s*actionCheck\.addEventListener\('change',\s*\(\)\s*=>\s*\{\s*\/\* no-op, finale carries the weight \*\/\s*\}\);/;

  if (!actionCheckDeclPattern.test(result)) {
    return {
      changed: false,
      reason: "actionCheck declaration block not found",
      error: true,
    };
  }

  result = result.replace(
    actionCheckDeclPattern,
    (_m, beforeListener) =>
      `${beforeListener}  function updateCompletion(quizScore) {\n` +
      `    const quizDone = answered.every(Boolean);\n` +
      `    const actionDone = actionCheck.checked;\n` +
      `    const score = quizScore ?? answers.filter(a=>a===true).length;\n` +
      `    if (quizDone && actionDone && score >= 2) {\n` +
      `      window.parent.postMessage({\n` +
      `        type: 'aicraft:lesson-complete',\n` +
      `        score: score,\n` +
      `        total: 3\n` +
      `      }, window.location.origin);\n` +
      `    }\n` +
      `  }\n` +
      `  actionCheck.addEventListener('change', () => updateCompletion());`,
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
  // Pattern: <a href="module-N-review.html" class="finale-btn primary">
  const finaleBtnPattern =
    /<a\s+href="module-\d+-review\.html"\s+class="finale-btn primary">/;
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
// 1. Inject postMessage right after `const passed = ... PASS_THRESHOLD;` line.
// 2. Rewrite the "Start Module N" / "Start the final assessment" anchor in
//    actions.innerHTML to emit aicraft:lesson-navigate-next.
function patchModuleReview(content) {
  if (content.includes(PATCHED_MARKER)) {
    return { changed: false, reason: "already patched" };
  }

  let result = content;

  const passedLinePattern =
    /(const passed = \(score \/ totalQuestions\) >= PASS_THRESHOLD;)/;
  if (!passedLinePattern.test(result)) {
    return {
      changed: false,
      reason: "PASS_THRESHOLD assignment not found",
      error: true,
    };
  }

  result = result.replace(
    passedLinePattern,
    (_m, line) =>
      `${line}\n    if (passed) {\n` +
      `      window.parent.postMessage({\n` +
      `        type: 'aicraft:lesson-complete',\n` +
      `        score: score,\n` +
      `        total: totalQuestions,\n` +
      `        isReview: true\n` +
      `      }, window.location.origin);\n` +
      `    }`,
  );

  // Rewrite the primary anchor inside actions.innerHTML.
  // Pattern: <a href="(lesson-N-N|final-assessment).html" class="btn btn-primary btn-big">
  const primaryAnchorPattern =
    /<a\s+href="(?:lesson-\d+-\d+|final-assessment)\.html"\s+class="btn btn-primary btn-big">/;
  if (!primaryAnchorPattern.test(result)) {
    return {
      changed: false,
      reason: "primary continue anchor not found in actions.innerHTML",
      error: true,
    };
  }
  result = result.replace(
    primaryAnchorPattern,
    `<a href="#" class="btn btn-primary btn-big" onclick="window.parent.postMessage({type:'aicraft:lesson-navigate-next'},window.location.origin);return false;">`,
  );

  return { changed: true, content: result, kind: "module-review" };
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
    /(const passed = \(score \/ totalQuestions\) >= PASS_THRESHOLD;)/;
  if (!passedLinePattern.test(result)) {
    return {
      changed: false,
      reason: "PASS_THRESHOLD assignment not found",
      error: true,
    };
  }

  result = result.replace(
    passedLinePattern,
    (_m, line) =>
      `${line}\n    window.parent.postMessage({\n` +
      `      type: 'aicraft:assessment-complete',\n` +
      `      score: score,\n` +
      `      total: totalQuestions,\n` +
      `      passed: passed,\n` +
      `      answers: answers\n` +
      `    }, window.location.origin);`,
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
  const privacyPattern =
    /\s*<div class="name-note">[\s\S]*?<strong>A note on privacy\.<\/strong>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (!privacyPattern.test(result)) {
    return {
      changed: false,
      reason: "privacy note block not found",
      error: true,
    };
  }
  // Preserve the closing </div></div> for the name-card and name-screen wrappers.
  result = result.replace(
    privacyPattern,
    `\n  </div>\n  </div>`,
  );

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
