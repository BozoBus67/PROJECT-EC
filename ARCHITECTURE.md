> ✅ Proofread and edited.

# Architecture

Subfolders under src with nontrivial complexity have their own READMEs, containing documentation specific to that subfolder. 

## Locality of Behavior for CSS and Tailwind

CSS and Tailwind styling lives in the JSX it applies to. I decided that this design approach is superior to having a tree of named CSS classes for components to inherit from. There is a term for this — Locality of Behavior: the behavior of a unit of code should be obvious from reading that unit alone, not from tracing a cascade across other files.

In VS Code, you can press `Cmd+K Cmd+0` to collapse every function. The result is a file that shows a clean "component map". Very useful. 

Both inline styles and Tailwind are used in this project. Either is fine. The most important aspect is again readability. 

## Feature vs Error

React toasts are used frequently in this project. They are used both for feature purposes, and to log errors. This may be changed in the future. 

If a toast starts with Error: ... it's an error, if not then it's a feature. 

## Code

- JSX Components are written top-down by hierarchy. (e.g. screen first, then sub-components in render order, then modals, etc.). State is co-located with the thing that triggers it.
- Import order: `react` → external libs (alphabetical) → `../shared/*` (alphabetical) → `./*` (alphabetical). Enforced loosely. 
- `type="button"` on every `<button>`. HTML's default is `type="submit"`, so any button inside a `<form>` ancestor would trigger form submission on click — including "Cancel" buttons. We don't currently use `<form>` elements; this is defensive against a future refactor that introduces one.

## API

- Use the `*_auth` helpers in `shared/api_client.js` for authenticated endpoints — they auto-inject the Supabase JWT. 
- Use plain `get`/`post`/`patch` for public endpoints like `/login` and `/get_listings`.
- Each folder that talks to the backend has its own `api.js` exposing named functions (`api_buy_listing`, etc.). Internal-only api functions stay there; the ones used cross-folder get re-exported via `index.js`.

## State management

- Redux is used for cross-component server-backed state. `session.session_data`, `session.game_data`, `session.premium_game_data` are mirrored from the backend. Updates dispatch through `update_*` reducers in `shared/store/sessionSlice.js`. Stuff in the music folder is an exception. 
- `useState` for local form / UI state — anything that doesn't need to persist or be shared.
- localStorage is used to store Supabase auth stuff, and that's it. Don't use localStorage directly for app data, those always go through the backend, which then goes to Supabase.
- Field-granular reducers are used for updating fields. The whole-object pattern (spread + override) is race-prone for async updates, see `shared/store/README.md`.

## Testing

All tests run on [vitest](https://vitest.dev/). Some tests additionally use `@testing-library/react` for component testing. 

The following commands are used: 
- `npm test` (most common)
- `npm test -- run` 
- `npx vitest list` 
- `npx vitest --ui` 

Tests are co-located next to their respective source files as `*.test.js` / `*.test.jsx`. 

There's no manual manifest — vitest auto-discovers them. 

## Things to maybe explore later

- **Cloudflare** in front of the deployed app — CDN caching, asset optimization, possibly Workers for a thin edge layer. Not urgent; revisit when traffic actually justifies it.
- **Docker** for the dev environment — would let the backend + a local Supabase emulator + the Vite dev server come up with one `docker-compose up` instead of the current "activate venv, run uvicorn, npm start, etc." dance. Mostly an experiment in dev ergonomics; production stays Render + Vercel.
