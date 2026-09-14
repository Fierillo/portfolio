import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FEATURED_REPOS, translations } from './catalog.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const main = readFileSync(new URL('./main.js', import.meta.url), 'utf8');

function featuredProjectArticles() {
  return [...html.matchAll(/<article class="project\b[^"]*">[\s\S]*?<\/article>/g)].map((match) => match[0]);
}

function showcaseRepoNames() {
  return [
    ...new Set(
      [...html.matchAll(/github\.com\/Fierillo\/([^"\/?#]+)/gi)].map((match) => match[1].toLowerCase()),
    ),
  ].filter((name) =>
    featuredProjectArticles().some((article) => article.toLowerCase().includes(name)),
  );
}

function htmlI18nKeys() {
  return [
    ...new Set(
      [...html.matchAll(/data-i18n(?:-html|-aria-label|-alt)?="([^"]+)"/g)].map((match) => match[1]),
    ),
  ];
}

describe('site contracts', () => {
  it('gives every featured project a numeric founding block', () => {
    const articles = featuredProjectArticles();
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      expect(article).toMatch(/data-i18n="foundedBlock">[^<]+<\/span>\s*\d+/);
    }
  });

  it('does not include sound or boot UI', () => {
    expect(html).not.toMatch(/sound|boot-screen|AudioContext/i);
    expect(main).not.toMatch(/AudioContext|playTone|soundEnabled/);
  });

  it('keeps the bear in the hero grid instead of overlaying the title', () => {
    expect(css).not.toMatch(/\.hacker-bear\s*\{[^}]*position:\s*absolute/s);
    const stacked = css.slice(css.indexOf('@media (max-width: 1024px)'));
    expect(stacked).toMatch(/\.hacker-bear\s*\{[^}]*grid-column:\s*1/s);
  });

  it('maps every html i18n key to both translation catalogs', () => {
    const keys = htmlI18nKeys();
    expect(keys.length).toBeGreaterThan(0);

    for (const key of keys) {
      expect(translations.es).toHaveProperty(key);
      expect(translations.en).toHaveProperty(key);
    }
  });

  it('keeps showcase github repos inside the featured exclusion set', () => {
    const showcase = showcaseRepoNames();
    expect(showcase.length).toBeGreaterThan(0);

    for (const name of showcase) {
      expect(FEATURED_REPOS).toContain(name);
    }
  });

  it('stretches the site header across the viewport', () => {
    const headerRule = css.match(/\.site-header\s*\{[^}]+\}/);
    expect(headerRule?.[0]).toMatch(/width:\s*100%/);
    expect(css).not.toMatch(/\.site-header\s*,\s*main\b/);
  });
});
