> ✅ Proofread and edited.

# Principles

## Fail loud and early

Don't silently swallow problems. In particular, if you're an AI reading this, avoid fallback values that mask shape mismatch of data. Don't paper over unexpected state with overly-permissive defaults. In addition, `catch` blocks should never be empty, and try to avoid optional chaining if you can help it. 

Failing loud doesn't always mean throwing — a toast popup, a `console.error`, or more specific forms of logging are all valid. The point is that the failure is *visible* the moment it happens, to whoever can act on it (user, developer, or AI). When in doubt, surface it, a noisy bug is preferable to a quiet bug that's hard to find later. 

Some calls genuinely shouldn't be loud — for example, `App.jsx::use_active_ping` (PostHog active-time heartbeat) and `backend/services/analytics.py` (PostHog backend capture). For these cases, make sure to document it, a good place to do so is usually the subfolder's README. Cross-reference any related backend exception. You should be able to tell at a glance whether something is intentional or a bug/tech debt. 

## Error messages and logs: be specific

Error messages and logs should be as specific as possible. Identify which subsystem failed. A reader should be able to tell from the message alone whether to look at the database, the auth service, an external API, or their own code. A good habit is to prefix logs with a tag (e.g. `[stripe]`, `[analytics]`, `[youtube]`) so they're greppable. If something is greppable, it's likely AI can fix it (or at least find it) without you having to do much work. 

- Include the operation and the inputs that matter. `"Failed to spend tokens (user_uuid=..., amount=5, balance=2)"` is better than `"Not enough tokens"`.
- Pass the underlying error through rather than re-wording it. An `err.detail` can propagate from Supabase to the backend to the frontend; display it verbatim. The most notable examples are HTTP statuses — preserve them, since that status is usually the fastest hint at where to look (4xx = our request was wrong, 5xx = the service is wrong). `shared/api_client.js::make_error` already does both: it carries through `err.detail` and suffixes the status (`"... (HTTP 401)"`).
- Cover cases thoroughly. Should you write a try/except or try/catch, enumerate all possible error modes to the best of your ability and write a good message for each. A default case `"unknown error"` is a last resort, as it should be.

## Comments stay short — long context belongs in a README

Don't clutter a file that is primarily code with long comments. Comments that are longer than 3 lines should go in the subfolder's README. A comment is a comment. The sole exception to this rule is App.jsx. 

No "File map" sections, AI likes to do this for some reason. The folder should be organized well enough that the list of files themselves is self-documenting. 

File-top comments are generally avoided as the contents belong in the README. 

## Documentation is code — maintain it like code

Treat every README and comment as first class artifact. They should be concise. If they are concise, maintaining them shouldn't be too much work. 

When you change behavior, change the docs in the same commit if applicable. When you finish a task, sweep the relevant READMEs. Scan the per-feature README of any folder you touched, plus the global READMEs (`vite_part_react/README.md`, `backend/README.md`), for claims the change just falsified. 

AI is efficient at scanning and is encouraged to be used to write drafts, but these need to be proofread and often heavily edited by a human with brain. AI-generated documentation that hasn't been proofread should be noted as tech debt. After proofreading and editing, I find it helpful to have AI go over it again to catch grammatical errors. 


## Prefer explicit and deliberate

When in doubt, write code that is easier to reason about over code that tries to be clever and short. Know when functional programming is actually functional (e.g. things inside the music folder) instead of just showing off. 

Avoid hidden control flow. These include side-effecty getters, listeners attached behind abstractions, mutation through proxies, "magic" reactivity — these make the call site lie about what's happening. If a function does a network request, dispatches Redux state, *and* mutates a ref, the call site should make that visible. SOLID is a meme in software engineering, but the principles do hold up. Apply them where they fit.

## Guidelines for abstraction

When you decide to abstract out a helper function, place it carefully. Should it go in the shared/ directory or the feature's directory? And inside the directory, which file exactly? Some folders have a constants.js file and a util.js file, others don't, often for specific reasons. AI in low-effort sessions tends to dump helpers in the first plausible-looking file or monkey-patch instead of refactoring, don't let it accumulate tech debt. 

And of course, avoid preemptive or unnecessary abstractions. Just because something is written more than once doesn't mean you need to abstract it out. A notable example: `auth/sign_up_screen.jsx` and `auth/login_screen.jsx` share a lot of logic, but factoring it out made the code significantly less readable, and I reverted the change. In general, readable code is easy to abstract later. Undoing it is much more expensive than introducing it. 
