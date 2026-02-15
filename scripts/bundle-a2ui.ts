import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const HASH_FILE = path.join(ROOT_DIR, "src", "canvas-host", "a2ui", ".bundle.hash");
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "canvas-host", "a2ui", "a2ui.bundle.js");
const A2UI_RENDERER_DIR = path.join(ROOT_DIR, "vendor", "a2ui", "renderers", "lit");
const A2UI_APP_DIR = path.join(ROOT_DIR, "apps", "shared", "OpenClawKit", "Tools", "CanvasA2UI");

const INPUT_PATHS = [
  path.join(ROOT_DIR, "package.json"),
  path.join(ROOT_DIR, "pnpm-lock.yaml"),
  A2UI_RENDERER_DIR,
  A2UI_APP_DIR,
];

async function walk(entryPath: string, files: string[]) {
  try {
    const st = await fs.stat(entryPath);
    if (st.isDirectory()) {
      const entries = await fs.readdir(entryPath);
      for (const entry of entries) {
        await walk(path.join(entryPath, entry), files);
      }
      return;
    }
    files.push(entryPath);
  } catch (err) {
    // If path doesn't exist, we'll handle it in the main logic if needed
  }
}

async function computeHash() {
  const files: string[] = [];
  for (const input of INPUT_PATHS) {
    await walk(input, files);
  }

  function normalize(p: string) {
    return p.split(path.sep).join("/");
  }

  files.sort((a, b) => normalize(a).localeCompare(normalize(b)));

  const hash = createHash("sha256");
  for (const filePath of files) {
    const rel = normalize(path.relative(ROOT_DIR, filePath));
    hash.update(rel);
    hash.update("\0");
    hash.update(await fs.readFile(filePath));
    hash.update("\0");
  }

  return hash.digest("hex");
}

async function run(command: string, args: string[], cwd: string) {
  return new Promise<void>((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(" ")} in ${cwd}`);
    const proc = spawn(command, args, { stdio: "inherit", cwd, shell: true });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  // Docker builds exclude vendor/apps via .dockerignore.
  // In that environment we must keep the prebuilt bundle.
  let sourcesMissing = false;
  try {
    await fs.access(A2UI_RENDERER_DIR);
    await fs.access(A2UI_APP_DIR);
  } catch {
    sourcesMissing = true;
  }

  if (sourcesMissing) {
    console.log("A2UI sources missing; keeping prebuilt bundle.");
    return;
  }

  const currentHash = await computeHash();
  let previousHash = "";
  try {
    previousHash = await fs.readFile(HASH_FILE, "utf-8");
  } catch {
    // Ignore missing hash file
  }

  const outputExists = await fs.access(OUTPUT_FILE).then(() => true).catch(() => false);

  if (previousHash.trim() === currentHash && outputExists) {
    console.log("A2UI bundle up to date; skipping.");
    return;
  }

  try {
    await run("pnpm", ["-s", "exec", "tsc", "-p", path.join(A2UI_RENDERER_DIR, "tsconfig.json")], ROOT_DIR);
    await run("rolldown", ["-c", path.join(A2UI_APP_DIR, "rolldown.config.mjs")], ROOT_DIR);

    await fs.mkdir(path.dirname(HASH_FILE), { recursive: true });
    await fs.writeFile(HASH_FILE, currentHash);
    console.log("A2UI bundle updated.");
  } catch (err) {
    console.error("A2UI bundling failed. Re-run with: pnpm canvas:a2ui:bundle");
    console.error("If this persists, verify pnpm deps and try again.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
