import { describe, expect, it } from 'vitest';
import {
  createFeaturedCard,
  featuredCardModel,
  featuredRepos,
  filterExplorerRepos,
  foundingBlock,
  safeHttpUrl,
  translations,
} from './catalog.js';

const repo = (overrides = {}) => ({
  name: 'demo',
  fork: false,
  html_url: 'https://github.com/Fierillo/demo',
  homepage: 'https://demo.example',
  description: 'A <b>demo</b>',
  language: 'TypeScript',
  topics: ['featured', 'nostr'],
  created_at: '2026-10-15T04:47:15Z',
  ...overrides,
});

function fakeDocument() {
  const make = (tag) => {
    const el = {
      tagName: tag,
      children: [],
      dataset: {},
      attributes: {},
      hidden: false,
      textContent: '',
      append(...nodes) { this.children.push(...nodes); },
      setAttribute(name, value) { this.attributes[name] = value; },
    };
    Object.defineProperty(el, 'innerHTML', { set() { throw new Error('innerHTML used'); } });
    return el;
  };
  return { createElement: make };
}

function walk(el, out = []) {
  out.push(el);
  (el.children || []).forEach((child) => walk(child, out));
  return out;
}

describe('featuredRepos', () => {
  it('keeps only non-fork repos tagged with the featured topic', () => {
    const repos = [repo(), repo({ name: 'plain', topics: ['nostr'] }), repo({ name: 'fork', fork: true }), repo({ name: 'none', topics: undefined })];
    expect(featuredRepos(repos).map((r) => r.name)).toEqual(['demo']);
    expect(featuredRepos(null)).toEqual([]);
  });

  it('lets the explorer exclude the dynamic featured set', () => {
    const repos = [repo(), repo({ name: 'other', topics: [] })];
    expect(filterExplorerRepos(repos, ['demo']).map((r) => r.name)).toEqual(['other']);
  });
});

describe('safeHttpUrl', () => {
  it('accepts only http and https URLs', () => {
    expect(safeHttpUrl('https://a.example')).toBe('https://a.example');
    for (const value of [null, '', 'nope', 'javascript:alert(1)', 'ftp://x.example']) {
      expect(safeHttpUrl(value)).toBeNull();
    }
  });
});

describe('featuredCardModel', () => {
  it('builds tags from language and topics without featured and validates links', () => {
    const model = featuredCardModel(repo(), 2);
    expect(model).toMatchObject({
      index: '02',
      name: 'demo',
      description: 'A <b>demo</b>',
      tags: ['TypeScript', 'nostr'],
      repoUrl: 'https://github.com/Fierillo/demo',
      projectUrl: 'https://demo.example',
      descriptionKey: null,
    });
    const unsafe = featuredCardModel(repo({ homepage: 'javascript:x', html_url: 'javascript:y' }), 1);
    expect(unsafe.repoUrl).toBe('https://github.com/Fierillo');
    expect(unsafe.projectUrl).toBe('https://github.com/Fierillo');
  });

  it('reuses bilingual copy for repos already described in the catalog', () => {
    const model = featuredCardModel(repo({ name: 'Totemcillo' }), 1);
    expect(model.descriptionKey).toBe('totemDescription');
    expect(translations.en[model.descriptionKey]).toEqual(expect.any(String));
  });
});

describe('foundingBlock', () => {
  it('converts the creation date to a block height', async () => {
    let url;
    const request = async (u) => { url = u; return { ok: true, json: async () => ({ height: 971511 }) }; };
    expect(await foundingBlock('2026-10-15T04:47:15Z', request)).toBe(971511);
    expect(url).toBe(`https://mempool.space/api/v1/mining/blocks/timestamp/${Date.parse('2026-10-15T04:47:15Z') / 1000}`);
  });

  it('returns null when the lookup fails', async () => {
    expect(await foundingBlock('2026-10-15T04:47:15Z', () => Promise.reject(new Error('down')))).toBeNull();
    expect(await foundingBlock('2026-10-15T04:47:15Z', async () => ({ ok: false }))).toBeNull();
    expect(await foundingBlock('2026-10-15T04:47:15Z', async () => ({ ok: true, json: async () => ({}) }))).toBeNull();
    expect(await foundingBlock('bad date', async () => ({ ok: true, json: async () => ({ height: 1 }) }))).toBeNull();
  });
});

describe('createFeaturedCard', () => {
  it('renders API data with textContent only', () => {
    const card = createFeaturedCard(featuredCardModel(repo(), 1), fakeDocument(), translations.es);
    const nodes = walk(card);
    expect(card.className).toBe('project reveal');
    expect(nodes.some((n) => n.tagName === 'h3' && n.textContent === 'demo')).toBe(true);
    expect(nodes.some((n) => n.tagName === 'p' && n.textContent === 'A <b>demo</b>')).toBe(true);
    expect(nodes.filter((n) => n.tagName === 'li').map((n) => n.textContent)).toEqual(['TypeScript', 'nostr']);
    expect(nodes.find((n) => n.className === 'project__block').hidden).toBe(true);
  });

  it('shows the founding block when available', () => {
    const card = createFeaturedCard(featuredCardModel(repo(), 1), fakeDocument(), translations.es, 971511);
    const block = walk(card).find((n) => n.className === 'project__block');
    expect(block.hidden).toBe(false);
    expect(walk(block).some((n) => n.textContent === ' 971511')).toBe(true);
  });
});
