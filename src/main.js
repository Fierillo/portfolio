import { inject } from '@vercel/analytics';
import './styles.css';

inject();

const translations = {
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

const languageButtons = document.querySelectorAll('[data-language]');
const moreProjectsToggle = document.querySelector('#more-projects-toggle');
const moreProjectsLabel = document.querySelector('#more-projects-label');
const otherProjects = document.querySelector('#other-projects');
const projectsStatus = document.querySelector('#projects-status');
const repoList = document.querySelector('#repo-list');
const metaDescription = document.querySelector('meta[name="description"]');

let currentLanguage = localStorage.getItem('fierillolandia-language') === 'en' ? 'en' : 'es';
let projectsLoaded = false;
let loadedRepos = [];
let projectsState = 'idle';

function createRepoCard(repo) {
  const text = translations[currentLanguage];
  const link = document.createElement('a');
  const heading = document.createElement('div');
  const name = document.createElement('h3');
  const language = document.createElement('span');
  const description = document.createElement('p');

  link.className = 'repo-card';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  heading.className = 'repo-card__heading';
  name.textContent = repo.name;
  language.textContent = repo.language || text.codeFallback;
  description.textContent = repo.description || text.emptyDescription;
  heading.append(name, language);
  link.append(heading, description);

  if (repo.archived) {
    const meta = document.createElement('span');
    meta.textContent = text.archivedRepo;
    link.append(meta);
  }

  return link;
}

function renderProjectExplorer() {
  const text = translations[currentLanguage];

  if (projectsState === 'loaded') {
    projectsStatus.hidden = true;
    repoList.replaceChildren(...loadedRepos.map(createRepoCard));
    return;
  }

  projectsStatus.hidden = false;
  projectsStatus.textContent = projectsState === 'error' ? text.githubError : text.githubLoading;

  if (projectsState === 'error') {
    const fallback = document.createElement('a');
    fallback.className = 'repo-list__fallback';
    fallback.href = 'https://github.com/Fierillo?tab=repositories';
    fallback.target = '_blank';
    fallback.rel = 'noreferrer';
    fallback.textContent = text.githubFallback;
    repoList.replaceChildren(fallback);
  }
}

function updateMoreProjectsLabel() {
  const expanded = moreProjectsToggle.getAttribute('aria-expanded') === 'true';
  moreProjectsLabel.textContent = expanded ? translations[currentLanguage].hideProjects : translations[currentLanguage].moreProjects;
  moreProjectsToggle.lastElementChild.textContent = expanded ? '−' : '＋';
}

function applyLanguage(language) {
  currentLanguage = language;
  const text = translations[language];

  document.documentElement.lang = language;
  document.title = text.metaTitle;
  metaDescription.content = text.metaDescription;
  localStorage.setItem('fierillolandia-language', language);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = text[element.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    element.innerHTML = text[element.dataset.i18nHtml];
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    element.setAttribute('aria-label', text[element.dataset.i18nAriaLabel]);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
    element.alt = text[element.dataset.i18nAlt];
  });
  languageButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });

  updateMoreProjectsLabel();
  renderProjectExplorer();
}

async function loadMoreProjects() {
  projectsState = 'loading';
  renderProjectExplorer();

  try {
    const response = await fetch('https://api.github.com/users/Fierillo/repos?per_page=100&sort=updated');
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

    const featured = new Set(['monitorcillo', 'futbolcillo', 'satoshillo', 'clipcillo', 'botillo', 'fierillo']);
    loadedRepos = (await response.json()).filter((repo) => !repo.fork && !featured.has(repo.name.toLowerCase()));
    projectsState = 'loaded';
    projectsLoaded = true;
  } catch {
    projectsState = 'error';
  }

  renderProjectExplorer();
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});

moreProjectsToggle.addEventListener('click', () => {
  const expanded = moreProjectsToggle.getAttribute('aria-expanded') === 'true';
  moreProjectsToggle.setAttribute('aria-expanded', String(!expanded));
  otherProjects.hidden = expanded;
  updateMoreProjectsLabel();
  if (!expanded && !projectsLoaded) loadMoreProjects();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

async function updateBlockHeight() {
  try {
    const response = await fetch('https://mempool.space/api/blocks/tip/height');
    if (!response.ok) return;
    document.querySelector('#block-number').textContent = await response.text();
  } catch {
    // The placeholder remains visible when the external service is unavailable.
  }
}

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
applyLanguage(currentLanguage);
updateBlockHeight();
