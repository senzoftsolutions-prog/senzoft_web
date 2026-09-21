import { spawn } from "node:child_process";

const root = new URL("../", import.meta.url);
const preview = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1"],
  { cwd: root, stdio: "inherit" },
);

async function waitForPreview() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch("http://127.0.0.1:4173/");
      if (response.ok) return;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Vite preview did not become ready on port 4173.");
}

function runPlaywright(project) {
  return new Promise((resolve, reject) => {
    const test = spawn(
      process.execPath,
      [
        "node_modules/@playwright/test/cli.js",
        "test",
        "tests/e2e/seo.spec.ts",
        `--project=${project}`,
        "--workers=1",
      ],
      {
        cwd: root,
        env: { ...process.env, PLAYWRIGHT_EXTERNAL_SERVER: "1" },
        stdio: "inherit",
      },
    );
    test.once("error", reject);
    test.once("exit", (code) => resolve(code ?? 1));
  });
}

let exitCode = 1;
try {
  await waitForPreview();
  exitCode = await runPlaywright(process.env.SEO_BROWSER ?? "windows-chromium");
} finally {
  preview.kill();
}

process.exitCode = exitCode;
