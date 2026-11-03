import { describe, expect, it } from 'vitest';
import {
  createFeaturedCard,
  featuredCardModel,
  pinnedRepos,
  fetchPinnedRepos,
  filterExplorerRepos,
  foundingBlock,
  localizeDescriptions,
  buildFeaturedSnapshot,
  pickFeaturedCache,
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
  topics: ['nostr'],
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

const pinnedNode = (overrides = {}) => ({
  name: 'demo',
  url: 'https://github.com/Fierillo/demo',
  homepageUrl: 'https://demo.example',
  description: 'A <b>demo</b>',
  primaryLanguage: { name: 'TypeScript' },
  repositoryTopics: { nodes: [{ topic: { name: 'nostr' } }] },
  createdAt: '2026-10-15T04:47:15Z',
  ...overrides,
});
const pinnedResponse = (nodes) => ({ data: { user: { pinnedItems: { nodes } } } });

describe('pinnedRepos', () => {
  it('maps pinned GraphQL nodes to repo records in pinned order', () => {
    const repos = pinnedRepos(pinnedResponse([pinnedNode({ name: 'b' }), pinnedNode({ name: 'a', primaryLanguage: null, homepageUrl: '' })]));
    expect(repos.map((r) => r.name)).toEqual(['b', 'a']);
    const { fork, ...expected } = repo({ name: 'b' });
    expect(fork).toBe(false);
    expect(repos[0]).toEqual(expected);
    expect(repos[1].language).toBeNull();
    expect(repos[1].homepage).toBeNull();
  });

  it('returns an empty list for malformed responses', () => {
    expect(pinnedRepos(null)).toEqual([]);
    expect(pinnedRepos({ errors: [{ message: 'bad' }] })).toEqual([]);
    expect(pinnedRepos(pinnedResponse([null, {}]))).toEqual([]);
  });
});

describe('fetchPinnedRepos', () => {
  it('posts the pinned query with the token and returns repos', async () => {
    let call;
    const request = async (url, init) => { call = { url, init }; return { ok: true, json: async () => pinnedResponse([pinnedNode()]) }; };
    const repos = await fetchPinnedRepos('tkn', request);
    expect(call.url).toBe('https://api.github.com/graphql');
    expect(call.init.method).toBe('POST');
    expect(call.init.headers.Authorization).toBe('bearer tkn');
    expect(JSON.parse(call.init.body).query).toContain('pinnedItems(first: 6, types: REPOSITORY)');
    expect(repos.map((r) => r.name)).toEqual(['demo']);
  });

  it('fails without a token or on GraphQL errors', async () => {
    await expect(fetchPinnedRepos('', async () => ({}))).rejects.toThrow('GITHUB_TOKEN');
    const failing = async () => ({ ok: true, json: async () => ({ errors: [{ message: 'nope' }] }) });
    await expect(fetchPinnedRepos('t', failing)).rejects.toThrow('nope');
    await expect(fetchPinnedRepos('t', async () => ({ ok: false, status: 401 }))).rejects.toThrow('401');
  });
});

describe('explorer', () => {
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
      descriptions: { es: 'A <b>demo</b>', en: 'A <b>demo</b>' },
      tags: ['TypeScript', 'nostr'],
      repoUrl: 'https://github.com/Fierillo/demo',
      projectUrl: 'https://demo.example',
    });
    const unsafe = featuredCardModel(repo({ homepage: 'javascript:x', html_url: 'javascript:y' }), 1);
    expect(unsafe.repoUrl).toBe('https://github.com/Fierillo');
    expect(unsafe.projectUrl).toBe('https://github.com/Fierillo');
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

describe('buildFeaturedSnapshot', () => {
  it('keeps given repos in order with safe fields and their founding blocks', async () => {
    const request = async () => ({ ok: true, json: async () => ({ height: 42 }) });
    const snapshot = await buildFeaturedSnapshot([repo({ extra: 'x' })], request, 1000);
    expect(snapshot).toEqual({
      savedAt: 1000,
      repos: [{
        name: 'demo',
        html_url: 'https://github.com/Fierillo/demo',
        homepage: 'https://demo.example',
        description: 'A <b>demo</b>',
        language: 'TypeScript',
        topics: ['nostr'],
        created_at: '2026-10-15T04:47:15Z',
        block: 42,
      }],
    });
  });

  it('reuses known blocks instead of asking mempool again', async () => {
    const request = async () => { throw new Error('should not be called'); };
    const snapshot = await buildFeaturedSnapshot([repo()], request, 1, { savedAt: 0, repos: [{ name: 'demo', block: 7 }] });
    expect(snapshot.repos[0].block).toBe(7);
  });
});

describe('pickFeaturedCache', () => {
  const snap = (savedAt) => ({ savedAt, repos: [repo({ block: null })] });

  it('prefers the newest valid cache', () => {
    expect(pickFeaturedCache(snap(1), snap(2)).savedAt).toBe(2);
    expect(pickFeaturedCache(snap(3), snap(2)).savedAt).toBe(3);
  });

  it('ignores missing or malformed caches', () => {
    expect(pickFeaturedCache(snap(1), 'garbage').savedAt).toBe(1);
    expect(pickFeaturedCache(null, { savedAt: 5, repos: 'x' })).toEqual({ savedAt: 0, repos: [] });
  });
});

describe('bilingual featured descriptions', () => {
  const i18n = { demo: { source: 'A <b>demo</b>', es: 'Una demo', en: 'A demo' } };

  it('uses the local translation when its source matches GitHub', () => {
    expect(featuredCardModel(repo(), 1, i18n).descriptions).toEqual({ es: 'Una demo', en: 'A demo' });
  });

  it('falls back to the raw GitHub description when missing or outdated', () => {
    const raw = { es: 'A <b>demo</b>', en: 'A <b>demo</b>' };
    expect(featuredCardModel(repo(), 1).descriptions).toEqual(raw);
    expect(featuredCardModel(repo(), 1, { demo: { source: 'old', es: 'x', en: 'y' } }).descriptions).toEqual(raw);
    expect(featuredCardModel(repo(), 1, { demo: { source: 'A <b>demo</b>', es: 'Una demo' } }).descriptions.en).toBe('A <b>demo</b>');
  });

  it('renders the current language and switches with textContent', () => {
    const card = createFeaturedCard(featuredCardModel(repo(), 1, i18n), fakeDocument(), translations.en, null, 'en');
    const paragraph = walk(card).find((n) => n.tagName === 'p');
    expect(paragraph.textContent).toBe('A demo');
    localizeDescriptions([paragraph], 'es');
    expect(paragraph.textContent).toBe('Una demo');
    localizeDescriptions([paragraph], 'en');
    expect(paragraph.textContent).toBe('A demo');
  });
});
