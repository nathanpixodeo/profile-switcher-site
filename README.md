# Claude Profile Manager landing page

Static landing page for the public
[`@nathanpixodeo/claude-profile-manager`](https://www.npmjs.com/package/@nathanpixodeo/claude-profile-manager)
package.

The page uses local HTML, CSS, and JavaScript only. It has no build step,
runtime dependencies, analytics, cookies, external fonts, or tracking scripts.

## Pages

- `index.html` — product overview and install landing page.
- `docs.html` — visual setup, command, isolation, troubleshooting, and uninstall guide.

## Preview

From the repository root:

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173/> for the overview or
<http://127.0.0.1:4173/docs.html> for documentation.

## Verify

Node.js 22 or newer is required.

```bash
npm run verify
```

Verification checks JavaScript syntax, required product and compliance copy,
accessibility landmarks, public links, tracking exclusions, and the
dependency-free repository boundary.

## Project status

This is an independent, unofficial project. It is not affiliated with,
endorsed by, sponsored by, or maintained by Anthropic. Use only accounts you
own or are explicitly authorized to administer, subject to current Anthropic
terms and policies.

This repository contains source only. GitHub Pages and automated deployment
are intentionally not configured.

The repository is `UNLICENSED`; no copyright license is granted.
