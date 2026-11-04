# Portfolio Series — Shyam K.

**-/shyamk I build --intelligent**

Frontend Developer • Full-Stack Developer • Creative Technologist
*Engineering intelligence. Designing experiences.*

- **Live:** https://shyamk-alt.github.io/Portfolio__series/
- **GitHub:** [shyamk-alt](https://github.com/shyamk-alt)
- **LinkedIn:** [shyam-k-88a4093a9](https://www.linkedin.com/in/shyam-k-88a4093a9)
- **Email:** k.shyam5981@gmail.com

B.E CSE • GRTIET • Tiruttani • 2024-28
StudyVault World • 30+ languages • Frontend Dev

---

## What this is

A single-page, scroll-driven portfolio told like a series: a title-card intro, a "Who's watching?" profile picker, then pinned scenes that react to every pixel of scroll.

| Episode | Scene | Scroll effect |
| --- | --- | --- |
| Cover | Name, tagline, circular portrait | Content and portrait drift away as you leave |
| Shelf | "Continue exploring" tiles | Tilt on hover, progress bars fill in |
| 1 · Origin | Story + "now playing" card | Words light up one by one; scrubber follows scroll |
| 2 · Milestones | Marquees + stat cards | Text slides with scroll; numbers count up |
| 3 · The Reel | StudyVault World, MovieFlix, ApplyWorld, WeatherFlix | Page pins and posters slide sideways |
| 4 · Stack | Skill groups + orbit | Chips stagger in |
| 5 · Timeline | 2024 → Next | Line fills as you scroll |
| Finale | Contact | Glow and title scale in |

The profile you pick (Shyam, Hiring, Dev, Design) changes the welcome line, the main button and the "Up next for you" tile. Pick **Shyam** for the full story.

## Tech

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.
Fonts: Space Grotesk (self-hosted, SIL OFL) and Inter (Google Fonts).

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Useful URL flag: add `?intro=off` to skip the intro while you work on the page.
Keyboard: `Esc` skips the intro. `prefers-reduced-motion` is respected.

## Project structure

```
Portfolio__series/
├── index.html                  page markup and content
├── assets/
│   ├── css/series.css          design tokens, layout, all scenes
│   ├── js/stage.js             intro + profile picker
│   ├── js/scroll.js            scroll-progress engine for pinned scenes
│   ├── js/ui.js                reveals, counters, tilt, menu
│   └── fonts/                  Space Grotesk (variable) + licence
├── public/
│   ├── shyam.jpg               square portrait used in the circular frame
│   ├── shyam-face.jpg          tight crop for small avatars
│   ├── shyam-original.jpg      full-length original photo
│   └── shyam-banner-1920x1080.png
└── banner/banner.html          source of the 1920x1080 banner
```

## Edit your content

- Text, links and projects: `index.html`
- Colours: the `:root` variables at the top of `assets/css/series.css`
  (`--bg-1: #2a0a1a`, `--bg-0: #0a0408`, `--pink: #ffb0c0`)
- Project buttons currently open your GitHub repositories filtered by name. Replace each `href` in the **Reel** section with a live-demo or repo link when you have one.
- New photo: replace `public/shyam.jpg` (square, about 1000×1000) and `public/shyam-face.jpg`.

## Deploy to GitHub Pages

The site is plain static files at the repo root, so no build or workflow is needed.

1. Push to `main`.
2. On GitHub open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, then pick **main** and **/ (root)** and save.

A minute later the site is live at https://shyamk-alt.github.io/Portfolio__series/

All asset paths are relative, so the site works under the `/Portfolio__series/` sub-path.

## Re-render the banner

Open `banner/banner.html` at 1920×1080 (serve the repo locally first) and screenshot it, or use Playwright:

```js
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('http://localhost:8000/banner/banner.html');
await page.screenshot({ path: 'public/shyam-banner-1920x1080.png' });
```

## Licence

MIT © 2026 Shyam K. Space Grotesk is © its authors, licensed under the SIL Open Font License (see `assets/fonts/OFL-SpaceGrotesk.txt`).
