import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { buildFeaturedSnapshot } from '../src/catalog.js';

const target = new URL('../public/featured.json', import.meta.url);

async function readPrevious() {
  try {
    return JSON.parse(await readFile(target, 'utf8'));
  } catch {
    return null;
  }
}

const previous = await readPrevious();

try {
  const response = await fetch('https://api.github.com/users/Fierillo/repos?per_page=100&sort=updated');
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
  const snapshot = await buildFeaturedSnapshot(await response.json(), fetch, Date.now(), previous);
  await mkdir(new URL('.', target), { recursive: true });
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`featured snapshot: ${snapshot.repos.length} repos`);
} catch (error) {
  if (!previous) {
    await writeFile(target, `${JSON.stringify({ savedAt: 0, repos: [] })}\n`);
  }
  console.warn(`featured snapshot skipped (${error.message}); ${previous ? 'kept previous file' : 'wrote empty list'}`);
}
