# Legal documents — hosting

Two markdown files here:
- `privacy.md` — Privacy Policy
- `terms.md` — Terms of Service

## How to host (before public release)

**Option 1 — GitHub Pages (free, recommended)**

1. GitHub repo → Settings → Pages
2. Source: `Deploy from a branch` → `main` / `/docs`
3. Save → wait ~1 min
4. URLs will be:
   - `https://qaizo-app.github.io/zerik/legal/privacy.html`
   - `https://qaizo-app.github.io/zerik/legal/terms.html`
5. Convert .md → .html via any markdown renderer or just paste raw .md (GitHub Pages renders .md natively)

**Option 2 — Notion public page**

1. Copy/paste content into a Notion page
2. Share → Publish → "Anyone with the link"
3. Use that URL in `apps/senik/config/brand.config.js → legal.privacyUrl`

**Option 3 — Standalone landing site (zerik.app)**

When you set up the marketing landing page, add `/privacy` and `/terms` routes there.

## Wiring into the app

Once URLs are live, fill them in `apps/senik/config/brand.config.js`:

```js
legal: {
  privacyUrl:   'https://qaizo-app.github.io/zerik/legal/privacy.html',
  termsUrl:     'https://qaizo-app.github.io/zerik/legal/terms.html',
  supportEmail: 'support@your-domain.com'
}
```

After this, Settings → About → Privacy Policy / Terms / Support will appear and tap will open the URL in browser.

## Required for store submission

Both Apple App Store and Google Play require a public Privacy Policy URL before app review. Terms are recommended but not always required.
