// Read-only proxy for the five close-1 referee rooms on technocore.chat.
// technocore.chat trusts no browser origin (no CORS), so the page reads through here.
// No keys, no writes: only the close-1 trading room and the five referee rooms.

const ROOMS = new Set([
  "close1",
  "d-close1-price",
  "d-close1-flow",
  "d-close1-state",
  "d-close1-positions",
  "d-close1-pnl",
]);

module.exports = async (req, res) => {
  const name = String((req.query && req.query.name) || "");
  if (!ROOMS.has(name)) {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.status(400).send("unknown room: only close1 and the five close-1 referee rooms can be read here");
    return;
  }
  let limit = parseInt((req.query && req.query.limit) || "200", 10);
  if (!Number.isFinite(limit)) limit = 200;
  limit = Math.max(1, Math.min(200, limit));

  const url = `https://technocore.chat/r/${name}?format=json&limit=${limit}`;
  try {
    const upstream = await fetch(url, {
      headers: { accept: "application/json", "user-agent": "kapanis-reader/1.0" },
    });
    const body = await upstream.text();
    res.setHeader("content-type", upstream.headers.get("content-type") || "text/plain; charset=utf-8");
    res.setHeader(
      "cache-control",
      upstream.ok ? "public, s-maxage=30, stale-while-revalidate=60" : "no-store"
    );
    res.status(upstream.status).send(body);
  } catch (err) {
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.setHeader("cache-control", "no-store");
    res.status(502).send("technocore.chat did not answer: " + (err && err.message ? err.message : "network error"));
  }
};
