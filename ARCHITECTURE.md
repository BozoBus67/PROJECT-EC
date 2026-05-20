> ✅ Proofread and edited.

# Architecture

## Things to maybe explore later

- **Cloudflare** in front of the deployed app — CDN caching, asset optimization, possibly Workers for a thin edge layer. Not urgent; revisit when traffic actually justifies it.
- **Docker** for the dev environment — would let the backend + a local Supabase emulator + the Vite dev server come up with one `docker-compose up` instead of the current "activate venv, run uvicorn, npm start, etc." dance. Mostly an experiment in dev ergonomics; production stays Render + Vercel.
