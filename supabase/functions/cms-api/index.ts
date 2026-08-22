import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const DEFAULT_EMAIL = "admin@admin.com";
const DEFAULT_PASSWORD = "admin12$";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const MAX_CONTENT = 1_800_000;
const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-cms-session, content-type",
  "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
};

type Body = { action?: string; email?: string; password?: string; resource?: string; id?: string; item?: any; key?: string; value?: string };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, "content-type": "application/json; charset=utf-8" } });
}

function credentials() {
  return {
    email: (Deno.env.get("CMS_ADMIN_EMAIL") ?? DEFAULT_EMAIL).trim().toLowerCase(),
    password: Deno.env.get("CMS_ADMIN_PASSWORD") ?? DEFAULT_PASSWORD,
  };
}

function fallback() {
  return { content: {}, agenda: [], news: [] };
}

async function payload() {
  const [content, agenda, news] = await Promise.all([
    supabase.from("cms_content").select("key,value").order("key"),
    supabase.from("agenda_events").select("id,date,day,month,title,location,detail,tone").order("sort_order").order("date"),
    supabase.from("news_posts").select("id,category,title,excerpt,read_time,image,published_at").order("published_at", { ascending: false }).order("sort_order"),
  ]);
  if (content.error || agenda.error || news.error) throw content.error ?? agenda.error ?? news.error;
  const values: Record<string,string> = {};
  for (const row of content.data ?? []) values[row.key] = row.value;
  return {
    content: values,
    agenda: agenda.data ?? [],
    news: (news.data ?? []).map((n) => ({ ...n, readTime: n.read_time, publishedAt: n.published_at })),
  };
}

async function adminSession(req: Request) {
  const token = req.headers.get("x-cms-session");
  if (!token) return null;
  const { data } = await supabase.from("cms_sessions").select("token,email,expires_at").eq("token", token).gt("expires_at", new Date().toISOString()).maybeSingle();
  return data ?? null;
}

async function requireAdmin(req: Request) {
  return await adminSession(req);
}

async function ensureSeed() {
  // The versioned seed is applied by the migration/seed workflow. This only
  // verifies that the tables exist and does not overwrite CMS edits.
  const { error } = await supabase.from("cms_content").select("key").limit(1);
  if (error) throw error;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  try {
    const body = (req.method === "GET" || req.method === "DELETE") ? {} : await req.json() as Body;
    const url = new URL(req.url);
    const action = body.action ?? url.searchParams.get("action") ?? "read";

    if (action === "login") {
      const creds = credentials();
      if ((body.email ?? "").trim().toLowerCase() !== creds.email || body.password !== creds.password) return json({ error: "E-mail ou senha inválidos." }, 401);
      await supabase.from("cms_sessions").delete().eq("email", creds.email);
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();
      const { error } = await supabase.from("cms_sessions").insert({ token, email: creds.email, expires_at: expiresAt });
      if (error) throw error;
      return json({ ok: true, email: creds.email, token });
    }

    if (action === "logout") {
      const token = req.headers.get("x-cms-session");
      if (token) await supabase.from("cms_sessions").delete().eq("token", token);
      return json({ ok: true });
    }

    await ensureSeed();
    if (req.method === "GET" || action === "read") {
      return json(await payload());
    }

    const session = await requireAdmin(req);
    if (!session) return json({ error: "Acesso restrito ao gestor do site." }, 403);

    if (action === "create") {
      if (body.resource === "agenda") {
        const item = body.item ?? {};
        const { data, error } = await supabase.from("agenda_events").insert({
          id: item.id || crypto.randomUUID(), date: item.date, day: item.day, month: item.month, title: item.title,
          location: item.location, detail: item.detail, tone: item.tone, sort_order: Date.now(),
        }).select().single();
        if (error) throw error;
      } else if (body.resource === "news") {
        const item = body.item ?? {};
        const { error } = await supabase.from("news_posts").insert({
          id: item.id || crypto.randomUUID(), category: item.category, title: item.title, excerpt: item.excerpt,
          read_time: item.readTime, image: item.image, published_at: item.publishedAt ?? new Date().toISOString().slice(0,10), sort_order: Date.now(),
        });
        if (error) throw error;
      } else throw new Error("Recurso inválido.");
    } else if (action === "update") {
      if (body.resource === "agenda" && body.id) {
        const item = body.item ?? {};
        const { error } = await supabase.from("agenda_events").update({ date:item.date,day:item.day,month:item.month,title:item.title,location:item.location,detail:item.detail,tone:item.tone,updated_at:new Date().toISOString() }).eq("id", body.id);
        if (error) throw error;
      } else if (body.resource === "news" && body.id) {
        const item = body.item ?? {};
        const { error } = await supabase.from("news_posts").update({ category:item.category,title:item.title,excerpt:item.excerpt,read_time:item.readTime,image:item.image,published_at:item.publishedAt ?? "",updated_at:new Date().toISOString() }).eq("id", body.id);
        if (error) throw error;
      } else if (body.resource === "content" && body.key) {
        if (typeof body.value !== "string" || body.value.length > MAX_CONTENT) return json({ error: "Conteúdo inválido ou grande demais." }, 400);
        const { error } = await supabase.from("cms_content").upsert({ key: body.key, value: body.value, updated_at:new Date().toISOString() });
        if (error) throw error;
      } else throw new Error("Dados insuficientes para atualização.");
    } else if (action === "delete") {
      const table = body.resource === "agenda" ? "agenda_events" : body.resource === "news" ? "news_posts" : body.resource === "content" ? "cms_content" : null;
      if (!table || !body.id) throw new Error("Dados insuficientes para exclusão.");
      const column = body.resource === "content" ? "key" : "id";
      const { error } = await supabase.from(table).delete().eq(column, body.id);
      if (error) throw error;
    } else {
      throw new Error("Ação inválida.");
    }
    return json(await payload());
  } catch (error) {
    console.error(error);
    return json({ ...fallback(), error: error instanceof Error ? error.message : "Erro interno." }, 500);
  }
});
