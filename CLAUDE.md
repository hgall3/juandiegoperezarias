# juandiegoperezarias

Personal portfolio site. React 19 + Vite, styled with SCSS. No TypeScript — plain `.jsx`.

## Commands

```bash
npm run dev      # local dev server
npm run build    # production build to dist/
npm run lint     # eslint
npm run preview  # serve the production build locally
```

## Structure

```
src/pages/<Name>/       Route-level views (see the route table below)
src/components/<Name>/  Reusable UI (Navbar, Footer)
src/styles/             Global SCSS partials
src/hooks/              Shared hooks, one file each (no folder, no styles)
src/content/            The site's copy: titles, lists, anything editorial
```

Every file under `src/` is named `.jsx`, including modules that hold no JSX at
all — data modules and hooks included. The extension is uniform on purpose rather
than describing each file's contents. Root config files (`vite.config.js`,
`eslint.config.js`) run in Node and keep `.js`.

Every page and component lives in its own folder holding a matching `.jsx` and
`.scss` file — `Navbar/Navbar.jsx` alongside `Navbar/Navbar.scss`. Follow this
pattern for anything new; don't add loose files directly under `components/`.

## Styling

SCSS, not CSS-in-JS. The split between the two token files is deliberate and
easy to get wrong:

- **`_variables.scss`** holds Sass-only values (`$bp-md`, `$space`). They resolve
  at build time and emit no CSS, so any number of component files can `@use` it
  for free.
- **`_theme.scss`** holds design tokens as CSS custom properties, so they can
  be swapped at runtime — Sass variables can't, since they're resolved at build
  time and gone before the page runs. This file **emits CSS**, so it must be used exactly once:
  only `main.scss` pulls it in.

Component `.scss` files must never `@use 'theme'` — that would duplicate the
custom property block in the bundle. Custom properties resolve at runtime and are
globally available, so `var(--color-border)` just works anywhere.

A component reaches the Sass variables by relative path —
`@use '../../styles/variables' as v;`. The bare `@use 'variables'` that
`main.scss` uses only resolves because that file already sits inside
`src/styles/`; from a page or component folder it fails the build.

Use the existing tokens rather than hardcoding colors or spacing.

A design reference — a screenshot, a mock-up, a spec from a design tool — gives
**layout**: what sits beside what, the order of the blocks, where a divider
falls. Its colours and type sizes are not ours. Sampling a background out of a
picture, or matching a font size it happens to use, is how a value that belongs
to no token ends up in the codebase. Map everything onto `_theme.scss`,
`_variables.scss` and the scale in `_typography.scss`, and prefer reusing an
existing rule — the `.text-small` class, the base body size — over restating a
size in a component at all.

The scheme is the default and needs no discussion. A colour in a reference that
is *close to* one we have — a cream beside `--color-bg`, a warm grey beside
`--color-text` — is simply that token; use it and move on. A colour genuinely
outside the scheme — a pink, a blue, something no token approximates — is a
question to ask: **which new token are we adding, and what is it for?** Adding
one unasked is the mistake, not noticing the difference.

Typography is set globally in `_typography.scss` — Playfair Display for `h1`–`h3`,
Work Sans for `h4`–`h6` and body copy. **Font sizes** are `rem`, because a `px`
font size ignores a reader who has raised their browser's default for legibility.
That reason is specific to type: `px` is right for hairlines, fixed touch targets
and layout dimensions that shouldn't grow with someone's font-size preference,
and `0.0625rem` for a 1px border helps nobody. Use judgment and say which you
picked. Line heights stay unitless ratios so they hold when a size steps up at
the breakpoint. Components should rely on the base
element styles rather than restating font sizes.

Fonts are **self-hosted** through [`@fontsource`](https://fontsource.org) packages,
never loaded from a CDN — a Google Fonts `<link>` would expose every visitor to a
third-party request. Each weight is imported individually at the top of `App.jsx`
(`@fontsource/work-sans/latin-600.css`), so a weight used in SCSS without a
matching import there renders as a browser-synthesised approximation rather than
the real cut. Add the import alongside any new weight.

Layout is **mobile-first**: breakpoints are only ever used with `min-width`, so
`$bp-md: 1024px` is the width at which the desktop layout takes over, not a
ceiling for the mobile one.

**The site does not follow the visitor's OS appearance setting.** There is no
`prefers-color-scheme` block and none should be added: everyone sees the same
appearance whatever their device or the time of day. `color-scheme` is set to a
single value for the same reason, since the pair lets the browser darken
scrollbars and form controls on its own.

This is not a reason to hardcode colours. They stay custom properties in
`_theme.scss`, because those are exactly what a toggle would swap — there is
simply one set of values rather than a second set behind a media query.

**Possible, not planned:** a manual light/dark toggle, chosen by the visitor. It
may never be built, so don't design around it — but keep new colour work as
custom properties in `_theme.scss` rather than hardcoded values, which is worth
doing on its own and would make such a toggle cheap if it ever happens.
A broader visual design direction is also still to come — the current styling is a
working baseline, not a finished system.

`main.scss` is imported once, at the top of `App.jsx`. Its `@use` order matters:
tokens first, then base styles that consume them.

## Language

The site is Spanish; the code is English. Every string a visitor can read is in
Spanish — headings, nav labels, body copy, page titles, meta descriptions, and
`.sr-only` text meant for screen readers. Everything a developer reads stays in
English: folder names, component names, variables, CSS class names and comments.
So the page whose heading reads "Biografía" is `pages/Biography/Biography.jsx`
styling `.biography`, and the two are not expected to match.

URL paths are the exception that follows the copy, not the code, because the
visitor reads them: `/biografia`, not `/about`. Slugs are unaccented and
hyphenated (`/foto-galeria`) — an accent or `ñ` in a URL gets percent-escaped and
turns unreadable the moment it is copied or shared.

The name is written **Perez, never Pérez**, everywhere in the project. The
unaccented spelling is deliberate, so don't add the accent even in Spanish copy.

## Routes

| Path | Component | Nav label |
| --- | --- | --- |
| `/` | `Home` | Inicio |
| `/biografia` | `Biography` | Biografía |
| `/foto-galeria` | `PhotoGallery` | Foto Galería |
| `/foto-ensayo` | `PhotoEssay` | Foto Ensayo |
| `/libros` | `Books` | Libros |
| `/videos` | `Videos` | Videos |
| `/exposiciones` | `Exhibitions` | Exposiciones |
| `/historias` | `Stories` | Historias |
| `/contacto` | `Contact` | Contacto |
| `*` | `NotFound` | — |

The navbar does not mirror this table. It groups the site under four dropdowns —
**Obra · Historias · Libros · Autor** — and `Inicio` is not among them: the
signature wordmark is the link home. Its content lives in
`components/Navbar/navigation.js`, apart from the component so `Navbar.jsx` stays
about behaviour. An item there with a `to` renders as a link; one without renders
as plain text, which is how the menu can show pages that aren't built yet without
sending anyone to a 404. Adding the page later means adding its `to`, nothing
else. Those future paths nest under their section —
`/foto-ensayo/el-hielero-del-chimborazo`.

The navbar switches from its full-screen mobile panel to the desktop row at
`$bp-sm: 768px`, not `$bp-md`.

Content does not live in components. The lists of photo essays, stories, books
and the rest are in `src/content/`, which the navbar and the section pages both
read, so a title is written once and can't drift between a menu and the page it
points at. Entries there carry the shape the content has — a book has a title and
a subtitle — and whatever renders them decides what to show; the navbar maps them
to menu labels and shows titles alone.

The signature wordmark is `components/Signature/`, an inlined `<svg>` rather than
an `<img>`. That is deliberate: an external image can't inherit CSS, so
`fill: currentColor` only works inline. It means the mark takes the colour of
whatever contains it, with no filter and no second file. Do the same for any future mark that has to follow the
theme.

## Page metadata

Every page calls `usePageMeta(title, description)` as its first statement, so no
two routes share a title or a description. Add the call to any new page.

`index.html` holds the site-level title and description. Nothing is prerendered,
so those static tags are all a crawler or social scraper that doesn't run JS ever
sees; `usePageMeta` rewrites them in place once React mounts. Don't render React
19's native `<title>` or `<meta>` from a component — React appends rather than
replaces, so the document would end up with two of each, which its own docs call
undefined behavior.

## Deployment

Netlify, configured by `netlify.toml` in the repo root rather than through the
Netlify dashboard, so deploy settings are version-controlled and reviewable in a
pull request. The project is connected to this repository and builds `main`
automatically on every push, publishing to `juandiegoperezarias.netlify.app`.

Routing is client-side, so `netlify.toml` rewrites every path that isn't a real
file to `index.html`. New routes therefore need no deploy change, and the rule
must not be duplicated as a `public/_redirects` file.

Branch deploys and deploy previews are both enabled. Every branch gets
`<branch>--juandiegoperezarias.netlify.app` and every pull request gets
`deploy-preview-<n>--…`, with the link posted onto the pull request itself — so a
layout change can be opened on a real phone before it is promoted. A branch has
no URL until its first push after the branch is created.

Netlify sets `X-Robots-Tag: noindex` on preview deploys by itself, so they cannot
be indexed as duplicates of the live site. Don't add a header for this.

**Planned, not yet built:** a custom domain. The `.netlify.app` subdomain is
currently the canonical origin.

## Search engines

The canonical origin is `https://juandiegoperezarias.netlify.app`, the Netlify
subdomain. **Planned, not yet built:** a custom domain. Attaching one means
rewriting every `<loc>` in `sitemap.xml` and the `Sitemap:` line in
`robots.txt` — a sitemap that lists a different host than the one serving it
is ignored outright.

`robots.txt` and `sitemap.xml` live in `public/`, which Vite copies to the root of
`dist/` untouched. They resolve in production because Netlify serves a real file
before it applies the SPA rewrite, so the catch-all never swallows them.

The sitemap lists every indexable route as an absolute URL, which the sitemap
spec requires — a relative path in it is silently ignored. It is maintained by
hand, so **a new route needs a `<url>` entry** alongside its addition to
`main.jsx` and, if it belongs in the menu, to `Navbar/navigation.js`. It deliberately carries no
`<lastmod>`, `<changefreq>` or `<priority>`: the first goes stale into a lie, and
Google ignores the other two.

## Git workflow

Never commit to `main`. Branch off `dev` using `<type>/<short-description>`
(`feat/projects-grid`, `fix/nav-overflow`, `docs/add-claude-md`), then open a pull
request into `dev` on GitHub. `main` holds stable released code only.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
`<type>(<scope>): <imperative subject>` — for example
`feat(blog): add pagination to post list`. Types: `feat`, `fix`, `docs`, `style`,
`refactor`, `perf`, `test`, `build`, `ci`, `chore`. Subject stays lowercase,
imperative, no trailing period.
