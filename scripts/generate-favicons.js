/* eslint-disable @typescript-eslint/no-require-imports */
/*
 * Build-time favicon generator.
 * Run: node scripts/generate-favicons.js
 *
 * Renders /public/icon-source*.svg → all favicon PNG sizes + favicon.ico.
 * Output is committed; this script only re-runs when the source SVGs change.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const SRC_WITH_TEXT = path.join(PUBLIC_DIR, "icon-source.svg");
const SRC_NO_TEXT = path.join(PUBLIC_DIR, "icon-source-no-text.svg");

async function renderPng(srcPath, size, outName) {
  const out = path.join(PUBLIC_DIR, outName);
  await sharp(srcPath, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log(`wrote ${outName}`);
  return out;
}

async function main() {
  // 16x16 uses the no-text source so the green node reads cleanly at tab size.
  await renderPng(SRC_NO_TEXT, 16, "icon-16.png");

  // Everything else carries the AI lettering.
  await renderPng(SRC_WITH_TEXT, 32, "icon-32.png");
  await renderPng(SRC_WITH_TEXT, 180, "apple-touch-icon.png");
  await renderPng(SRC_WITH_TEXT, 192, "icon-192.png");
  await renderPng(SRC_WITH_TEXT, 512, "icon-512.png");

  // .ico bundles 16/32/48 — the 48 is generated to a temp file then folded into the ico.
  const tmp48 = path.join(PUBLIC_DIR, "icon-48.tmp.png");
  await sharp(SRC_WITH_TEXT, { density: 384 })
    .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(tmp48);

  const icoBuf = await pngToIco([
    path.join(PUBLIC_DIR, "icon-16.png"),
    path.join(PUBLIC_DIR, "icon-32.png"),
    tmp48,
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuf);
  fs.unlinkSync(tmp48);
  console.log("wrote favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
