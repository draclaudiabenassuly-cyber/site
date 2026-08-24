export const dynamic = "force-dynamic";

const SUPABASE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ action: "signup", email: body.email }),
      cache: "no-store",
    });
    const raw = await response.text();
    return new Response(raw, { status: response.status, headers: { "content-type": "application/json; charset=utf-8" } });
  } catch {
    return Response.json({ error: "Não foi possível registrar o e-mail." }, { status: 400 });
  }
}
