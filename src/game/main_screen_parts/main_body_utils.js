// Clickbait-ad rotation data + helpers used by the middle pane of Main_Body.
// The ad image set comes from `<variant>/clickbait_faces/`, where `<variant>`
// is `extended/` (NSFW) or `cookie_clicker/` (SFW), selected via VITE_SFW.
// Drop a new image in the active variant's folder and it joins the rotation
// automatically. JPG is preferred for photographic ads (much smaller than
// PNG); PNG is fine for the few that need transparency.
//
// Each ad is paired with an optional "kirkified" version sourced from
// `<variant>/clickbait_faces_kirkified/` by stem-name match. So
// `vishnu_1.jpg` pairs with `vishnu_1_kirkified.jpg` if it exists. The
// pairing logic lives in shared/kirkified_faces.js — same helper that
// powers the master-scroll faces. Variant resolution: shared/variant_assets.js.

import { pair_by_stem } from '../../shared/kirkified_faces';
import { variant_modules } from '../../shared/variant_assets';

export const ADS = Object.values(pair_by_stem(
  variant_modules.clickbait_faces,
  variant_modules.clickbait_faces_kirkified,
));

// Where to place the ad's close-X button. Each rotation picks a random corner
// to make the close button slightly harder to catch — leaning into the
// "annoying ad" gag.
export const AD_CLOSE_BUTTON_CORNERS = [
  { top: '8px', left: '8px' },
  { top: '8px', right: '8px' },
  { bottom: '8px', left: '8px' },
  { bottom: '8px', right: '8px' },
];

// Pick a different ad index than the current one. Avoids showing the same ad
// twice in a row, which feels broken even if it's technically random.
export function random_next_ad_index(current) {
  let next;
  do { next = Math.floor(Math.random() * ADS.length); } while (next === current);
  return next;
}
