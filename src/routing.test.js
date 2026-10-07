import { existsSync, readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('forwards only well-known requests to Walletilla, preserving the portfolio routes', () => {
  const file = new URL('../vercel.json', import.meta.url);
  const config = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : {};

  expect(config.rewrites).toEqual([
    {
      source: '/.well-known/:path*',
      destination: 'https://walletilla.fierillo.world/.well-known/:path*',
    },
  ]);
});
