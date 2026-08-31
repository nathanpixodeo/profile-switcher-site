'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const landingHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const docsHtml = fs.readFileSync(path.join(root, 'docs.html'), 'utf8');
const sharedCss = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const docsCss = fs.readFileSync(path.join(root, 'docs.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function count(pattern, content = docsHtml) {
  return [...content.matchAll(pattern)].length;
}

test('documentation covers the supported operational path', () => {
  for (const section of [
    'requirements',
    'quick-start',
    'commands',
    'isolation',
    'sharing',
    'troubleshooting',
    'uninstall',
    'safety',
  ]) {
    assert.match(docsHtml, new RegExp(`id="${section}"`), `Missing ${section} documentation.`);
  }

  const requiredCommands = [
    'claude-profiles add &lt;profile&gt; [--command &lt;claude-name&gt;] [--login]',
    'claude-profiles run &lt;profile&gt; [--] [claude arguments...]',
    'claude-profiles continue &lt;profile&gt;',
    'claude-profiles resume &lt;profile&gt;',
    'claude-profiles login &lt;profile&gt;',
    'claude-profiles status &lt;profile&gt;',
    'claude-profiles diagnose &lt;profile&gt;',
    'claude-profiles repair-onboarding &lt;profile&gt;',
    'claude-profiles share-sessions &lt;profile&gt; [--backup-existing]',
    'claude-profiles share-skills &lt;profile&gt; [--backup-existing]',
    'claude-profiles command create &lt;profile&gt; [claude-command]',
    'claude-profiles command remove &lt;claude-command&gt;',
    'claude-profiles command list',
    'claude-profiles command sync',
    'claude-profiles command clean',
    'claude-profiles doctor',
  ];

  for (const command of requiredCommands) {
    assert.ok(docsHtml.includes(command), `Missing supported command: ${command}`);
  }

  assert.match(docsHtml, /Exit code <code>2<\/code> means nothing changed/);
  assert.match(docsHtml, /profile directories, command mappings, sessions, state, skills, and credentials/i);
  assert.match(docsHtml, /Re-login for reserved <code>max<\/code> is intentionally blocked/);
});

test('documentation navigation and controls are accessible', () => {
  assert.match(docsHtml, /<html lang="en">/);
  assert.match(docsHtml, /<a class="skip-link" href="#main-content">/);
  assert.match(docsHtml, /<main id="main-content">/);
  assert.match(docsHtml, /<aside class="docs-toc" aria-label="Documentation sections">/);
  assert.match(docsHtml, /<a class="nav-primary" href="\.\/index\.html">Overview<\/a>/);
  assert.match(landingHtml, /href="\.\/docs\.html">Documentation<\/a>/);
  assert.equal(count(/<h1\b/g), 1, 'Documentation must have exactly one h1.');
  assert.ok(count(/<details(?:\s|>)/g) >= 6, 'Troubleshooting and compatibility notes must use native details controls.');
  assert.ok(count(/aria-live="polite"/g) >= 6, 'Copy results must be announced.');
  assert.equal(count(/<button(?![^>]*\btype=)[^>]*>/g), 0, 'Every documentation button needs an explicit type.');
  assert.match(sharedCss, /:focus-visible/);
  assert.match(sharedCss, /@media \(prefers-reduced-motion: reduce\)/);
});

test('documentation is responsive, copyable, and dependency-free', () => {
  assert.match(docsHtml, /<link rel="stylesheet" href="\.\/docs\.css">/);
  assert.match(docsHtml, /<script src="\.\/script\.js" defer><\/script>/);
  assert.match(docsCss, /\.docs-shell/);
  assert.match(docsCss, /@media \(max-width: 35rem\)/);
  assert.match(docsCss, /overflow-x: auto/);
  assert.match(script, /closest\('\.install-block, \.cta-inner, \.docs-code'\)/);
  assert.match(script, /navigator\.clipboard/);

  assert.doesNotMatch(docsHtml, /(?:src|href)="https?:\/\/[^\"]+\.(?:js|css|woff2?|ttf)(?:\?[^\"]*)?"/i);
  assert.doesNotMatch(docsHtml, /googletagmanager|google-analytics|segment|mixpanel|hotjar|plausible|posthog/i);
  assert.doesNotMatch(script, /document\.cookie|localStorage|sessionStorage|fetch\(|XMLHttpRequest/);
});

test('documentation uses public policy destinations only', () => {
  const requiredUrls = [
    'https://www.npmjs.com/package/@nathanpixodeo/claude-profile-manager',
    'https://unpkg.com/@nathanpixodeo/claude-profile-manager@0.2.1/NOTICE.md',
    'https://www.anthropic.com/legal/consumer-terms',
    'https://www.anthropic.com/legal/commercial-terms',
    'https://www.anthropic.com/legal/aup',
    'https://www.anthropic.com/supported-countries',
  ];

  for (const url of requiredUrls) {
    assert.ok(docsHtml.includes(`href="${url}"`), `Missing public URL: ${url}`);
  }

  assert.doesNotMatch(docsHtml, /https:\/\/github\.com\/nathanpixodeo\/claude-profile-cli/);
  for (const anchor of docsHtml.match(/<a\b[\s\S]*?<\/a>/g) || []) {
    if (!/target="_blank"/.test(anchor)) continue;
    assert.match(anchor, /rel="noreferrer"/, 'External new-tab links must prevent referrer access.');
  }
});
