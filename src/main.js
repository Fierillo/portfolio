import './styles.css';

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

let audioContext;
let soundEnabled = false;
let projectsLoaded = false;

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
  };

  sounds[project].forEach((tone) => playTone(...tone));
}

function updateSoundButton() {
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundLabel.textContent = `Sonido: ${soundEnabled ? 'on' : 'off'}`;
  localStorage.setItem('fierillolandia-sound', String(soundEnabled));
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
  language.textContent = repo.language || 'Código';
  description.textContent = repo.description || 'Proyecto abierto disponible en GitHub.';
  meta.textContent = `${repo.archived ? 'ARCHIVADO' : 'REPO PÚBLICO'} · ${new Date(repo.pushed_at).getFullYear()} ↗`;

  heading.append(name, language);
  link.append(heading, description, meta);
  return link;
}

async function loadMoreProjects() {
  projectsStatus.hidden = false;
  projectsStatus.textContent = 'Conectando con GitHub...';

  try {
    const response = await fetch('https://api.github.com/users/Fierillo/repos?per_page=100&sort=updated');
    if (!response.ok) throw new Error(`GitHub respondió ${response.status}`);

    const featured = new Set(['monitorcillo', 'futbolcillo', 'satoshillo', 'fierillo']);
    const repos = (await response.json()).filter(
      (repo) => !repo.fork && !featured.has(repo.name.toLowerCase()),
    );

    repoList.replaceChildren(...repos.map(createRepoCard));
    projectsStatus.hidden = true;
    projectsLoaded = true;
  } catch {
    projectsStatus.textContent = 'No se pudo cargar la lista. Podés ver todos los proyectos directamente en GitHub.';

    const fallback = document.createElement('a');
    fallback.className = 'repo-list__fallback';
    fallback.href = 'https://github.com/Fierillo?tab=repositories';
    fallback.target = '_blank';
    fallback.rel = 'noreferrer';
    fallback.textContent = 'Abrir repositorios ↗';
    repoList.replaceChildren(fallback);
  }
}

moreProjectsToggle.addEventListener('click', () => {
  const expanded = moreProjectsToggle.getAttribute('aria-expanded') === 'true';
  moreProjectsToggle.setAttribute('aria-expanded', String(!expanded));
  moreProjectsLabel.textContent = expanded ? '+ Más proyectos' : '− Ocultar proyectos';
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

document.querySelector('#current-year').textContent = new Date().getFullYear();
document.querySelector('#block-number').textContent = String(850000 + Math.floor(Math.random() * 99999));
