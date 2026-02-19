# Pelumi's Playground

A personal project showcase smy list of AI tools i've built.

View here:

- **HTTPS:** `https://github.com/p31umi/Playground`



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
