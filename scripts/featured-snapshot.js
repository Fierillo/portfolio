import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { buildFeaturedSnapshot, fetchPinnedRepos } from '../src/catalog.js';

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
  const pinned = await fetchPinnedRepos(process.env.GITHUB_TOKEN);
  const snapshot = await buildFeaturedSnapshot(pinned, fetch, Date.now(), previous);
  await mkdir(new URL('.', target), { recursive: true });
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`featured snapshot: ${snapshot.repos.map((repo) => repo.name).join(', ') || 'no pinned repos'}`);
} catch (error) {
  if (!previous) {
    await writeFile(target, `${JSON.stringify({ savedAt: 0, repos: [] })}\n`);
  }
  console.warn(`featured snapshot skipped (${error.message}); ${previous ? 'kept previous file' : 'wrote empty list'}`);
}
