import './styles.css';

const translations = {
  es: {
    metaTitle: 'Fierillolandia | Código, Bitcoin y libertad',
    metaDescription: 'Fierillolandia: proyectos, código y Bitcoin desde el rincón digital de un desarrollador autodidacta.',
    skipLink: 'Saltar al contenido',
    bootReady: 'Sistema listo',
    enterSound: 'Entrar con sonido',
    enterSilent: 'Entrar en silencio',
    brandHome: 'Fierillolandia, inicio',
    mainNavigation: 'Navegación principal',
    navProjects: 'Proyectos',
    navAbout: 'Sobre mí',
    navContact: 'Contacto',
    languageSelector: 'Idioma',
    spanishLanguage: 'Español',
    englishLanguage: 'Inglés',
    soundOn: 'Sonido: on',
    soundOff: 'Sonido: off',
    heroEyebrow: 'BIENVENIDO, VIAJERO',
    heroTitle: 'Código, Bitcoin<br />y <span>libertad.</span>',
    heroIntro: 'Soy Fierillo: Un desarrollador autodidacta. Construyo herramientas por curiosidad, utilidad y soberanía.',
    exploreProjects: 'Explorar proyectos',
    meetCreator: 'Conocer al creador',
    heroSceneLabel: 'Oso desarrollador construyendo software en pixel art',
    nodeStatus: 'NODO ACTIVO · BLOQUE',
    projectsEyebrow: 'SELECCIÓN DE MISIONES',
    projectsTitle: 'Proyectos principales',
    projectsIntro: 'Cuatro artefactos construidos en Fierillolandia. Elegí uno para comenzar la exploración.',
    monitorDescription: 'Monitor macroeconómico de Argentina que reúne datos oficiales del BCRA, INDEC y MECON en tablas y gráficos comparables.',
    monitorTechnologies: 'Tecnologías de Monitorcillo',
    footballDescription: 'Juego de fútbol 2D por turnos con física estilo pool, entrenamiento local, desafíos vía Nostr y partidas multijugador.',
    footballTechnologies: 'Tecnologías de Futbolcillo',
    satsDescription: 'Extensión que detecta precios en ARS, USD, EUR y JPY en cualquier web y muestra su valor en satoshis en tiempo real.',
    satsTechnologies: 'Tecnologías de Satoshillo',
    clipDescription: 'Editor de clips con transcripción automática de subtítulos, detección de silencios y herramientas inteligentes para acelerar la edición.',
    clipTechnologies: 'Tecnologías de Clipcillo',
    viewProject: 'Ver proyecto',
    viewCode: 'Ver código',
    playNow: 'Jugar ahora',
    download: 'Descargar',
    code: 'Código',
    moreProjects: '+ Más proyectos',
    hideProjects: '− Ocultar proyectos',
    githubLoading: 'Conectando con GitHub...',
    githubError: 'No se pudo cargar la lista. Podés ver todos los proyectos directamente en GitHub.',
    githubFallback: 'Abrir repositorios ↗',
    publicRepo: 'REPO PÚBLICO',
    archivedRepo: 'ARCHIVADO',
    codeFallback: 'Código',
    emptyDescription: 'Proyecto abierto disponible en GitHub.',
    avatarAlt: 'Avatar de Fierillo: un oso en pixel art',
    aboutEyebrow: 'ARCHIVO DEL CREADOR',
    aboutTitle: 'Aprender, construir,<br /><span>compartir.</span>',
    aboutFirst: 'Con un background como estudiante de ingeniería, tengo el pragmatismo y la construcción en la sangre.',
    aboutSecond: 'Bitcoin me señaló el lugar donde quiero edificar; luego me hice dev de forma autodidacta y gracias a la IA pude alcanzar nuevas cotas de creatividad.',
    aboutThird: 'Fierillolandia es el lugar donde comparto todo lo que voy creando.',
    valuesTitle: 'Mis valores son:',
    valuesLabel: 'Mis valores',
    honesty: 'Honestidad',
    minimalism: 'Minimalismo',
    humility: 'Humildad',
    curiosity: 'Curiosidad',
    contactEyebrow: 'CANAL DE COMUNICACIÓN',
    contactTitle: '¿Construimos algo?',
    contactDescription: 'Encontrá mis proyectos abiertos o escribime por cualquiera de estos canales.',
    footerMade: 'Hecho con amor por Fierillo',
    systemOnline: 'SISTEMA ONLINE',
  },
  en: {
    metaTitle: 'Fierillolandia | Code, Bitcoin, and freedom',
    metaDescription: 'Fierillolandia: projects, code, and Bitcoin from the digital corner of a self-taught developer.',
    skipLink: 'Skip to content',
    bootReady: 'System ready',
    enterSound: 'Enter with sound',
    enterSilent: 'Enter silently',
    brandHome: 'Fierillolandia, home',
    mainNavigation: 'Main navigation',
    navProjects: 'Projects',
    navAbout: 'About me',
    navContact: 'Contact',
    languageSelector: 'Language',
    spanishLanguage: 'Spanish',
    englishLanguage: 'English',
    soundOn: 'Sound: on',
    soundOff: 'Sound: off',
    heroEyebrow: 'WELCOME, TRAVELER',
    heroTitle: 'Code, Bitcoin<br />and <span>freedom.</span>',
    heroIntro: 'I am Fierillo, a self-taught developer. I build tools driven by curiosity, usefulness, and sovereignty.',
    exploreProjects: 'Explore projects',
    meetCreator: 'Meet the creator',
    heroSceneLabel: 'Pixel-art developer bear building software',
    nodeStatus: 'ACTIVE NODE · BLOCK',
    projectsEyebrow: 'MISSION SELECTION',
    projectsTitle: 'Featured projects',
    projectsIntro: 'Four artifacts built in Fierillolandia. Choose one to begin exploring.',
    monitorDescription: 'An Argentine macroeconomic monitor that brings official BCRA, INDEC, and MECON data into comparable tables and charts.',
    monitorTechnologies: 'Monitorcillo technologies',
    footballDescription: 'A turn-based 2D football game with pool-style physics, local training, Nostr challenges, and multiplayer matches.',
    footballTechnologies: 'Futbolcillo technologies',
    satsDescription: 'A browser extension that detects ARS, USD, EUR, and JPY prices on any website and displays their real-time value in satoshis.',
    satsTechnologies: 'Satoshillo technologies',
    clipDescription: 'A clip editor with automatic subtitle transcription, silence detection, and intelligent tools that speed up the editing workflow.',
    clipTechnologies: 'Clipcillo technologies',
    viewProject: 'View project',
    viewCode: 'View code',
    playNow: 'Play now',
    download: 'Download',
    code: 'Code',
    moreProjects: '+ More projects',
    hideProjects: '− Hide projects',
    githubLoading: 'Connecting to GitHub...',
    githubError: 'The list could not be loaded. You can view every project directly on GitHub.',
    githubFallback: 'Open repositories ↗',
    publicRepo: 'PUBLIC REPO',
    archivedRepo: 'ARCHIVED',
    codeFallback: 'Code',
    emptyDescription: 'Open project available on GitHub.',
    avatarAlt: 'Fierillo avatar: a pixel-art bear',
    aboutEyebrow: 'CREATOR FILE',
    aboutTitle: 'Learn, build,<br /><span>share.</span>',
    aboutFirst: 'With a background as an engineering student, pragmatism and building are in my blood.',
    aboutSecond: 'Bitcoin showed me where I want to build; I then became a self-taught developer, and AI helped me reach new heights of creativity.',
    aboutThird: 'Fierillolandia is where I share everything I create.',
    valuesTitle: 'My values are:',
    valuesLabel: 'My values',
    honesty: 'Honesty',
    minimalism: 'Minimalism',
    humility: 'Humility',
    curiosity: 'Curiosity',
    contactEyebrow: 'COMMUNICATION CHANNEL',
    contactTitle: 'Shall we build?',
    contactDescription: 'Find my open projects or reach out through any of these channels.',
    footerMade: 'Made with love by Fierillo',
    systemOnline: 'SYSTEM ONLINE',
  },
};

const bootScreen = document.querySelector('#boot-screen');
const siteShell = document.querySelector('#site-shell');
const soundToggle = document.querySelector('#sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-toggle__text');
const enterButtons = document.querySelectorAll('[data-enter]');
const interactiveElements = document.querySelectorAll('a, button');
const projectCards = document.querySelectorAll('[data-project-sound]');
const moreProjectsToggle = document.querySelector('#more-projects-toggle');
const moreProjectsLabel = document.querySelector('#more-projects-label');
const otherProjects = document.querySelector('#other-projects');
const projectsStatus = document.querySelector('#projects-status');
const repoList = document.querySelector('#repo-list');
const languageButtons = document.querySelectorAll('[data-language]');
const metaDescription = document.querySelector('meta[name="description"]');

let audioContext;
let soundEnabled = false;
let projectsLoaded = false;
let loadedRepos = [];
let projectsState = 'idle';
let currentLanguage = localStorage.getItem('fierillolandia-language') === 'en' ? 'en' : 'es';

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency = 440, duration = 0.06, type = 'square', volume = 0.025, delay = 0) {
  if (!soundEnabled) return;

  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playBootSound() {
  playTone(220, 0.08, 'square', 0.035);
  playTone(330, 0.08, 'square', 0.035, 0.09);
  playTone(660, 0.16, 'square', 0.035, 0.18);
}

function playProjectSound(project) {
  const sounds = {
    monitor: [
      [190, 0.05, 'square', 0.018, 0],
      [285, 0.05, 'square', 0.02, 0.055],
      [380, 0.08, 'square', 0.018, 0.11],
    ],
    football: [
      [740, 0.08, 'sine', 0.025, 0],
      [980, 0.11, 'sine', 0.025, 0.07],
      [740, 0.06, 'sine', 0.018, 0.17],
    ],
    sats: [
      [880, 0.045, 'square', 0.02, 0],
      [1320, 0.06, 'square', 0.022, 0.045],
      [1760, 0.1, 'triangle', 0.018, 0.1],
    ],
    clip: [
      [520, 0.04, 'square', 0.018, 0],
      [390, 0.04, 'square', 0.018, 0.05],
      [520, 0.04, 'square', 0.018, 0.1],
      [780, 0.08, 'triangle', 0.018, 0.15],
    ],
  };

  sounds[project].forEach((tone) => playTone(...tone));
}

function updateSoundButton() {
  const text = translations[currentLanguage];
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundLabel.textContent = soundEnabled ? text.soundOn : text.soundOff;
  localStorage.setItem('fierillolandia-sound', String(soundEnabled));
}

function updateMoreProjectsLabel() {
  const expanded = moreProjectsToggle.getAttribute('aria-expanded') === 'true';
  const text = translations[currentLanguage];
  moreProjectsLabel.textContent = expanded ? text.hideProjects : text.moreProjects;
}

function renderProjectExplorer() {
  const text = translations[currentLanguage];

  if (projectsState === 'loaded') {
    projectsStatus.hidden = true;
    repoList.replaceChildren(...loadedRepos.map(createRepoCard));
    return;
  }

  projectsStatus.hidden = false;
  projectsStatus.dataset.state = projectsState;
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

  updateSoundButton();
  updateMoreProjectsLabel();
  renderProjectExplorer();
}

function enterSite(withSound) {
  soundEnabled = withSound;
  updateSoundButton();
  if (withSound) playBootSound();

  bootScreen.classList.add('boot-screen--hidden');
  siteShell.removeAttribute('inert');
  document.body.classList.add('is-ready');
  window.setTimeout(() => bootScreen.remove(), 650);
}

enterButtons.forEach((button) => {
  button.addEventListener('click', () => enterSite(button.dataset.enter === 'sound'));
});

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateSoundButton();
  if (soundEnabled) playTone(620, 0.12, 'square', 0.035);
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language));
});

interactiveElements.forEach((element) => {
  element.addEventListener('pointerenter', () => {
    if (!element.closest('.project-card')) playTone(300, 0.035, 'square', 0.012);
  });
  element.addEventListener('click', () => playTone(520, 0.06, 'square', 0.025));
});

projectCards.forEach((card) => {
  card.addEventListener('pointerenter', () => playProjectSound(card.dataset.projectSound));
});

function createRepoCard(repo) {
  const text = translations[currentLanguage];
  const link = document.createElement('a');
  const heading = document.createElement('div');
  const name = document.createElement('h3');
  const language = document.createElement('span');
  const description = document.createElement('p');
  const meta = document.createElement('span');

  link.className = 'repo-card';
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.addEventListener('pointerenter', () => playTone(340, 0.04, 'square', 0.012));
  link.addEventListener('click', () => playTone(520, 0.06, 'square', 0.025));

  heading.className = 'repo-card__heading';
  name.textContent = repo.name;
  language.textContent = repo.language || text.codeFallback;
  description.textContent = repo.description || text.emptyDescription;
  meta.textContent = `${repo.archived ? text.archivedRepo : text.publicRepo} · ${new Date(repo.pushed_at).getFullYear()} ↗`;

  heading.append(name, language);
  link.append(heading, description, meta);
  return link;
}

async function loadMoreProjects() {
  projectsState = 'loading';
  renderProjectExplorer();

  try {
    const response = await fetch('https://api.github.com/users/Fierillo/repos?per_page=100&sort=updated');
    if (!response.ok) throw new Error(`GitHub respondió ${response.status}`);

    const featured = new Set(['monitorcillo', 'futbolcillo', 'satoshillo', 'clipcillo', 'fierillo']);
    loadedRepos = (await response.json()).filter(
      (repo) => !repo.fork && !featured.has(repo.name.toLowerCase()),
    );

    projectsState = 'loaded';
    projectsLoaded = true;
    renderProjectExplorer();
  } catch {
    projectsState = 'error';
    renderProjectExplorer();
  }
}

moreProjectsToggle.addEventListener('click', () => {
  const expanded = moreProjectsToggle.getAttribute('aria-expanded') === 'true';
  moreProjectsToggle.setAttribute('aria-expanded', String(!expanded));
  updateMoreProjectsLabel();
  otherProjects.hidden = expanded;

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
  { threshold: 0.14 },
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

applyLanguage(currentLanguage);
document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#block-number').textContent = String(850000 + Math.floor(Math.random() * 99999));
