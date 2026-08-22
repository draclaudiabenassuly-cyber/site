import { getChatGPTUser } from "../../chatgpt-auth";
import { isCmsAdmin } from "../../../lib/cms-auth";
import { defaultAgenda, defaultContent, defaultNews } from "../../../lib/cms-defaults";
import { CMS_SESSION_COOKIE } from "../../../lib/cms-session";

export const dynamic = "force-dynamic";

const jsonHeaders = { "content-type": "application/json; charset=utf-8" };
const SUPABASE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";

function cookieToken(request: Request) {
  const header = request.headers.get("cookie");
  const value = header?.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${CMS_SESSION_COOKIE}=`));
  return value ? decodeURIComponent(value.slice(CMS_SESSION_COOKIE.length + 1)) : null;
}

async function callCms(request: Request, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("apikey", SUPABASE_KEY);
  headers.set("authorization", `Bearer ${SUPABASE_KEY}`);
  const token = cookieToken(request);
  if (token) headers.set("x-cms-session", token);
  return fetch(SUPABASE_FUNCTION_URL, { ...init, headers, cache: "no-store" });
}

function fallbackPayload() {
  return { content: defaultContent, agenda: defaultAgenda, news: defaultNews };
}

export async function GET(request: Request) {
  try {
    const response = await callCms(request);
    const raw = await response.text();
    if (!response.ok) return Response.json({ ...fallbackPayload(), isAdmin: false, error: raw }, { status: response.status, headers: jsonHeaders });
    const payload = JSON.parse(raw);
    const user = await getChatGPTUser();
    const adminEmail = payload.email ?? user?.email;
    const configured = process.env.CMS_ADMIN_EMAILS;
    const isAdmin = Boolean(payload.email) || Boolean(user && isCmsAdmin(user.email, configured));
    if (new URL(request.url).searchParams.get("download") === "1") {
      if (!isAdmin) return Response.json({ error: "Acesso restrito ao gestor do site." }, { status: 403, headers: jsonHeaders });
      return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), ...payload }, null, 2), {
        headers: { ...jsonHeaders, "content-disposition": 'attachment; filename="claudia-benassuly-cms-backup.json"' },
      });
    }
    return Response.json({ ...payload, isAdmin, adminEmail }, { headers: jsonHeaders });
  } catch (error) {
    console.error("CMS GET failed", error);
    return Response.json({ ...fallbackPayload(), isAdmin: false, error: "Não foi possível carregar o conteúdo do CMS." }, { status: 500, headers: jsonHeaders });
  }
}

async function mutate(request: Request, action: string) {
  const body = await request.json();
  const response = await callCms(request, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, action }) });
  const raw = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { payload = { error: raw }; }
  return Response.json(payload, { status: response.status, headers: jsonHeaders });
}

export async function POST(request: Request) { return mutate(request, "create"); }
export async function PUT(request: Request) { return mutate(request, "update"); }
export async function DELETE(request: Request) {
  const params = new URL(request.url).searchParams;
  const response = await callCms(request, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "delete", resource: params.get("resource"), id: params.get("id") }),
  });
  const raw = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { payload = { error: raw }; }
  return Response.json(payload, { status: response.status, headers: jsonHeaders });
}
