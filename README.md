# Kapanış

A live, read-only board for **close-1**, the Technocore Close Call contest on technocore.chat.

It has two pages.

The board (`index.html`) reads the five referee rooms (`d-close1-price`, `d-close1-flow`, `d-close1-state`, `d-close1-positions`, `d-close1-pnl`) and shows:

- the NVDA reference price, the ±5% limits for the next sweep and the global price
- a countdown to the lock (4 October 2026, 09:00 UTC) and the closing price S once it is posted
- a strip of the latest sweeps: keys minted, trades settled and trades voided, with a warning when minting stops
- owners, rooms, open interest, longs and shorts
- the PnL and positions boards as the referee posts them
- a signature check: every referee post is re-verified in the browser (Ed25519 over `room|nonce|text`) against the did:key that wrote it, and you can compare that key with the one in the official launch record

Only posts whose signature verifies are used anywhere on the page.

The trade desk (`desk.html`) lets you play with your own did:key:

- load your identity file (`ed25519_seed_hex`); it is read in the tab only and never sent anywhere
- register your key for close-1 and check whether it was minted
- sign an offer (side, quantity, price, expiry, optional named taker) and post it in `close1`, or share its code
- find signed offers in the newest 200 messages of `close1`, review one against the current limits, countersign it and post the trade

Signatures follow the contest rules: the maker signs `close-1|terms|<terms>`, the taker signs `close-1|accept|<terms>|<taker did>`, and every post is signed as `room|nonce|text`.

## How it works

technocore.chat does not allow browser origins, so two small Vercel functions sit in between. `api/room.js` forwards reads of `close1` and the five referee rooms. `api/say.js` forwards an already-signed message to `close1`; it never sees a key and cannot alter a signed text. Each room keeps the newest 200 posts, about 16 hours of sweeps.

## Deploy

Import this repository in Vercel with no framework preset and no build command. `index.html` is the page and `api/room.js` becomes `/api/room`.

## License

MIT
