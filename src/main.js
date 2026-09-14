import { inject } from '@vercel/analytics';
import {
  explorerPresentation,
  filterExplorerRepos,
  moreProjectsCopy,
  resolveLanguage,
  translations,
} from './catalog.js';
import './styles.css';

inject();

const languageButtons = document.querySelectorAll('[data-language]');
const moreProjectsToggle = document.querySelector('#more-projects-toggle');
const moreProjectsLabel = document.querySelector('#more-projects-label');
const otherProjects = document.querySelector('#other-projects');
const projectsStatus = document.querySelector('#projects-status');
const repoList = document.querySelector('#repo-list');
const metaDescription = document.querySelector('meta[name="description"]');

let currentLanguage = resolveLanguage(localStorage.getItem('fierillolandia-language'));
let projectsLoaded = false;
let loadedRepos = [];
let projectsState = 'idle';

function createRepoCard(card) {
  const link = document.createElement('a');
  const heading = document.createElement('div');
  const name = document.createElement('h3');
  const language = document.createElement('span');
  const description = document.createElement('p');

  link.className = 'repo-card';
  link.href = card.href;
  link.target = '_blank';
  link.rel = 'noreferrer';
  heading.className = 'repo-card__heading';
  name.textContent = card.name;
  language.textContent = card.language;
  description.textContent = card.description;
  heading.append(name, language);
  link.append(heading, description);

  if (card.archivedLabel) {
    const meta = document.createElement('span');
    meta.textContent = card.archivedLabel;
    link.append(meta);
  }

  return link;
}

function renderProjectExplorer() {
  const view = explorerPresentation(projectsState, loadedRepos, translations[currentLanguage]);

  projectsStatus.hidden = view.statusHidden;
  projectsStatus.textContent = view.statusText;

  if (view.fallback) {
    const fallback = document.createElement('a');
    fallback.className = 'repo-list__fallback';
    fallback.href = view.fallback.href;
    fallback.target = '_blank';
    fallback.rel = 'noreferrer';
    fallback.textContent = view.fallback.label;
    repoList.replaceChildren(fallback);
    return;
  }

  repoList.replaceChildren(...view.cards.map(createRepoCard));
}

function updateMoreProjectsLabel() {
  const copy = moreProjectsCopy(moreProjectsToggle.getAttribute('aria-expanded') === 'true', translations[currentLanguage]);
  moreProjectsLabel.textContent = copy.label;
  moreProjectsToggle.lastElementChild.textContent = copy.symbol;
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

    loadedRepos = filterExplorerRepos(await response.json());
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
