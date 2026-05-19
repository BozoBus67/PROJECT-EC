// Variant resolution. Each variant has an asset folder under ../assets/.
// VITE_VARIANT picks which is active; missing stems fall back through a
// per-variant chain so we never leak NSFW imagery into a non-NSFW build.
//
// Chains (priority-first → fallback):
//   nsfw      → extended only
//   sfw       → cookie_clicker → extended
//   gemstone  → gemstone → cookie_clicker → extended
//
// Why the gemstone chain includes cookie_clicker: any stem missing from
// gemstone/ falls back to the SFW asset before the NSFW one, so we don't have
// to author every gemstone asset up front to keep gemstone builds clean.
//
// Not all asset categories are variant-aware. Clickbait ads (kept similar
// shape between editions on purpose — the absurd-photo gag is the joke
// regardless of edition) live in `assets/shared/` and are loaded directly by
// main_body_utils.js, not through this file. UI chrome lives in `assets/ui/`.

import { VARIANT } from './variant';

const ext = {
  master_scroll_faces:           import.meta.glob('../assets/extended/master_scroll_faces/*',           { eager: true }),
  master_scroll_faces_kirkified: import.meta.glob('../assets/extended/master_scroll_faces_kirkified/*', { eager: true }),
  backgrounds:                   import.meta.glob('../assets/extended/backgrounds/*',                   { eager: true }),
};

const cc = {
  master_scroll_faces:           import.meta.glob('../assets/cookie_clicker/master_scroll_faces/*',           { eager: true }),
  master_scroll_faces_kirkified: import.meta.glob('../assets/cookie_clicker/master_scroll_faces_kirkified/*', { eager: true }),
  backgrounds:                   import.meta.glob('../assets/cookie_clicker/backgrounds/*',                   { eager: true }),
};

const gem = {
  master_scroll_faces:           import.meta.glob('../assets/gemstone/master_scroll_faces/*',           { eager: true }),
  master_scroll_faces_kirkified: import.meta.glob('../assets/gemstone/master_scroll_faces_kirkified/*', { eager: true }),
  backgrounds:                   import.meta.glob('../assets/gemstone/backgrounds/*',                   { eager: true }),
};

const FOLDERS = { extended: ext, cookie_clicker: cc, gemstone: gem };

// Chain is ordered fallback-first → priority-last (matching insertion-order
// spread semantics, where later entries overwrite earlier ones). Reversed
// when doing priority-first single-asset lookup below.
const CHAINS = {
  nsfw:     ['extended'],
  sfw:      ['extended', 'cookie_clicker'],
  gemstone: ['extended', 'cookie_clicker', 'gemstone'],
};

const chain = CHAINS[VARIANT] ?? CHAINS.nsfw;

// For glob-iterating callers (pair_by_stem). Each folder's modules are spread
// in chain order so later folders override earlier ones on shared stems.
function merged(category) {
  let result = {};
  for (const folder of chain) {
    result = { ...result, ...FOLDERS[folder][category] };
  }
  return result;
}

export const variant_modules = {
  master_scroll_faces:           merged('master_scroll_faces'),
  master_scroll_faces_kirkified: merged('master_scroll_faces_kirkified'),
  backgrounds:                   merged('backgrounds'),
};

function lookup_in(modules, stem) {
  for (const [path, mod] of Object.entries(modules ?? {})) {
    const filename = path.split('/').pop();
    const file_stem = filename.replace(/\.[^.]+$/, '');
    if (file_stem === stem) return mod.default;
  }
  return null;
}

// Single-asset lookup for direct importers (auth backgrounds, the cookie
// image, etc.). Walks the chain priority-first (last folder in chain wins).
export function variant_asset(category, stem) {
  for (let i = chain.length - 1; i >= 0; i--) {
    const hit = lookup_in(FOLDERS[chain[i]][category], stem);
    if (hit) return hit;
  }
  return null;
}
