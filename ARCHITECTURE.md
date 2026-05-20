> ✅ Proofread and edited.

# Architecture

## Stack

- **Frontend:** React + Vite + Tailwind. Deployed on Vercel as 3 `VITE_VARIANT`-driven variants (`project-ec` / `extended-cookie-clicker` / `gemstone-clicker`). Also ships as a desktop app via Electron Forge.
- **Backend:** FastAPI (Python) on Render.
- **Data:** Supabase (Postgres + auth).
- **Payments:** Stripe.
- **Analytics:** PostHog.
- **Infra:** Terraform manages Vercel + Render. State lives in `infra/`.

## Things to maybe explore later

- **Cloudflare** in front of the deployed app — CDN caching, asset optimization, possibly Workers for a thin edge layer. Not urgent; revisit when traffic actually justifies it.
- **Docker** for the dev environment — would let the backend + a local Supabase emulator + the Vite dev server come up with one `docker-compose up` instead of the current "activate venv, run uvicorn, npm start, etc." dance. Mostly an experiment in dev ergonomics; production stays Render + Vercel.
