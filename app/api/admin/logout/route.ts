import { CMS_SESSION_COOKIE } from "../../../../lib/cms-session";

export const dynamic = "force-dynamic";

const SUPABASE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const tokenPart = cookie.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${CMS_SESSION_COOKIE}=`));
  const token = tokenPart ? decodeURIComponent(tokenPart.slice(CMS_SESSION_COOKIE.length + 1)) : "";
  if (token) {
    await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}`, "x-cms-session": token },
      body: JSON.stringify({ action: "logout" }),
      cache: "no-store",
    });
  }
  const secure = new URL(request.url).protocol === "https:";
  return Response.json({ ok: true }, { headers: { "set-cookie": `${CMS_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}` } });
}
