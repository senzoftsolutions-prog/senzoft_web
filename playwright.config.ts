import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER
    ? undefined
    : {
        command: "node node_modules/vite/bin/vite.js preview --host 127.0.0.1",
        port: 4173,
        reuseExistingServer: true,
      },
  projects: [
    { name: "windows-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mac-webkit", use: { ...devices["Desktop Safari"] } },
    { name: "android-mobile", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 15"] } },
    { name: "ipad", use: { ...devices["iPad Pro 11"] } },
  ],
});
