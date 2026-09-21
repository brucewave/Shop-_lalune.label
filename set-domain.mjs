#!/usr/bin/env node
/**
 * Đổi tên miền dùng trong canonical, og:image, sitemap.xml và robots.txt.
 *
 *   node set-domain.mjs https://ten-mien-that.vercel.app
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const next = (process.argv[2] || "").trim().replace(/\/+$/, "");
if (!/^https?:\/\/[^\s/]+$/.test(next)) {
  console.error("Cách dùng: node set-domain.mjs https://ten-mien-that.vercel.app");
  process.exit(1);
}

const CURRENT = /https:\/\/lalune-label\.vercel\.app/g;
const EXTENSIONS = new Set([".html", ".xml", ".txt", ".json", ".js", ".md"]);
const SKIP = new Set(["node_modules", ".git", "assets", "image_modal", "note"]);

let changed = 0;
for (const name of readdirSync(".", { withFileTypes: true })) {
  if (name.isDirectory() || SKIP.has(name.name)) continue;
  if (!EXTENSIONS.has(extname(name.name))) continue;

  const path = join(".", name.name);
  const before = readFileSync(path, "utf8");
  const after = before.replace(CURRENT, next);
  if (after === before) continue;

  writeFileSync(path, after, "utf8");
  const hits = (before.match(CURRENT) || []).length;
  console.log(`  ${name.name.padEnd(16)} ${hits} chỗ`);
  changed += hits;
}

console.log(changed ? `\nĐã đổi ${changed} chỗ sang ${next}` : "Không tìm thấy tên miền cũ nào để đổi.");
