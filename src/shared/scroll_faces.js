// Scroll image lookup, keyed by slug. Convention: a file
// `<variant>/master_scroll_faces/<slug>.<ext>` is the default face, where
// `<variant>` is `extended/` (NSFW) or `cookie_clicker/` (SFW), selected via
// VITE_SFW. An optional kirkified counterpart at
// `<variant>/master_scroll_faces_kirkified/<slug>_kirkified.<ext>` is paired
// in automatically. Variant resolution: `variant_assets.js`. Pairing logic:
// `kirkified_faces.js`.
//
// Consumers should reach for `useKirkifiedFace(SCROLL_FACE_PAIRS[slug])` to
// get the right URL for the current Kirk Mode setting.

import { pair_by_stem } from './kirkified_faces';
import { variant_modules } from './variant_assets';

export const SCROLL_FACE_PAIRS = pair_by_stem(
  variant_modules.master_scroll_faces,
  variant_modules.master_scroll_faces_kirkified,
);
