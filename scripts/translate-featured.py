#!/usr/bin/env python3
"""Translate featured repo descriptions between Spanish and English locally.

Local-only helper (not part of the build). Uses TranslateGemma 4B (GGUF) through a
local llama.cpp `llama-server` on CPU; only the Python standard library is needed:
  TG_MODEL=/path/model.gguf TG_SERVER=/path/llama-server python3 scripts/translate-featured.py [--repos a,b]

Repos are the pinned ones on GitHub (GraphQL via GITHUB_TOKEN, else `gh api graphql`).
Only entries that are missing or whose GitHub description ("source") changed are
translated; hand-edited entries are kept. Terms in PROTECTED are swapped for
placeholders before translating and restored afterwards.
"""
import argparse
import json
import os
import re
import socket
import subprocess
import time
import urllib.request
from pathlib import Path

# Terms that the model tends to translate: swapped for placeholders (case-insensitive,
# whole words) and restored with the output for each target language.
PROTECTED = {
    'totem screen': {'es': 'pantalla tótem', 'en': 'totem screen'},
    'wallets': {'es': 'wallets', 'en': 'wallets'},
    'wallet': {'es': 'wallet', 'en': 'wallet'},
    'zaps': {'es': 'zaps', 'en': 'zaps'},
    'zap': {'es': 'zapear', 'en': 'zap'},
    'zapear': {'es': 'zapear', 'en': 'zap'},
    'tótem': {'es': 'tótem', 'en': 'totem'},
    'totem': {'es': 'tótem', 'en': 'totem'},
}
# Names the model keeps on its own; listed in the prompt only (placeholders hurt quality).
KEEP = ['La Crypta', 'Lightning', 'Nostr', 'Bitcoin', 'NWC', 'Discord', 'Telegram']
# Fallback fixes applied when the model drops a placeholder and we retranslate plainly.
GLOSSARY = {'es': {r'\bcarteras\b': 'wallets', r'\bcartera\b': 'wallet'}, 'en': {}}

TOOLS = Path('/workspace/subtitulador/herramientas')
MODEL = os.environ.get('TG_MODEL', str(TOOLS / 'modelos/translategemma-4b-it.Q4_K_M.gguf'))
SERVER = os.environ.get('TG_SERVER', str(TOOLS / 'llama.cpp/build/bin/llama-server'))
TARGET = Path(__file__).resolve().parent.parent / 'src' / 'featured-i18n.json'
PINNED_QUERY = 'query { user(login: "Fierillo") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name description } } } } }'
NAMES = {'en': 'English', 'es': 'Spanish'}
PROMPT = ('<start_of_turn>user\nYou are a professional {src_name} ({src}) to {dst_name} ({dst}) translator. '
          'Your goal is to accurately convey the meaning and nuances of the original text in natural, '
          '{style} suitable for a software portfolio. Keep placeholders like [T0] exactly as they are.\n'
          'Produce only the {dst_name} translation, without any additional explanations or commentary. '
          'Please translate the following {src_name} text into {dst_name} ({dst}):\n\n\n'
          '{text}<end_of_turn>\n<start_of_turn>model\n')
STYLES = {'es': 'neutral Rioplatense Spanish', 'en': 'plain English'}
SLOT = re.compile(r'X\s*(\d+)\s*X')


def protect(text):
    slots = []
    pattern = '|'.join(re.escape(t) for t in sorted(PROTECTED, key=len, reverse=True))

    def swap(match):
        key = next(t for t in PROTECTED if t.lower() == match.group(0).lower())
        slots.append(key)
        return f'X{len(slots) - 1}X'

    return re.sub(rf'(?<!\w)({pattern})(?!\w)', swap, text, flags=re.IGNORECASE), slots


def restore(text, slots, target):
    return SLOT.sub(lambda m: PROTECTED[slots[int(m.group(1))]][target], text)


def fix_colon_case(text, target):
    keep = {v[target].split()[0] for v in PROTECTED.values()} | {name.split()[0] for name in KEEP}

    def lower(match):
        word = match.group(2)
        return match.group(1) + (word if word in keep or word.isupper() else word[0].lower() + word[1:])

    return re.sub(r'(:\s+)([A-ZÁÉÍÓÚÑ]\w*)', lower, text)


def detect(text):
    words = re.findall(r'\w+', text.lower())
    es = sum(w in {'de', 'la', 'el', 'y', 'con', 'para', 'en', 'los', 'las', 'un', 'una', 'que', 'del'} for w in words)
    en = sum(w in {'the', 'and', 'with', 'for', 'of', 'a', 'an', 'to', 'in', 'or', 'via'} for w in words)
    return 'es' if es > en or re.search(r'[áéíóúñ¿¡]', text.lower()) else 'en'


def fetch_repos():
    """Pinned repos, in order, via GITHUB_TOKEN or the local `gh` login."""
    token = os.environ.get('GITHUB_TOKEN')
    if token:
        request = urllib.request.Request('https://api.github.com/graphql', json.dumps({'query': PINNED_QUERY}).encode(),
                                         {'Authorization': f'bearer {token}', 'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=30) as response:
            body = json.load(response)
    else:
        body = json.loads(subprocess.run(['gh', 'api', 'graphql', '-f', f'query={PINNED_QUERY}'],
                                         check=True, capture_output=True, text=True).stdout)
    return [node for node in body['data']['user']['pinnedItems']['nodes'] if node]


class Translator:
    def __enter__(self):
        with socket.socket() as s:
            s.bind(('127.0.0.1', 0))
            self.port = s.getsockname()[1]
        self.process = subprocess.Popen([SERVER, '-m', MODEL, '-t', '4', '-c', '2048', '--host', '127.0.0.1',
                                         '--port', str(self.port)], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for _ in range(600):
            try:
                urllib.request.urlopen(f'http://127.0.0.1:{self.port}/health', timeout=1)
                return self
            except OSError:
                time.sleep(0.2)
        raise RuntimeError('llama-server did not start')

    def __exit__(self, *exc):
        self.process.terminate()

    def complete(self, text, source, target):
        prompt = PROMPT.format(src=source, dst=target, src_name=NAMES[source], dst_name=NAMES[target],
                               style=STYLES[target], keep=', '.join(KEEP), text=text)
        body = json.dumps({'prompt': prompt, 'n_predict': 300, 'temperature': 0, 'stop': ['<end_of_turn>']}).encode()
        request = urllib.request.Request(f'http://127.0.0.1:{self.port}/completion', body,
                                         {'Content-Type': 'application/json'})
        with urllib.request.urlopen(request, timeout=300) as response:
            return fix_colon_case(json.load(response)['content'].strip(), target)

    def translate(self, text, source, target):
        protected, slots = protect(text)
        output = self.complete(protected, source, target)
        if sorted(int(n) for n in SLOT.findall(output)) == list(range(len(slots))):
            return restore(output, slots, target)
        output = self.complete(text, source, target)
        for pattern, term in GLOSSARY[target].items():
            output = re.sub(pattern, term, output, flags=re.IGNORECASE)
        return output


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repos', help='comma-separated subset of the pinned repos to translate')
    parser.add_argument('--force', action='store_true', help='retranslate even if the source did not change')
    args = parser.parse_args()

    repos = fetch_repos()
    if args.repos:
        wanted = {name.strip().lower() for name in args.repos.split(',')}
        selected = [r for r in repos if r['name'].lower() in wanted]
    else:
        selected = repos

    data = json.loads(TARGET.read_text()) if TARGET.exists() else {}
    with Translator() as translator:
        for repo in selected:
            translate_repo(repo, data, translator, args.force)

    TARGET.write_text(json.dumps(dict(sorted(data.items())), ensure_ascii=False, indent=2) + '\n')


def translate_repo(repo, data, translator, force):
    source = repo.get('description')
    if not source:
        return
    entry = data.get(repo['name'])
    if entry and entry.get('source') == source and not force:
        print(f"kept {repo['name']}")
        return
    lang = detect(source)
    other = 'en' if lang == 'es' else 'es'
    data[repo['name']] = {'source': source, lang: source, other: translator.translate(source, lang, other)}
    print(f"translated {repo['name']} ({lang}->{other})")


if __name__ == '__main__':
    main()
