export function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? value : null;
  } catch {
    return null;
  }
}

export const translations = {
  es: {
    metaTitle: 'Fierillolandia | Código, Bitcoin y libertad',
    skipLink: 'Saltar al contenido',
    brandHome: 'Fierillolandia, inicio',
    mainNavigation: 'Navegación principal',
    navProjects: 'Proyectos',
    navAbout: 'Sobre mí',
    navContact: 'Contacto',
    languageSelector: 'Idioma',
    spanishLanguage: 'Español',
    englishLanguage: 'Inglés',
    heroEyebrow: 'DESARROLLADOR AUTODIDACTA',
    heroTitle: 'Código.<br />Bitcoin.<br /><span>Libertad.</span>',
    heroIntro: 'Construyo herramientas por curiosidad, utilidad y soberanía.',
    projectsEyebrow: 'TRABAJO SELECCIONADO',
    projectsTitle: 'Proyectos',
    projectsIntro: 'Software abierto enfocado en datos, Bitcoin y herramientas útiles.',
    viewProject: 'Ver proyecto',
    viewCode: 'Ver código',
    playNow: 'Jugar',
    download: 'Descargar',
    code: 'Código',
    moreProjects: 'Más proyectos',
    hideProjects: 'Ocultar proyectos',
    githubLoading: 'Conectando con GitHub...',
    githubError: 'No se pudo cargar la lista.',
    githubFallback: 'Abrir GitHub ↗',
    archivedRepo: 'ARCHIVADO',
    codeFallback: 'Código',
    aboutEyebrow: 'SOBRE MÍ',
    aboutTitle: 'Construir para entender.',
    avatarAlt: 'Avatar de Fierillo',
    aboutFirst: 'Con un background como estudiante de ingeniería, tengo el pragmatismo y la construcción en la sangre.',
    aboutSecond: 'Bitcoin me señaló el lugar donde quiero edificar; luego me hice dev de forma autodidacta y gracias a la IA pude alcanzar nuevas cotas de creatividad.',
    aboutThird: 'Fierillolandia es el lugar donde comparto todo lo que voy creando.',
    values: 'Honestidad · Minimalismo · Humildad · Curiosidad',
    contactEyebrow: 'CONTACTO',
    contactTitle: 'Hablemos.',
    footerMade: 'Hecho con amor por Fierillo',
    systemOnline: 'ONLINE',
    foundedBlock: 'Fundado en bloque',
    blockLabel: 'BLOQUE',
  },
  en: {
    metaTitle: 'Fierillolandia | Code, Bitcoin, and freedom',
    skipLink: 'Skip to content',
    brandHome: 'Fierillolandia, home',
    mainNavigation: 'Main navigation',
    navProjects: 'Projects',
    navAbout: 'About',
    navContact: 'Contact',
    languageSelector: 'Language',
    spanishLanguage: 'Spanish',
    englishLanguage: 'English',
    heroEyebrow: 'SELF-TAUGHT DEVELOPER',
    heroTitle: 'Code.<br />Bitcoin.<br /><span>Freedom.</span>',
    heroIntro: 'I build tools driven by curiosity, usefulness, and sovereignty.',
    projectsEyebrow: 'SELECTED WORK',
    projectsTitle: 'Projects',
    projectsIntro: 'Open software focused on data, Bitcoin, and useful tools.',
    viewProject: 'View project',
    viewCode: 'View code',
    playNow: 'Play',
    download: 'Download',
    code: 'Code',
    moreProjects: 'More projects',
    hideProjects: 'Hide projects',
    githubLoading: 'Connecting to GitHub...',
    githubError: 'The list could not be loaded.',
    githubFallback: 'Open GitHub ↗',
    archivedRepo: 'ARCHIVED',
    codeFallback: 'Code',
    aboutEyebrow: 'ABOUT',
    aboutTitle: 'Build to understand.',
    avatarAlt: 'Fierillo avatar',
    aboutFirst: 'With a background as an engineering student, pragmatism and building are in my blood.',
    aboutSecond: 'Bitcoin showed me where I want to build; I then became a self-taught developer, and AI helped me reach new heights of creativity.',
    aboutThird: 'Fierillolandia is where I share everything I create.',
    values: 'Honesty · Minimalism · Humility · Curiosity',
    contactEyebrow: 'CONTACT',
    contactTitle: 'Let’s talk.',
    footerMade: 'Made with love by Fierillo',
    systemOnline: 'ONLINE',
    foundedBlock: 'Founded in block',
    blockLabel: 'BLOCK',
  },
};

export function resolveLanguage(stored) {
  return stored === 'en' ? 'en' : 'es';
}

export function filterExplorerRepos(repos, featuredNames = []) {
  const featured = new Set(featuredNames.map((name) => name.toLowerCase()));
  return repos.filter((repo) => !repo.fork && !featured.has(repo.name.toLowerCase()));
}

export function repoCardModel(repo, text) {
  return {
    name: repo.name,
    href: repo.html_url,
    language: repo.language || text.codeFallback,
    description: repo.description || text.emptyDescription,
    archivedLabel: repo.archived ? text.archivedRepo : null,
  };
}

export function moreProjectsCopy(expanded, text) {
  return {
    label: expanded ? text.hideProjects : text.moreProjects,
    symbol: expanded ? '−' : '＋',
  };
}

export function explorerPresentation(state, repos, text) {
  if (state === 'loaded') {
    return {
      statusHidden: true,
      statusText: '',
      cards: repos.map((repo) => repoCardModel(repo, text)),
      fallback: null,
    };
  }

  if (state === 'error') {
    return {
      statusHidden: false,
      statusText: text.githubError,
      cards: [],
      fallback: {
        href: 'https://github.com/Fierillo?tab=repositories',
        label: text.githubFallback,
      },
    };
  }

  return {
    statusHidden: false,
    statusText: text.githubLoading,
    cards: [],
    fallback: null,
  };
}

const PROFILE_URL = 'https://github.com/Fierillo';

export function featuredRepos(repos) {
  if (!Array.isArray(repos)) return [];
  return repos.filter((repo) => !repo.fork && Array.isArray(repo.topics) && repo.topics.includes('featured'));
}

function localizedDescriptions(repo, i18n) {
  const raw = repo.description || '';
  const entry = i18n[repo.name];
  const usable = entry && entry.source === repo.description;
  return Object.fromEntries(
    ['es', 'en'].map((lang) => [lang, usable && typeof entry[lang] === 'string' && entry[lang] ? entry[lang] : raw]),
  );
}

export function localizeDescriptions(nodes, lang) {
  const key = lang === 'en' ? 'descriptionEn' : 'descriptionEs';
  nodes.forEach((node) => {
    node.textContent = node.dataset[key];
  });
}

export function featuredCardModel(repo, position, i18n = {}) {
  const repoUrl = safeHttpUrl(repo.html_url) || PROFILE_URL;
  return {
    index: String(position).padStart(2, '0'),
    name: repo.name,
    descriptions: localizedDescriptions(repo, i18n),
    tags: [repo.language, ...repo.topics.filter((topic) => topic !== 'featured')].filter(Boolean),
    repoUrl,
    projectUrl: safeHttpUrl(repo.homepage) || repoUrl,
    createdAt: repo.created_at,
  };
}

export async function foundingBlock(createdAt, request = fetch) {
  const time = Date.parse(createdAt);
  if (Number.isNaN(time)) return null;
  try {
    const response = await request(`https://mempool.space/api/v1/mining/blocks/timestamp/${Math.floor(time / 1000)}`);
    if (!response.ok) return null;
    const { height } = await response.json();
    return Number.isInteger(height) ? height : null;
  } catch {
    return null;
  }
}

function element(doc, tag, className, textContent) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (textContent !== undefined) node.textContent = textContent;
  return node;
}

function externalLink(doc, href, key, label) {
  const link = element(doc, 'a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  const span = element(doc, 'span', '', label);
  span.dataset.i18n = key;
  link.append(span, element(doc, 'span', '', ' ↗'));
  return link;
}

export function createFeaturedCard(model, doc, text, block = null, lang = 'es') {
  const article = element(doc, 'article', 'project reveal');
  const identity = element(doc, 'div', 'project__identity');
  const tags = element(doc, 'ul');
  tags.setAttribute('aria-label', model.name);
  tags.append(...model.tags.map((tag) => element(doc, 'li', '', tag)));
  identity.append(element(doc, 'h3', '', model.name), tags);

  const description = element(doc, 'p');
  description.dataset.descriptionEs = model.descriptions.es;
  description.dataset.descriptionEn = model.descriptions.en;
  localizeDescriptions([description], lang);

  const blockLabel = element(doc, 'span', '', text.foundedBlock);
  blockLabel.dataset.i18n = 'foundedBlock';
  const blockInfo = element(doc, 'span', 'project__block');
  blockInfo.append(blockLabel, element(doc, 'span', '', block === null ? '' : ` ${block}`));
  blockInfo.hidden = block === null;

  const links = element(doc, 'div', 'project__links');
  links.append(
    externalLink(doc, model.projectUrl, 'viewProject', text.viewProject),
    externalLink(doc, model.repoUrl, 'viewCode', text.viewCode),
    blockInfo,
  );

  const detail = element(doc, 'div', 'project__detail');
  detail.append(description, links);
  article.append(element(doc, 'span', 'project__index', model.index), identity, detail);
  return article;
}

const SNAPSHOT_FIELDS = ['name', 'html_url', 'homepage', 'description', 'language', 'topics', 'created_at'];

export async function buildFeaturedSnapshot(repos, request = fetch, savedAt = Date.now(), previous = null) {
  const knownBlocks = new Map((previous?.repos || []).map((repo) => [repo.name, repo.block]));
  const featured = featuredRepos(repos);
  const blocks = await Promise.all(
    featured.map((repo) =>
      Number.isInteger(knownBlocks.get(repo.name)) ? knownBlocks.get(repo.name) : foundingBlock(repo.created_at, request),
    ),
  );
  return {
    savedAt,
    repos: featured.map((repo, index) => ({
      ...Object.fromEntries(SNAPSHOT_FIELDS.map((field) => [field, repo[field] ?? null])),
      block: blocks[index],
    })),
  };
}

const EMPTY_CACHE = Object.freeze({ savedAt: 0, repos: [] });

function validCache(cache) {
  return Boolean(cache) && Number.isFinite(cache.savedAt) && Array.isArray(cache.repos);
}

export function pickFeaturedCache(...caches) {
  return caches.filter(validCache).reduce((best, cache) => (cache.savedAt > best.savedAt ? cache : best), EMPTY_CACHE);
}
