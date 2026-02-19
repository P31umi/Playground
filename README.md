# Pelumi's Playground

A personal project showcase site with a light, centered layout. Projects are driven by a markdown file so you can add or edit entries without touching the code.

## View on GitHub

After you push this repo to GitHub, your repo URL will be:

- **HTTPS:** `https://github.com/YOUR_USERNAME/Playground`
- **Clone:** `https://github.com/YOUR_USERNAME/Playground.git`

Replace `YOUR_USERNAME` with your GitHub username. To open it: run `gh repo view --web` from this folder (if you use GitHub CLI), or go to **github.com** → Your profile → **Repositories** → **Playground**.

## Run locally

1. Open the project folder in a terminal.
2. Serve the files (e.g. with Python or Node):
   - **Python 3:** `python3 -m http.server 8000` then open http://localhost:8000
   - **Node (npx):** `npx serve` then open the URL it prints
3. Or open `index.html` directly in a browser (some features may be limited without a server).

## Adding or editing projects

1. Edit **`projects.md`** in the repo root.
2. Use one block per project:
   - A level-2 heading: `## Project title`
   - Description (one or more lines)
   - A single line: `Link: https://your-url.com`
3. From the repo root, run: `node scripts/build-projects.js`
4. Refresh the site; the new or updated project appears.

## Tech

- HTML, CSS (Flexbox/Grid), Vanilla JavaScript
- Inter font (Google Fonts)
- Lucide icons (CDN)
- No build step for the site; only the projects build script (Node) is used to generate `js/projects-data.js` from `projects.md`
