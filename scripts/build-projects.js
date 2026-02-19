/**
 * Reads projects.md from repo root, parses ## Title / description / Link: url blocks,
 * and writes js/projects-data.js with const PROJECTS = [ ... ].
 * Run from repo root: node scripts/build-projects.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const INPUT_FILE = path.join(REPO_ROOT, 'projects.md');
const OUTPUT_FILE = path.join(REPO_ROOT, 'js', 'projects-data.js');

const LINK_LINE = /^Link:\s*(.+)$/i;

function parseProjectsMd(content) {
  const projects = [];
  const blocks = content.split(/\n(?=##\s)/).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split(/\n/).map((l) => l.trimEnd());
    const first = lines[0];
    if (!first.startsWith('## ')) continue;

    const title = first.slice(3).trim();
    const rest = lines.slice(1);
    let descriptionLines = [];
    let url = '';

    for (const line of rest) {
      const linkMatch = line.match(LINK_LINE);
      if (linkMatch) {
        url = linkMatch[1].trim();
        break;
      }
      if (line.length > 0) descriptionLines.push(line);
    }

    const description = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();
    if (title && url) {
      projects.push({ title, description, url });
    }
  }

  return projects;
}

function escapeJsString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function generateProjectsJs(projects) {
  const items = projects.map(
    (p) =>
      `  { title: '${escapeJsString(p.title)}', description: '${escapeJsString(p.description)}', url: '${escapeJsString(p.url)}' }`
  );
  return (
    '/**\n * Generated from projects.md by scripts/build-projects.js. Do not edit by hand.\n */\n\nconst PROJECTS = [\n' +
    items.join(',\n') +
    '\n];\n'
  );
}

function main() {
  let content;
  try {
    content = fs.readFileSync(INPUT_FILE, 'utf8');
  } catch (err) {
    console.error('Could not read projects.md:', err.message);
    process.exit(1);
  }

  const projects = parseProjectsMd(content);
  const js = generateProjectsJs(projects);

  try {
    fs.writeFileSync(OUTPUT_FILE, js, 'utf8');
  } catch (err) {
    console.error('Could not write js/projects-data.js:', err.message);
    process.exit(1);
  }

  console.log('Wrote ' + projects.length + ' project(s) to js/projects-data.js');
}

main();
