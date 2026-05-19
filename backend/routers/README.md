# Routers

FastAPI route handlers, one file per feature. All are mounted from `main.py`.

For the project-wide bug ledger see [`../BUG_LOG.md`](../BUG_LOG.md). The
table below is a router-local index of past races / state bugs so anyone
browsing this folder spots the gotcha before re-introducing it.

## Past incidents

- **2026-05-18 — `auction_house.py:cancel_listing` TOCTOU race.** 30 parallel
  cancels each refunded the same listing once (token duplication). Fixed by
  collapsing existence + ownership + delete into a single conditional
  `DELETE FROM Auction_House WHERE id = $1 AND seller_username = $2 RETURNING *`,
  so Postgres's row-level lock serializes the cancels and only the first
  returns a row. The other 29 see empty `.data` and noop without refunding.
  Full write-up in [`../BUG_LOG.md`](../BUG_LOG.md#2026-05-18--auction-cancel-refund-duplication-toctou-race).

- **`auction_house.py:buy_listing` — same race shape, NOT YET FIXED.** Two
  concurrent buyers can both pass the existence / not-own-listing checks,
  both spend their currency, both get credited the item, both attempt the
  DELETE (the second one noops). Net effect: one listing pays out twice on
  the buyer side. Fix is similar in shape to the cancel fix but bigger
  because of the buyer-pays-then-receives sequence (rollback needed if the
  atomic claim loses). Tracked in [`../BUG_LOG.md`](../BUG_LOG.md).

- **2026-05-09 — `tokens.py` lost-update race** on simultaneous
  daily/hourly/fivemin checkins. Different shape (read-modify-write on a
  JSON column, not check-then-act) — fixed via per-user `threading.Lock`
  in `tokens.py` since the app runs single-instance. Full write-up in
  `../BUG_LOG.md`.
