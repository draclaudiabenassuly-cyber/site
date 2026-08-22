import { CMS_SESSION_COOKIE, CMS_SESSION_MAX_AGE } from "../../../../lib/cms-session";

export const dynamic = "force-dynamic";

const SUPABASE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(SUPABASE_FUNCTION_URL, {
    method: "POST",
    headers: { "content-type": "application/json", apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}` },
    body: JSON.stringify({ action: "login", email: body.email, password: body.password }),
    cache: "no-store",
  });
  const raw = await response.text();
  if (!response.ok) return new Response(raw, { status: response.status, headers: { "content-type": "application/json; charset=utf-8" } });
  const result = JSON.parse(raw) as { token: string; email: string };
  const secure = new URL(request.url).protocol === "https:";
  const cookie = `${CMS_SESSION_COOKIE}=${encodeURIComponent(result.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CMS_SESSION_MAX_AGE}${secure ? "; Secure" : ""}`;
  return Response.json({ ok: true, email: result.email }, { headers: { "set-cookie": cookie } });
}
