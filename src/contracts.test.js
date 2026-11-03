import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { translations } from './catalog.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const main = readFileSync(new URL('./main.js', import.meta.url), 'utf8');

function featuredProjectArticles() {
  return [...html.matchAll(/<article class="project\b[^"]*">[\s\S]*?<\/article>/g)].map((match) => match[0]);
}

function htmlI18nKeys() {
  return [
    ...new Set(
      [...html.matchAll(/data-i18n(?:-html|-aria-label|-alt)?="([^"]+)"/g)].map((match) => match[1]),
    ),
  ];
}

describe('site contracts', () => {
  it('ships no hardcoded featured cards so they come from the GitHub cache', () => {
    expect(featuredProjectArticles()).toEqual([]);
    expect(html).toMatch(/<div class="project-list">\s*<\/div>/);
    expect(main).toContain("fetch('/featured.json')");
  });

  it('never builds featured cards live in the browser (pinned repos need a server-side token)', () => {
    expect(main).not.toMatch(/buildFeaturedSnapshot|fetchPinnedRepos|graphql|GITHUB_TOKEN/i);
  });

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

  it('stretches the site header across the viewport', () => {
    const headerRule = css.match(/\.site-header\s*\{[^}]+\}/);
    expect(headerRule?.[0]).toMatch(/width:\s*100%/);
    expect(css).not.toMatch(/\.site-header\s*,\s*main\b/);
  });
});
