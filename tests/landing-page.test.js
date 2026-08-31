'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const packageMetadata = require('../package.json');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function count(pattern, content = html) {
  return [...content.matchAll(pattern)].length;
}

test('landing page has required content and accurate product claims', () => {
  assert.match(html, /Profile CLI for Claude Code/);
  assert.match(html, /npm install -g @nathanpixodeo\/claude-profile-manager/);
  assert.match(html, /Node\.js 22\+/);
  assert.match(html, /Windows 10, 11, and Server/);
  assert.match(html, /Node\.js-supported distributions/);
  assert.match(html, /Node\.js-supported versions/);
  assert.match(html, /CLAUDE_CONFIG_DIR/);
  assert.match(html, /claude-profiles doctor/);
  assert.match(html, /claude-team --continue/);
  assert.match(html, /not affiliated with, endorsed by, sponsored by, or maintained by Anthropic/i);
  assert.match(html, /Use only accounts you own or are explicitly authorized to administer/i);
  assert.match(html, /do not (?:change|aggregate, extend, evade, or alter) billing, subscription allowances, rate limits, bans, safeguards, or product restrictions/i);
  assert.match(html, /does not[\s\S]*Proxy, intercept, modify, or automate Anthropic requests/i);
});

test('landing page exposes required sections and accessibility landmarks', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<a class="skip-link" href="#main-content">/);
  assert.match(html, /<header class="site-header">/);
  assert.match(html, /<nav class="site-nav" aria-label="Primary navigation">/);
  assert.match(html, /<a class="nav-primary" href="\.\/docs\.html">Documentation<\/a>/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, /<footer class="site-footer">/);
  assert.equal(count(/<h1\b/g), 1, 'Landing page must have exactly one h1.');

  for (const section of ['benefits', 'workflow', 'platforms', 'safety', 'faq']) {
    assert.match(html, new RegExp(`id="${section}"`), `Missing ${section} section.`);
  }

  assert.ok(count(/<details>/g) >= 4, 'FAQ must use keyboard-accessible native details controls.');
  assert.ok(count(/aria-live="polite"/g) >= 2, 'Copy interactions must announce their result.');
  assert.equal(count(/<button(?![^>]*\btype=)[^>]*>/g), 0, 'Every button needs an explicit type.');
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(script, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
});

test('landing links use public destinations and safe external-link attributes', () => {
  const requiredUrls = [
    'https://www.npmjs.com/package/@nathanpixodeo/claude-profile-manager',
    'https://unpkg.com/@nathanpixodeo/claude-profile-manager@0.2.1/NOTICE.md',
    'https://www.anthropic.com/legal/consumer-terms',
    'https://www.anthropic.com/legal/commercial-terms',
    'https://www.anthropic.com/legal/aup',
    'https://www.anthropic.com/supported-countries',
  ];

  for (const url of requiredUrls) {
    assert.ok(html.includes(`href="${url}"`), `Missing public URL: ${url}`);
  }

  assert.doesNotMatch(
    html,
    /https:\/\/github\.com\/nathanpixodeo\/claude-profile-cli/,
    'The public landing page must not send visitors to the private source repository.',
  );

  for (const anchor of html.match(/<a\b[\s\S]*?<\/a>/g) || []) {
    if (!/target="_blank"/.test(anchor)) continue;
    assert.match(anchor, /rel="noreferrer"/, 'External new-tab links must prevent referrer access.');
  }

  assert.doesNotMatch(html, /(?:src|href)="https?:\/\/[^\"]+\.(?:js|css|woff2?|ttf)(?:\?[^\"]*)?"/i);
  assert.doesNotMatch(html, /googletagmanager|google-analytics|segment|mixpanel|hotjar|plausible|posthog/i);
  assert.doesNotMatch(script, /document\.cookie|localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});

test('repository remains private-to-npm and dependency-free', () => {
  assert.equal(packageMetadata.private, true, 'Repository package metadata must prevent npm publication.');
  assert.equal(packageMetadata.license, 'UNLICENSED');
  assert.equal(packageMetadata.dependencies, undefined, 'Landing page must not add runtime dependencies.');
  assert.equal(packageMetadata.devDependencies, undefined, 'Landing checks must use only built-in Node.js tools.');
});
