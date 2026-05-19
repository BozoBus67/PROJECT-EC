// Single source of truth for which edition is active. Read by constants.js,
// variant_assets.js, and any UI code that needs to branch on the variant.
//
// VITE_VARIANT is set per-Vercel-project in infra/vercel.tf. Unset → 'nsfw'
// (the default, used for local dev and the main EC deployment).

export const VARIANT = import.meta.env.VITE_VARIANT ?? 'nsfw';
export const IS_NSFW = VARIANT === 'nsfw';
