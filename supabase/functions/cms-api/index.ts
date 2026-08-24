import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const DEFAULT_EMAIL = "admin@admin.com";
const DEFAULT_PASSWORD = "admin12$";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const MAX_CONTENT = 1_800_000;
const MAX_IMAGE_DATA = 900_000;
const DEFAULT_SIGNUP_RECIPIENT = "draclaudiabenassuly@gmail.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, x-cms-session, content-type", "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS", "cache-control": "no-store, no-cache, must-revalidate, max-age=0", pragma: "no-cache", expires: "0" };

function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8" } }); }
function credentials() { return { email: (Deno.env.get("CMS_ADMIN_EMAIL") ?? DEFAULT_EMAIL).trim().toLowerCase(), password: Deno.env.get("CMS_ADMIN_PASSWORD") ?? DEFAULT_PASSWORD }; }
function imageValue(value: unknown, label: string) { const text = String(value ?? ""); if (text.length > MAX_IMAGE_DATA) throw new Error(`A imagem de ${label} é grande demais. Reduza para até 1536 px de largura.`); return text; }

async function payload() {
  const [c, a, n, albums, photos] = await Promise.all([
    supabase.from("cms_content").select("key,value").order("key"),
    supabase.from("agenda_events").select("id,date,day,month,title,location,detail,tone").order("sort_order").order("date"),
    supabase.from("news_posts").select("id,category,title,excerpt,read_time,image,published_at").order("published_at", { ascending: false }).order("sort_order"),
    supabase.from("gallery_albums").select("id,title,slug,description,cover,published_at,featured,sort_order").order("featured", { ascending: false }).order("sort_order").order("published_at", { ascending: false }),
    supabase.from("gallery_photos").select("id,album_id,title,caption,image,alt,published_at,featured_on_home,sort_order").order("featured_on_home", { ascending: false }).order("published_at", { ascending: false }).order("sort_order"),
  ]);
  if (c.error || a.error || n.error) throw c.error ?? a.error ?? n.error;
  const values: Record<string, string> = {};
  for (const row of c.data ?? []) values[row.key] = row.value;
  return { content: values, agenda: a.data ?? [], news: (n.data ?? []).map((x) => ({ ...x, readTime: x.read_time, publishedAt: x.published_at })), albums: albums.error ? [] : (albums.data ?? []).map((x) => ({ ...x, publishedAt: x.published_at, sortOrder: x.sort_order })), photos: photos.error ? [] : (photos.data ?? []).map((x) => ({ ...x, albumId: x.album_id, publishedAt: x.published_at, featuredOnHome: x.featured_on_home, sortOrder: x.sort_order })) };
}

async function session(req: Request) {
  const token = req.headers.get("x-cms-session");
  if (!token) return null;
  const { data } = await supabase.from("cms_sessions").select("token,email,expires_at").eq("token", token).gt("expires_at", new Date().toISOString()).maybeSingle();
  return data ?? null;
}

async function saveGalleryAlbum(item: Record<string, unknown>, id?: string) {
  const row = { title: String(item.title ?? ""), slug: String(item.slug ?? ""), description: String(item.description ?? ""), cover: imageValue(item.cover, "da capa"), published_at: String(item.publishedAt ?? ""), featured: Boolean(item.featured), sort_order: Number(item.sortOrder ?? Date.now()), updated_at: new Date().toISOString() };
  const query = id ? supabase.from("gallery_albums").update(row).eq("id", id) : supabase.from("gallery_albums").insert({ id: String(item.id || crypto.randomUUID()), ...row });
  const { error } = await query;
  if (error) throw error;
}

async function saveGalleryPhoto(item: Record<string, unknown>, id?: string) {
  const row = { album_id: String(item.albumId ?? ""), title: String(item.title ?? ""), caption: String(item.caption ?? ""), image: imageValue(item.image, "da galeria"), alt: String(item.alt ?? item.title ?? ""), published_at: String(item.publishedAt ?? ""), featured_on_home: Boolean(item.featuredOnHome), sort_order: Number(item.sortOrder ?? Date.now()), updated_at: new Date().toISOString() };
  const query = id ? supabase.from("gallery_photos").update(row).eq("id", id) : supabase.from("gallery_photos").insert({ id: String(item.id || crypto.randomUUID()), ...row });
  const { error } = await query;
  if (error) throw error;
}

function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function escapeHtml(value: string) { return value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[character] ?? character); }

async function signupRecipient() {
  const { data } = await supabase.from("cms_content").select("value").eq("key", "signupRecipientEmail").maybeSingle();
  const value = String(data?.value ?? DEFAULT_SIGNUP_RECIPIENT).trim().toLowerCase();
  return validEmail(value) ? value : DEFAULT_SIGNUP_RECIPIENT;
}

async function sendSignupEmail(recipient: string, email: string, test = false) {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim();
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY nao configurada" };
  const from = Deno.env.get("RESEND_FROM_EMAIL")?.trim();
  if (!from || !validEmail(from)) return { sent: false, reason: "RESEND_FROM_EMAIL nao configurado" };
  const subject = test ? "Teste de e-mail do site da campanha" : "Novo cadastro no site da campanha";
  const html = test
    ? "<p>Este e um e-mail de teste do formulario de participacao.</p><p>O recebimento esta configurado para este endereco.</p>"
    : `<p>Um novo e-mail foi cadastrado no site da campanha:</p><p><strong>${escapeHtml(email)}</strong></p>`;
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to: [recipient], subject, html }),
    });
    if (!response.ok) return { sent: false, reason: `Resend retornou HTTP ${response.status}` };
    return { sent: true };
  } catch {
    return { sent: false, reason: "Nao foi possivel conectar ao servico de e-mail" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  try {
    const url = new URL(req.url);
    const body = req.method === "GET" || req.method === "DELETE" ? {} : await req.json();
    const action = body.action ?? url.searchParams.get("action") ?? "read";
    if (action === "login") {
      const c = credentials();
      if (String(body.email ?? "").trim().toLowerCase() !== c.email || body.password !== c.password) return json({ error: "E-mail ou senha inválidos." }, 401);
      await supabase.from("cms_sessions").delete().eq("email", c.email);
      const token = crypto.randomUUID();
      const expires_at = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
      const { error } = await supabase.from("cms_sessions").insert({ token, email: c.email, expires_at });
      if (error) throw error;
      return json({ ok: true, email: c.email, token });
    }
    if (action === "logout") {
      const token = req.headers.get("x-cms-session");
      if (token) await supabase.from("cms_sessions").delete().eq("token", token);
      return json({ ok: true });
    }
    if (action === "signup") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!validEmail(email)) return json({ error: "Informe um e-mail valido." }, 400);
      const { error } = await supabase.from("campaign_signups").upsert({ email }, { onConflict: "email" });
      if (error) throw error;
      const recipient = await signupRecipient();
      const notification = await sendSignupEmail(recipient, email);
      return json({ ok: true, emailSent: notification.sent, emailRecipient: recipient });
    }
    if (action === "email_test") {
      const activeSession = await session(req);
      if (!activeSession) return json({ error: "Acesso restrito ao gestor do site." }, 403);
      const recipient = await signupRecipient();
      const notification = await sendSignupEmail(recipient, recipient, true);
      if (!notification.sent) return json({ error: notification.reason ?? "Envio de e-mail nao configurado.", emailRecipient: recipient }, 503);
      return json({ ok: true, emailSent: true, emailRecipient: recipient });
    }
    if (req.method === "GET" || action === "read") {
      const data = await payload();
      const activeSession = await session(req);
      return json(activeSession ? { ...data, email: activeSession.email } : data);
    }
    const activeSession = await session(req);
    if (!activeSession) return json({ error: "Acesso restrito ao gestor do site." }, 403);
    const item = body.item ?? {};
    if (action === "create") {
      if (body.resource === "agenda") { const { error } = await supabase.from("agenda_events").insert({ id: item.id || crypto.randomUUID(), date: item.date, day: item.day, month: item.month, title: item.title, location: item.location, detail: item.detail, tone: item.tone, sort_order: Date.now() }); if (error) throw error; }
      else if (body.resource === "news") { const { error } = await supabase.from("news_posts").insert({ id: item.id || crypto.randomUUID(), category: item.category, title: item.title, excerpt: item.excerpt, read_time: item.readTime, image: imageValue(item.image, "da notícia"), published_at: item.publishedAt ?? new Date().toISOString().slice(0, 10), sort_order: Date.now() }); if (error) throw error; }
      else if (body.resource === "gallery-album") await saveGalleryAlbum(item);
      else if (body.resource === "gallery-photo") await saveGalleryPhoto(item);
      else throw new Error("Recurso inválido.");
    } else if (action === "update") {
      if (body.resource === "agenda" && body.id) { const { error } = await supabase.from("agenda_events").update({ date: item.date, day: item.day, month: item.month, title: item.title, location: item.location, detail: item.detail, tone: item.tone, updated_at: new Date().toISOString() }).eq("id", body.id); if (error) throw error; }
      else if (body.resource === "news" && body.id) { const { error } = await supabase.from("news_posts").update({ category: item.category, title: item.title, excerpt: item.excerpt, read_time: item.readTime, image: imageValue(item.image, "da notícia"), published_at: item.publishedAt ?? "", updated_at: new Date().toISOString() }).eq("id", body.id); if (error) throw error; }
      else if (body.resource === "gallery-album" && body.id) await saveGalleryAlbum(item, body.id);
      else if (body.resource === "gallery-photo" && body.id) await saveGalleryPhoto(item, body.id);
      else if (body.resource === "content" && body.key) { if (typeof body.value !== "string" || body.value.length > MAX_CONTENT) return json({ error: "Conteúdo inválido ou grande demais." }, 400); if (String(body.key).toLowerCase().includes("image") || String(body.key).toLowerCase().includes("logo")) imageValue(body.value, "do site"); const { error } = await supabase.from("cms_content").upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() }); if (error) throw error; }
      else throw new Error("Dados insuficientes para atualização.");
    } else if (action === "delete") {
      const table = body.resource === "agenda" ? "agenda_events" : body.resource === "news" ? "news_posts" : body.resource === "content" ? "cms_content" : body.resource === "gallery-album" ? "gallery_albums" : body.resource === "gallery-photo" ? "gallery_photos" : null;
      if (!table || !body.id) throw new Error("Dados insuficientes para exclusão.");
      const column = body.resource === "content" ? "key" : "id";
      const { error } = await supabase.from(table).delete().eq(column, body.id);
      if (error) throw error;
    } else throw new Error("Ação inválida.");
    return json(await payload());
  } catch (error) {
    console.error(error);
    return json({ content: {}, agenda: [], news: [], albums: [], photos: [], error: error instanceof Error ? error.message : "Erro interno." }, 500);
  }
});
