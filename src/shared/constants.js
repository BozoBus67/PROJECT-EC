// ─────────────────────────────────────────────────────────────────────────────
// User-facing text content for the entire game — the swappable text layer.
// Every name, label, ad string, tier title, and scroll display name lives
// here. Mechanics (costs, ELO bands, scroll → chess_elo) live elsewhere and
// don't reference any of this. Strings only.
//
// Two editions: NSFW (default) and SFW (resume / portfolio build). Toggle
// via VITE_SFW=true in .env or on Vercel — defaults to NSFW.
//
// Scroll IDs below are the stable slugs from scroll_registry.js — mechanics-
// side, never change. Only the values are swappable.
// ─────────────────────────────────────────────────────────────────────────────

const NSFW = (() => {
  const QUANTITY_NAME = 'children trafficked';
  return {
    QUANTITY_NAME,
    BUILDING_NAMES: {
      building_1:  'Cursor',
      building_2:  'Diddy Factory',
      building_3:  'Baby Oil Factory',
      building_4:  'Mega Diddy Factory',
      building_5:  'NYC Apartment',
      building_6:  'Mexico House',
      building_7:  'Gulfstream Jet',
      building_8:  'Private Island Runway',
      building_9:  'Shell Company Empire',
      building_10: 'Offshore Money Network',
      building_11: 'Media Control Machine',
      building_12: 'Global Lobbying Force',
      building_13: 'World Influence Grid',
    },
    SCROLL_DISPLAY_NAMES: {
      '6_7_kid':             '6/7 Kid',
      adolf_hitler:          'Adolf Hitler',
      blurry_epstein:        'Shadow Clone Jutsu',
      caseoh:                'CaseOh',
      charlie_kirk:          'Charlie Kirk',
      dexter:                'Dexter',
      diddy:                 'Diddy',
      doakes:                'Doakes',
      donald_trump:          'Donald Trump',
      drake:                 'Drake',
      elon_musk:             'Elon Musk',
      freddy_fazbear:        'Freddy Fazbear',
      george_floyd:          'George Floyd',
      hillary_clinton:       'Hillary Clinton',
      ishowspeed:            'iShowSpeed',
      kai_cenat:             'Kai Cenat',
      khaby_lame:            'Khaby Lame',
      mark_zuckerberg:       'Mark Zuckerberg',
      mr_beast:              'MrBeast',
      ninja_from_fortnite:   'Ninja',
      roy_lee:               'Roy Lee',
      state_trooper_cop:     'State Trooper',
      stephen_hawking:       'Stephen Hawking',
      tung_tung_tung_sahur:  'Tung Tung Tung Sahur',
      walter_white:          'Walter White',
    },
    SCROLL_DESCRIPTIONS: {
      '6_7_kid':             'Not yet implemented',
      adolf_hitler:          'Not yet implemented',
      blurry_epstein:        `${QUANTITY_NAME} per second multiplied by 1000`,
      caseoh:                'Not yet implemented',
      charlie_kirk:          'Unlocks Kirk Mode (toggle in settings) — kirkifies all clickbait ads',
      dexter:                'Not yet implemented',
      diddy:                 'Diddy Factory, Baby Oil Factory, and Mega Diddy Factory production ×2500',
      doakes:                'Not yet implemented',
      donald_trump:          'Not yet implemented',
      drake:                 'Not yet implemented',
      elon_musk:             'Not yet implemented',
      freddy_fazbear:        'Not yet implemented',
      george_floyd:          'Unlocks dark mode',
      hillary_clinton:       'Not yet implemented',
      ishowspeed:            'Not yet implemented',
      kai_cenat:             'Not yet implemented',
      khaby_lame:            'Not yet implemented',
      mark_zuckerberg:       'Not yet implemented',
      mr_beast:              'Not yet implemented',
      ninja_from_fortnite:   'Not yet implemented',
      roy_lee:               'Not yet implemented',
      state_trooper_cop:     'Unlocks light mode',
      stephen_hawking:       'Not yet implemented',
      tung_tung_tung_sahur:  'Not yet implemented',
      walter_white:          'Not yet implemented',
    },
    AD_TEXT: 'HOT GIRLS IN YOUR AREA WANT TO S3X',
    BAKERY_SUBSTITUTE_NAME: 'Island',
    ACCOUNT_TIER_NAMES: {
      account_tier_0: 'Free',
      account_tier_1: 'Plus',
      account_tier_2: 'Pro',
      account_tier_3: 'Enterprise',
      account_tier_4: 'Premium',
      account_tier_5: 'Luxurious',
      account_tier_6: 'Jewish',
      account_tier_7: 'Jewish+',
      account_tier_8: 'Jewish++',
      account_tier_9: 'Jewish+++',
    },
  };
})();

// SFW values — resume / portfolio edition. AD_TEXT and BAKERY_SUBSTITUTE_NAME
// not yet swapped; QUANTITY_NAME also still set to the NSFW string for now.
const SFW = (() => {
  const QUANTITY_NAME = 'children trafficked';
  return {
    QUANTITY_NAME,
    BUILDING_NAMES: {
      building_1:  'Cursor',
      building_2:  'Grandma',
      building_3:  'Farm',
      building_4:  'Mine',
      building_5:  'Factory',
      building_6:  'Bank',
      building_7:  'Temple',
      building_8:  'Wizard Tower',
      building_9:  'Shipment',
      building_10: 'Alchemy Lab',
      building_11: 'Portal',
      building_12: 'Time Machine',
      building_13: 'Antimatter Condenser',
    },
    SCROLL_DISPLAY_NAMES: {
      '6_7_kid':             '6/7 Kid',
      adolf_hitler:          'Hank Hill',
      blurry_epstein:        'Shadow Clone Jutsu',
      caseoh:                'CaseOh',
      charlie_kirk:          'Captain Kirk',
      dexter:                'Dexter',
      diddy:                 'Bruno Mars',
      doakes:                'Doakes',
      donald_trump:          'Donald Duck',
      drake:                 'Drake',
      elon_musk:             'Tony Stark',
      freddy_fazbear:        'Freddy Fazbear',
      george_floyd:          'Pink Floyd',
      hillary_clinton:       'Hilary Duff',
      ishowspeed:            'iShowSpeed',
      kai_cenat:             'Kai Cenat',
      khaby_lame:            'Khaby Lame',
      mark_zuckerberg:       'Mark Twain',
      mr_beast:              'MrBeast',
      ninja_from_fortnite:   'Ninja',
      roy_lee:               'Roy Lee',
      state_trooper_cop:     'State Trooper',
      stephen_hawking:       'Stephen Hawking',
      tung_tung_tung_sahur:  'Tung Tung Tung Sahur',
      walter_white:          'Walter White',
    },
    SCROLL_DESCRIPTIONS: {
      '6_7_kid':             'Not yet implemented',
      adolf_hitler:          'Not yet implemented',
      blurry_epstein:        `${QUANTITY_NAME} per second multiplied by 1000`,
      caseoh:                'Not yet implemented',
      charlie_kirk:          'Unlocks Kirk Mode (toggle in settings) — kirkifies all clickbait ads',
      dexter:                'Not yet implemented',
      diddy:                 'Grandma, Farm, and Mine production ×2500',
      doakes:                'Not yet implemented',
      donald_trump:          'Not yet implemented',
      drake:                 'Not yet implemented',
      elon_musk:             'Not yet implemented',
      freddy_fazbear:        'Not yet implemented',
      george_floyd:          'Unlocks dark mode',
      hillary_clinton:       'Not yet implemented',
      ishowspeed:            'Not yet implemented',
      kai_cenat:             'Not yet implemented',
      khaby_lame:            'Not yet implemented',
      mark_zuckerberg:       'Not yet implemented',
      mr_beast:              'Not yet implemented',
      ninja_from_fortnite:   'Not yet implemented',
      roy_lee:               'Not yet implemented',
      state_trooper_cop:     'Unlocks light mode',
      stephen_hawking:       'Not yet implemented',
      tung_tung_tung_sahur:  'Not yet implemented',
      walter_white:          'Not yet implemented',
    },
    AD_TEXT: 'HOT GIRLS IN YOUR AREA WANT TO S3X',
    BAKERY_SUBSTITUTE_NAME: 'Island',
    ACCOUNT_TIER_NAMES: {
      account_tier_0: 'Free',
      account_tier_1: 'Plus',
      account_tier_2: 'Pro',
      account_tier_3: 'Enterprise',
      account_tier_4: 'Premium',
      account_tier_5: 'Luxurious',
      account_tier_6: 'Diamond',
      account_tier_7: 'Diamond+',
      account_tier_8: 'Diamond++',
      account_tier_9: 'Diamond+++',
    },
  };
})();

const T = import.meta.env.VITE_SFW === 'true' ? SFW : NSFW;

export const QUANTITY_NAME          = T.QUANTITY_NAME;
export const BUILDING_NAMES         = T.BUILDING_NAMES;
export const SCROLL_DISPLAY_NAMES   = T.SCROLL_DISPLAY_NAMES;
export const SCROLL_DESCRIPTIONS    = T.SCROLL_DESCRIPTIONS;
export const AD_TEXT                = T.AD_TEXT;
export const BAKERY_SUBSTITUTE_NAME = T.BAKERY_SUBSTITUTE_NAME;
export const ACCOUNT_TIER_NAMES     = T.ACCOUNT_TIER_NAMES;

// Tier thresholds for owned-count → tier badge. Mechanics, not text — same in
// both editions. Mirrored in backend/data/scrolls.py — keep both in sync.
export const SCROLL_TIERS = [
  { min: 100, tier: 5 },
  { min: 25,  tier: 4 },
  { min: 10,  tier: 3 },
  { min: 4,   tier: 2 },
  { min: 1,   tier: 1 },
];
