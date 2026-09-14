import { describe, expect, it } from 'vitest';
import {
  FEATURED_REPOS,
  filterExplorerRepos,
  moreProjectsCopy,
  repoCardModel,
  resolveLanguage,
  translations,
} from './catalog.js';

describe('resolveLanguage', () => {
  it('keeps english when stored as en', () => {
    expect(resolveLanguage('en')).toBe('en');
  });

  it('falls back to spanish for any other value', () => {
    expect(resolveLanguage('es')).toBe('es');
    expect(resolveLanguage(null)).toBe('es');
    expect(resolveLanguage('fr')).toBe('es');
  });
});

describe('filterExplorerRepos', () => {
  it('hides forks and featured repositories', () => {
    const repos = [
      { name: 'ororojo29', fork: false },
      { name: 'Monitorcillo', fork: false },
      { name: 'lawallet-nwc', fork: true },
      { name: 'clipcillo', fork: false },
      { name: 'portfolio', fork: false },
    ];

    expect(filterExplorerRepos(repos).map((repo) => repo.name)).toEqual(['ororojo29', 'portfolio']);
  });

  it('keeps the featured exclusion list complete', () => {
    expect([...FEATURED_REPOS]).toEqual([
      'monitorcillo',
      'futbolcillo',
      'satoshillo',
      'clipcillo',
      'botillo',
      'fierillo',
    ]);
  });
});

describe('repoCardModel', () => {
  const text = translations.es;

  it('uses the github description and language when present', () => {
    expect(
      repoCardModel(
        {
          name: 'ororojo29',
          html_url: 'https://github.com/Fierillo/ororojo29',
          language: 'TypeScript',
          description: 'Copper shop',
          archived: false,
        },
        text,
      ),
    ).toEqual({
      name: 'ororojo29',
      href: 'https://github.com/Fierillo/ororojo29',
      language: 'TypeScript',
      description: 'Copper shop',
      archivedLabel: null,
    });
  });

  it('falls back without public or year metadata', () => {
    const card = repoCardModel(
      {
        name: 'test',
        html_url: 'https://github.com/Fierillo/test',
        language: null,
        description: null,
        archived: true,
        pushed_at: '2024-01-01T00:00:00Z',
      },
      text,
    );

    expect(card.language).toBe('Código');
    expect(card.description).toBe('Proyecto disponible en GitHub.');
    expect(card.archivedLabel).toBe('ARCHIVADO');
    expect(JSON.stringify(card)).not.toMatch(/PÚBLICO|PUBLIC|2024/);
  });
});

describe('moreProjectsCopy', () => {
  it('toggles label and symbol from the collapsed state', () => {
    expect(moreProjectsCopy(false, translations.es)).toEqual({
      label: 'Más proyectos',
      symbol: '＋',
    });
    expect(moreProjectsCopy(true, translations.en)).toEqual({
      label: 'Hide projects',
      symbol: '−',
    });
  });
});

describe('translations', () => {
  it('keeps spanish and english keys aligned', () => {
    expect(Object.keys(translations.es).sort()).toEqual(Object.keys(translations.en).sort());
  });

  it('does not carry leftover sound copy', () => {
    expect(Object.keys(translations.es).join(' ')).not.toMatch(/sound|audio|boot/i);
  });
});
