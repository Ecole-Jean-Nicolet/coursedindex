// Reçoit et renvoie les résultats de la course de 30 foulées, regroupés par code de classe.
// Stockage : Netlify Blobs, une entrée par téléphone (clé = CLASSE/identifiant).
import { getStore } from "@netlify/blobs";

const CLASSE = /^[A-Z0-9-]{1,20}$/;
const ID = /^[A-Za-z0-9]{6,40}$/;
const STRIDES = 30;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export function validTaps(taps) {
  if (!Array.isArray(taps) || taps.length < 1 || taps.length > STRIDES) return false;
  let prev = -1;
  for (const t of taps) {
    if (typeof t !== "number" || !Number.isFinite(t) || t < 0 || t > 15000 || t < prev) return false;
    prev = t;
  }
  return true;
}

export async function handle(req, store) {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const classe = (url.searchParams.get("classe") || "").toUpperCase();
    if (!CLASSE.test(classe)) return json({ error: "Code de classe invalide." }, 400);
    const { blobs } = await store.list({ prefix: classe + "/" });
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return json({ results: items.filter(Boolean) });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return json({ error: "Données illisibles." }, 400); }
    const classe = String(body.classe || "").toUpperCase();
    const id = String(body.id || "");
    const name = String(body.name || "").trim().slice(0, 30);
    const taps = body.taps;
    if (!CLASSE.test(classe) || !ID.test(id) || !name || !validTaps(taps)) return json({ error: "Résultat invalide." }, 400);
    const rec = { id, name, taps: taps.map((t) => Math.round(t)), at: Date.now() };
    await store.setJSON(classe + "/" + id, rec);
    return json({ ok: true });
  }

  if (req.method === "DELETE") {
    const classe = (url.searchParams.get("classe") || "").toUpperCase();
    const id = url.searchParams.get("id");
    if (!CLASSE.test(classe)) return json({ error: "Code de classe invalide." }, 400);
    if (id) {
      if (!ID.test(id)) return json({ error: "Coureur invalide." }, 400);
      await store.delete(classe + "/" + id);
    } else {
      const { blobs } = await store.list({ prefix: classe + "/" });
      await Promise.all(blobs.map((b) => store.delete(b.key)));
    }
    return json({ ok: true });
  }

  return json({ error: "Méthode non permise." }, 405);
}

export default async (req) => handle(req, getStore({ name: "course-30-foulees", consistency: "strong" }));

export const config = { path: "/api/resultats" };
