# Profile Switcher site

Static landing page and documentation for [`@nexkit/profile-switcher`](https://www.npmjs.com/package/@nexkit/profile-switcher).

Production site: https://profile-switcher.pages.dev/

The site uses local HTML, CSS, and JavaScript only. It has no build step, runtime dependencies, analytics, cookies, external fonts, or tracking scripts.

## Pages

- `index.html` — product overview and installation page.
- `docs.html` — setup, migration, commands, isolation, sharing, troubleshooting, and uninstall guide.

## Preview

```bash
python -m http.server 4173
```

Open <http://127.0.0.1:4173/> or <http://127.0.0.1:4173/docs.html>.

## Verify

Node.js 22 or newer is required.

```bash
npm run verify
```

Verification covers JavaScript syntax, product and compliance copy, accessibility landmarks, public links, tracking exclusions, and the dependency-free repository boundary.

## Third-party status

Profile Switcher is an independent, unofficial project. It is not affiliated with, endorsed by, sponsored by, or maintained by Anthropic. Use only accounts you own or are authorized to administer, subject to current Anthropic terms and policies.

Licensed under the MIT License.
