// Variant resolution. `extended/` (NSFW) and `cookie_clicker/` (SFW) mirror
// each other; VITE_SFW picks which is active. In SFW mode, cookie_clicker/
// takes priority; missing stems fall back to extended/. NSFW builds never
// touch cookie_clicker/.
//
// Not all asset categories are variant-aware. Clickbait ads (kept identical
// between editions on purpose — the absurd-photo gag is the joke regardless
// of edition) live in `assets/shared/` and are loaded directly by
// main_body_utils.js, not through this file. UI chrome lives in `assets/ui/`.

const SFW = import.meta.env.VITE_SFW === 'true';

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

// For glob-iterating callers (pair_by_stem). In SFW mode both folders' modules
// are spread; pair_by_stem iterates and the cookie_clicker entry overwrites
// the extended one for any shared stem because of insertion order.
function merged(category) {
  return SFW ? { ...ext[category], ...cc[category] } : ext[category];
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
// image, etc.). SFW prefers cookie_clicker/, falls back to extended/.
export function variant_asset(category, stem) {
  if (SFW) {
    const sfw_hit = lookup_in(cc[category], stem);
    if (sfw_hit) return sfw_hit;
  }
  return lookup_in(ext[category], stem);
}
