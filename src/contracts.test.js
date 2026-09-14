import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const main = readFileSync(new URL('./main.js', import.meta.url), 'utf8');

describe('site contracts', () => {
  it('keeps founding block numbers on featured projects', () => {
    expect(html).toContain('Fundado en bloque</span> 937736');
    expect(html).toContain('Fundado en bloque</span> 953158');
    expect(html).toContain('Fundado en bloque</span> 961365');
    expect(html).toContain('Fundado en bloque</span> 961051');
    expect(html).toContain('Fundado en bloque</span> 862896');
  });

  it('does not include sound or boot UI', () => {
    expect(html).not.toMatch(/sound|boot-screen|AudioContext/i);
    expect(main).not.toMatch(/AudioContext|playTone|soundEnabled/);
  });

  it('keeps the bear in the hero grid instead of overlaying the title', () => {
    expect(css).not.toMatch(/\.hacker-bear\s*\{[^}]*position:\s*absolute/s);
    const stacked = css.slice(css.indexOf('@media (max-width: 1024px)'));
    expect(stacked).toMatch(/\.hacker-bear\s*\{[^}]*grid-column:\s*1/s);
  });
});
