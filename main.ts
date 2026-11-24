import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const entryPath = new URL("./entry.txt", import.meta.url);
const sentence = readFileSync(entryPath, "utf8");

if (sentence.length < 1 || sentence.length > 200) {
  throw new Error(`entry.txt must be 1 to 200 characters, got ${sentence.length}`);
}
if (sentence.trim().length === 0) {
  throw new Error("entry.txt must not be only white space");
}
if (sentence.includes("\n") || sentence.includes("\r")) {
  throw new Error("entry.txt must hold a single line");
}
const stops = (sentence.match(/\./g) ?? []).length;
if (stops !== 1 || !sentence.endsWith(".")) {
  throw new Error("entry.txt must hold exactly one sentence ending with a period");
}
const codePoints = [...sentence].length;
if (codePoints > 200) {
  throw new Error(`entry.txt must be at most 200 characters, got ${codePoints}`);
}

const rawOutDir = process.env.MAKEFUN_OUTPUT_DIR;
const outDir = rawOutDir !== undefined && rawOutDir !== "" ? rawOutDir : "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, sentence, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== sentence) {
  throw new Error("read-back mismatch: output differs from entry.txt");
}
console.log(`Wrote ${sentence.length} characters to ${outPath}`);
console.log(sentence);
