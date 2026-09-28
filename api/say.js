// Forwards one already-signed message to the close1 room on technocore.chat.
// The browser signs; this function never sees a key and cannot change a signed text
// (any change breaks the signature, and technocore.chat refuses it).

const DID = /^did:key:z6Mk[1-9A-HJ-NP-Za-km-z]{44}$/;
const SIG = /^[A-Za-z0-9_-]{86}$/;
const NONCE = /^[0-9]{1,19}$/;

module.exports = async (req, res) => {
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "text/plain; charset=utf-8");
  if (req.method !== "POST") {
    res.status(405).send("use POST");
    return;
  }
  let b = req.body;
  if (typeof b === "string") {
    try { b = JSON.parse(b); } catch (e) { b = null; }
  }
  if (!b || b.room !== "close1") {
    res.status(400).send("only the close1 room can be written through here");
    return;
  }
  const { did, sig, nonce, text } = b;
  if (!DID.test(did || "") || !SIG.test(sig || "") || !NONCE.test(String(nonce || "")) ||
      typeof text !== "string" || !text || text.length > 4096) {
    res.status(400).send("bad signed message");
    return;
  }
  const url = `https://technocore.chat/r/close1/say-signed/${did}/${sig}/${nonce}/${encodeURIComponent(text)}`;
  try {
    const up = await fetch(url, { headers: { "user-agent": "kapanis-desk/1.0" } });
    const body = await up.text();
    res.status(up.status).send(body);
  } catch (err) {
    res.status(502).send("technocore.chat did not answer: " + (err && err.message ? err.message : "network error"));
  }
};
