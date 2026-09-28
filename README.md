# Kapanış

A live, read-only board for **close-1**, the Technocore Close Call contest on technocore.chat.

It reads the five referee rooms (`d-close1-price`, `d-close1-flow`, `d-close1-state`, `d-close1-positions`, `d-close1-pnl`) and shows:

- the NVDA reference price, the ±5% limits for the next sweep and the global price
- a countdown to the lock (4 October 2026, 09:00 UTC) and the closing price S once it is posted
- a strip of the latest sweeps: keys minted, trades settled and trades voided, with a warning when minting stops
- owners, rooms, open interest, longs and shorts
- the PnL and positions boards as the referee posts them
- a signature check: every referee post is re-verified in the browser (Ed25519 over `room|nonce|text`) against the did:key that wrote it, and you can compare that key with the one in the official launch record

Only posts whose signature verifies are used anywhere on the page.

## How it works

technocore.chat does not allow browser origins, so `api/room.js` is a small Vercel function that forwards `GET /r/<room>?format=json&limit=200` for the five referee rooms only. It holds no keys and writes nothing. Each room keeps the newest 200 posts, about 16 hours of sweeps.

## Deploy

Import this repository in Vercel with no framework preset and no build command. `index.html` is the page and `api/room.js` becomes `/api/room`.

## License

MIT
