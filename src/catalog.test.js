import { describe, expect, it } from 'vitest';
import {
  FEATURED_REPOS,
  explorerPresentation,
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
  it('hides forks and keeps unrelated repositories', () => {
    const repos = [
      { name: 'ororojo29', fork: false },
      { name: 'lawallet-nwc', fork: true },
      { name: 'portfolio', fork: false },
    ];

    expect(filterExplorerRepos(repos).map((repo) => repo.name)).toEqual(['ororojo29', 'portfolio']);
  });

  it('excludes every featured name regardless of casing', () => {
    const repos = FEATURED_REPOS.map((name) => ({ name: name.toUpperCase(), fork: false }));
    expect(filterExplorerRepos(repos)).toEqual([]);
  });
});

describe('repoCardModel', () => {
  const text = {
    codeFallback: 'LANG',
    emptyDescription: 'DESC',
    archivedRepo: 'ARCH',
  };

  it('uses the github description and language when present', () => {
    expect(
      repoCardModel(
        {
          name: 'ororojo29',
          html_url: 'https://example.test/ororojo29',
          language: 'TypeScript',
          description: 'Copper shop',
          archived: false,
        },
        text,
      ),
    ).toEqual({
      name: 'ororojo29',
      href: 'https://example.test/ororojo29',
      language: 'TypeScript',
      description: 'Copper shop',
      archivedLabel: null,
    });
  });

  it('falls back through the provided catalog text', () => {
    const card = repoCardModel(
      {
        name: 'sample',
        html_url: 'https://example.test/sample',
        language: null,
        description: null,
        archived: true,
        pushed_at: '2024-01-01T00:00:00Z',
      },
      text,
    );

    expect(card.language).toBe(text.codeFallback);
    expect(card.description).toBe(text.emptyDescription);
    expect(card.archivedLabel).toBe(text.archivedRepo);
    expect(JSON.stringify(card)).not.toMatch(/PÚBLICO|PUBLIC|2024/);
  });
});

describe('moreProjectsCopy', () => {
  it('toggles label and symbol from the expanded flag', () => {
    const text = { moreProjects: 'OPEN', hideProjects: 'CLOSE' };

    expect(moreProjectsCopy(false, text)).toEqual({ label: 'OPEN', symbol: '＋' });
    expect(moreProjectsCopy(true, text)).toEqual({ label: 'CLOSE', symbol: '−' });
  });
});

describe('translations', () => {
  it('keeps spanish and english keys aligned', () => {
    expect(Object.keys(translations.es).sort()).toEqual(Object.keys(translations.en).sort());
  });
});

describe('explorerPresentation', () => {
  const text = {
    githubLoading: 'LOADING',
    githubError: 'ERROR',
    githubFallback: 'FALLBACK',
    codeFallback: 'LANG',
    emptyDescription: 'DESC',
    archivedRepo: 'ARCH',
  };

  it('shows loading copy before repos arrive', () => {
    expect(explorerPresentation('loading', [], text)).toEqual({
      statusHidden: false,
      statusText: 'LOADING',
      cards: [],
      fallback: null,
    });
  });

  it('shows error copy with a repositories fallback', () => {
    const view = explorerPresentation('error', [], text);

    expect(view.statusHidden).toBe(false);
    expect(view.statusText).toBe('ERROR');
    expect(view.cards).toEqual([]);
    expect(view.fallback).toEqual({
      href: expect.stringMatching(/^https:\/\/github\.com\/[^/]+\?tab=repositories$/),
      label: 'FALLBACK',
    });
  });

  it('maps loaded repos into cards and hides status', () => {
    const view = explorerPresentation(
      'loaded',
      [
        {
          name: 'portfolio',
          html_url: 'https://example.test/portfolio',
          language: 'JavaScript',
          description: 'Site',
          archived: false,
        },
      ],
      text,
    );

    expect(view.statusHidden).toBe(true);
    expect(view.statusText).toBe('');
    expect(view.fallback).toBeNull();
    expect(view.cards).toEqual([
      {
        name: 'portfolio',
        href: 'https://example.test/portfolio',
        language: 'JavaScript',
        description: 'Site',
        archivedLabel: null,
      },
    ]);
  });
});
