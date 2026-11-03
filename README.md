<div align="center">

# Fierillolandia

**Code, Bitcoin, and individual freedom.**

[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2021-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-F7931A?style=for-the-badge)](LICENSE)

</div>

## About

Fierillolandia is my personal portfolio and the meeting point for the projects I build as a self-taught developer and Bitcoiner. It reflects the principles behind my work: curiosity, open source, individual sovereignty, and learning by building.

The site is designed as a small pixel-art world rather than a conventional portfolio. It includes optional synthesized sound effects, animated scenes, responsive layouts, and a live explorer that retrieves my public repositories from GitHub.

## Featured Projects

- [Monitorcillo](https://github.com/Fierillo/monitorcillo): an Argentine macroeconomic monitor built with official data from BCRA, INDEC, and MECON.
- [Futbolcillo](https://github.com/Fierillo/Futbolcillo): a turn-based 2D football game with pool-style physics, Nostr challenges, and multiplayer matches.
- [Satoshillo](https://github.com/Fierillo/satoshillo): a browser extension that converts ARS, USD, EUR, and JPY prices into satoshis on any website.
- [Clipcillo](https://github.com/Fierillo/clipcillo): a clip editor with automatic subtitle transcription, silence detection, and AI-assisted editing tools.
- [Workshopillo Wallets](https://github.com/Fierillo/workshopillo-wallets): an interactive workshop to understand Bitcoin Lightning and use your first wallet.

Every featured project's demo link uses its repository's Website as captured in the
build-time snapshot (see below), so changing Website takes effect on the next deploy.
If Website is missing, the link opens the repository instead. Source and release-download links stay separate.

## Features

- Responsive pixel-art interface.
- Optional Web Audio API sound effects.
- Unique hover sounds for featured projects.
- Live public repository list powered by the GitHub API.
- Reduced-motion support and keyboard-accessible controls.
- Static production build optimized for Vercel.

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Web Audio API
- GitHub REST API
- Vite
- Vercel

## Local Development

Requirements: Node.js 20.19 or newer.

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

The generated site is written to `dist/`.

```bash
pnpm test
```

## Featured Descriptions (ES/EN)

Featured cards are the repos pinned on the [GitHub profile](https://github.com/Fierillo) (max 6, in pinned order). Pinned repos are only available through the GitHub GraphQL API, which needs a token, so they are fetched at build time by `scripts/featured-snapshot.js` (`prebuild`) into `public/featured.json`; the browser only reads that snapshot (plus its localStorage copy) and never sees the token. The "more projects" list excludes the pinned repos. Without `GITHUB_TOKEN`, or if GitHub fails, the build warns and keeps the previous snapshot (or an empty list) instead of failing.

### `GITHUB_TOKEN` on Vercel

1. On GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token. Resource owner: your account; Repository access: **Public repositories (read-only)**; no extra permissions. Pick an expiration and copy the token.
2. On Vercel: Project → Settings → Environment Variables → add `GITHUB_TOKEN` with that value for Production and Preview (mark it Sensitive).
3. Redeploy. The build log shows `featured snapshot: <repo names>`. Re-pinning repos takes effect on the next deploy.

Locally: `GITHUB_TOKEN=$(gh auth token) pnpm build`.

### Translations

Their Spanish/English descriptions live in `src/featured-i18n.json` (`{ "<repo>": { "source", "es", "en" } }`); a translation is used only while `source` matches the current GitHub description, otherwise the raw description is shown.

To fill in new or changed descriptions locally (not part of the build), using [TranslateGemma 4B](https://huggingface.co/google/translategemma-4b-it) (GGUF) through a local llama.cpp `llama-server` on CPU. Only the Python standard library is needed; point `TG_MODEL` / `TG_SERVER` at your model and binary (defaults are the author's local paths). The source language is detected and translated en→es or es→en:

```bash
export TG_MODEL=/path/to/translategemma-4b-it.Q4_K_M.gguf
export TG_SERVER=/path/to/llama.cpp/build/bin/llama-server
python3 scripts/translate-featured.py                          # pinned repos (GITHUB_TOKEN or `gh` login)
python3 scripts/translate-featured.py --repos botillo,satoshillo
python3 scripts/translate-featured.py --repos botillo --force  # retranslate unchanged entries
python3 scripts/test_translate_featured.py                     # unit tests
```

Terms the model tends to translate (wallet/wallets, zap/zaps, totem, "totem screen" → "pantalla tótem", "zap" → "zapear") are listed in `PROTECTED` at the top of the script: they are swapped for placeholders before translating and restored afterwards. Names it keeps on its own (La Crypta, Lightning, Nostr, Bitcoin, NWC, Discord, Telegram) are in `KEEP` and passed in the prompt. If the model drops a placeholder, the text is retranslated without them and `GLOSSARY` fixes are applied. Review the output before committing.

Existing entries are kept unless their GitHub description changed, so editing the JSON by hand is fine. Commit the result.

## Deployment

The project is ready for Vercel. Import this repository and use the automatically detected Vite settings:

- Build command: `pnpm build`
- Output directory: `dist`

## Contact

- [GitHub](https://github.com/Fierillo)
- [Twitter](https://twitter.com/fierillo)
- [Telegram](https://t.me/FieriLLo)
- [Nostr · fierillo@hodl.ar](https://njump.me/npub18ggwqfvqmxt3m6f4ek2q55nghlj9380me364wd67wz8yzpyh8wusevpdmh)

## License

Distributed under the [ISC License](LICENSE).
