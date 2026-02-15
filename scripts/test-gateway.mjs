#!/usr/bin/env node
import { spawn } from "node:child_process";
import process from "node:process";

const nodeProcess = spawn(process.execPath, [
  "openclaw.mjs",
  "gateway",
  "--allow-unconfigured",
  "--dev",
]);

nodeProcess.stdout.on("data", (data) => {
  process.stdout.write(data);
});

nodeProcess.stderr.on("data", (data) => {
  process.stderr.write(data);
});

nodeProcess.on("exit", (code, signal) => {
  console.log(`Process exited with code ${code} and signal ${signal}`);
  process.exit(code ?? 1);
});

setTimeout(() => {
  console.log("Timeout: killing process");
  nodeProcess.kill("SIGTERM");
}, 5000);
