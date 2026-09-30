#!/usr/bin/env node
// freeload — zero-dependency free-model router CLI.
// Usage:
//   node bin/freeload.mjs route <plan|code|edit|chat> [attempt]
//   node bin/freeload.mjs models
//   node bin/freeload.mjs doctor
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = join(root, "freeload.json");

function loadConfig() {
  if (!existsSync(configPath)) {
    console.error(`freeload: config not found at ${configPath}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, "utf8"));
}

function cmdRoute(args) {
  const cfg = loadConfig();
  const cls = (args[0] || "").toLowerCase();
  const attempt = Number.parseInt(args[1] ?? "0", 10) || 0;
  const chain = cfg.classes?.[cls]?.chain;
  if (!chain) {
    console.error(`freeload: unknown class "${args[0] || ""}". Use: ${Object.keys(cfg.classes || {}).join("|")}`);
    process.exit(1);
  }
  if (attempt >= chain.length) {
    console.error(`freeload: chain exhausted for class "${cls}" after ${chain.length} models. Drop a class level or ask to escalate.`);
    process.exit(2);
  }
  console.log(chain[attempt]);
}

function cmdModels() {
  const cfg = loadConfig();
  for (const [cls, def] of Object.entries(cfg.classes || {})) {
    console.log(`[${cls}] ${def.description}`);
    for (const m of def.chain) console.log(`  - ${m}`);
  }
}

function cmdDoctor() {
  const cfg = loadConfig();
  const problems = [];
  if (!cfg.classes || Object.keys(cfg.classes).length === 0) problems.push("no classes defined");
  for (const [cls, def] of Object.entries(cfg.classes || {})) {
    if (!Array.isArray(def.chain) || def.chain.length === 0) problems.push(`class "${cls}" has an empty chain`);
  }
  if (!cfg.fallback?.strategy) problems.push("no fallback strategy defined");
  console.log(`node ${process.version} — config ${configPath}`);
  if (problems.length > 0) {
    for (const p of problems) console.error(`freeload doctor: ${p}`);
    process.exit(1);
  }
  const total = Object.values(cfg.classes).reduce((n, d) => n + d.chain.length, 0);
  console.log(`freeload doctor: OK — ${Object.keys(cfg.classes).length} classes, ${total} routed models, all $0`);
}

const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "route") cmdRoute(rest);
else if (cmd === "models") cmdModels();
else if (cmd === "doctor") cmdDoctor();
else {
  console.error("freeload: usage: route <plan|code|edit|chat> [attempt] | models | doctor");
  process.exit(1);
}
