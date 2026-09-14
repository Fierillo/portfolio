export const FEATURED_REPOS = Object.freeze([
  'monitorcillo',
  'futbolcillo',
  'satoshillo',
  'clipcillo',
  'botillo',
  'fierillo',
]);

export const translations = {
  es: {
    metaTitle: 'Fierillolandia | Código, Bitcoin y libertad',
    metaDescription: 'Fierillolandia: proyectos, código y Bitcoin desde el rincón digital de un desarrollador autodidacta.',
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
    monitorDescription: 'Monitor macroeconómico de Argentina con datos oficiales comparables.',
    monitorTechnologies: 'Tecnologías de Monitorcillo',
    footballDescription: 'Juego de fútbol 2D por turnos con física, desafíos Nostr y multijugador.',
    footballTechnologies: 'Tecnologías de Futbolcillo',
    satsDescription: 'Extensión que convierte precios en monedas fiat a satoshis en cualquier web.',
    satsTechnologies: 'Tecnologías de Satoshillo',
    clipDescription: 'Editor de clips con transcripción, subtítulos y detección de silencios.',
    clipTechnologies: 'Tecnologías de Clipcillo',
    botDescription: 'Bot de Bitcoin para Discord y Telegram con predicciones y pagos Lightning.',
    botTechnologies: 'Tecnologías de Botillo',
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
    emptyDescription: 'Proyecto disponible en GitHub.',
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
    metaDescription: 'Fierillolandia: projects, code, and Bitcoin from a self-taught developer.',
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
    monitorDescription: 'An Argentine macroeconomic monitor with comparable official data.',
    monitorTechnologies: 'Monitorcillo technologies',
    footballDescription: 'A turn-based 2D football game with physics, Nostr challenges, and multiplayer.',
    footballTechnologies: 'Futbolcillo technologies',
    satsDescription: 'An extension that converts fiat prices into satoshis on any website.',
    satsTechnologies: 'Satoshillo technologies',
    clipDescription: 'A clip editor with transcription, subtitles, and silence detection.',
    clipTechnologies: 'Clipcillo technologies',
    botDescription: 'A Bitcoin bot for Discord and Telegram with predictions and Lightning payments.',
    botTechnologies: 'Botillo technologies',
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
    emptyDescription: 'Project available on GitHub.',
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

export function filterExplorerRepos(repos) {
  const featured = new Set(FEATURED_REPOS);
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
