"use strict";

const assert = require("node:assert/strict");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const test = require("node:test");

const redirectPath = path.resolve(__dirname, "../legacy-redirect/_redirects");
const fallbackPath = path.resolve(__dirname, "../legacy-redirect/index.html");

test('legacy hostname redirects every path permanently', async () => {
  const redirects = await readFile(redirectPath, "utf8");
  assert.equal(
    redirects.trim(),
    "/* https://profile-switcher.pages.dev/:splat 301",
  );
});

test('legacy redirect includes a noindex fallback', async () => {
  const fallback = await readFile(fallbackPath, "utf8");
  assert.match(fallback, /<meta name="robots" content="noindex">/);
  assert.match(fallback, /https:\/\/profile-switcher\.pages\.dev\//);
});
