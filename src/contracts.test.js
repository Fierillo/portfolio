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
  it('offers a Nostr profile link with a visible NIP-05 identity in contacts', () => {
    const contact = html.match(/<section[^>]+id="contacto"[\s\S]*?<\/section>/)?.[0];
    expect(contact).toMatch(/<a href="https:\/\/njump\.me\/npub1[023456789acdefghjklmnpqrstuvwxyz]{58}" target="_blank" rel="noreferrer">Nostr[\s\S]*?fierillo@hodl\.ar[\s\S]*?<\/a>/);
  });

  it('lays out contacts in two balanced columns with a separate Nostr identity', () => {
    const gridRule = css.match(/\.contact__links\s*\{[^}]+\}/)?.[0];
    expect(gridRule).toMatch(/grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(html).toMatch(/Nostr ↗<span class="contact__identity">[^<]+<\/span>/);
    expect(css).toMatch(/\.contact__identity\s*\{[^}]*display:\s*block/s);
  });

  it('gives every featured project a numeric founding block', () => {
    const articles = featuredProjectArticles();
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      expect(article).toMatch(/data-i18n="foundedBlock">[^<]+<\/span>\s*\d+/);
    }
  });

  it('features Workshopillo Wallets with demo, source and bilingual copy', () => {
    const article = featuredProjectArticles().find((article) => article.includes('<h3>Workshopillo Wallets</h3>'));
    expect(article).toBeDefined();
    expect(article).toContain('data-project-repo="Fierillo/workshopillo-wallets"');
    expect(article).not.toContain('%VITE_WORKSHOP_URL%');
    expect(article).toContain('href="https://github.com/Fierillo/workshopillo-wallets"');
    expect(article).toContain('data-i18n="workshopDescription"');
    for (const text of Object.values(translations)) {
      expect(text.workshopDescription).toEqual(expect.any(String));
      expect(text.workshopTechnologies).toEqual(expect.any(String));
    }
    expect(FEATURED_REPOS).toContain('workshopillo-wallets');
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
