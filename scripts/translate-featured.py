#!/usr/bin/env python3
"""Translate featured repo descriptions between Spanish and English locally.

Local-only helper (not part of the build). Requires argostranslate and langdetect:
  python3 -m venv /tmp/argos-venv && /tmp/argos-venv/bin/pip install argostranslate langdetect
  /tmp/argos-venv/bin/python scripts/translate-featured.py [--repos name1,name2]

Only entries that are missing or whose GitHub description ("source") changed are
translated; hand-edited entries are kept.
"""
import argparse
import json
import urllib.request
from pathlib import Path

TARGET = Path(__file__).resolve().parent.parent / 'src' / 'featured-i18n.json'
API = 'https://api.github.com/users/Fierillo/repos?per_page=100&sort=updated'


def fetch_repos():
    request = urllib.request.Request(API, headers={'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def detect(text):
    from langdetect import DetectorFactory, detect_langs
    DetectorFactory.seed = 0
    for guess in detect_langs(text):
        if guess.lang in ('es', 'en'):
            return guess.lang
    return 'en'


def ensure_package(source, target):
    import argostranslate.package
    import argostranslate.translate
    installed = argostranslate.translate.get_installed_languages()
    codes = {lang.code for lang in installed}
    if source in codes and target in codes:
        pair = next(l for l in installed if l.code == source).get_translation(next(l for l in installed if l.code == target))
        if pair:
            return
    argostranslate.package.update_package_index()
    package = next(p for p in argostranslate.package.get_available_packages() if p.from_code == source and p.to_code == target)
    argostranslate.package.install_from_path(package.download())


def translate(text, source, target):
    import argostranslate.translate
    ensure_package(source, target)
    return argostranslate.translate.translate(text, source, target)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--repos', help='comma-separated repo names to translate instead of the featured topic')
    args = parser.parse_args()

    repos = fetch_repos()
    if args.repos:
        wanted = {name.strip().lower() for name in args.repos.split(',')}
        selected = [r for r in repos if r['name'].lower() in wanted]
    else:
        selected = [r for r in repos if not r.get('fork') and 'featured' in (r.get('topics') or [])]

    data = json.loads(TARGET.read_text()) if TARGET.exists() else {}
    for repo in selected:
        source = repo.get('description')
        if not source:
            continue
        entry = data.get(repo['name'])
        if entry and entry.get('source') == source:
            print(f"kept {repo['name']}")
            continue
        lang = detect(source)
        other = 'en' if lang == 'es' else 'es'
        data[repo['name']] = {'source': source, lang: source, other: translate(source, lang, other)}
        print(f"translated {repo['name']} ({lang}->{other})")

    TARGET.write_text(json.dumps(dict(sorted(data.items())), ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
