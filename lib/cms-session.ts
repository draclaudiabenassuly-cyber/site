import { supabase } from "./supabase";

export const CMS_SESSION_COOKIE = "claudia_cms_session";
export const DEFAULT_CMS_EMAIL = "admin@admin.com";
export const DEFAULT_CMS_PASSWORD = "admin12$";
export const CMS_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type RuntimeEnv = {
  CMS_ADMIN_EMAIL?: string;
  CMS_ADMIN_PASSWORD?: string;
};

export function runtimeEnv(): RuntimeEnv {
  return {
    CMS_ADMIN_EMAIL: process.env.CMS_ADMIN_EMAIL,
    CMS_ADMIN_PASSWORD: process.env.CMS_ADMIN_PASSWORD,
  };
}

export function cmsCredentials(env: RuntimeEnv) {
  return {
    email: (env.CMS_ADMIN_EMAIL ?? DEFAULT_CMS_EMAIL).trim().toLowerCase(),
    password: env.CMS_ADMIN_PASSWORD ?? DEFAULT_CMS_PASSWORD,
  };
}

function cookieToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const value = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${CMS_SESSION_COOKIE}=`));
  return value ? decodeURIComponent(value.slice(CMS_SESSION_COOKIE.length + 1)) : null;
}

export async function getCmsSession(request: Request) {
  const token = cookieToken(request.headers.get("cookie"));
  if (!token) return null;
  const { data, error } = await supabase
    .from("cms_sessions")
    .select("token,email,expires_at")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return { token: data.token, email: data.email, expiresAt: data.expires_at };
}

export async function createCmsSession(email: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + CMS_SESSION_MAX_AGE * 1000).toISOString();
  const { error: deleteError } = await supabase.from("cms_sessions").delete().eq("email", email);
  if (deleteError) throw deleteError;
  const { error } = await supabase.from("cms_sessions").insert({ token, email, expires_at: expiresAt });
  if (error) throw error;
  return token;
}

export async function deleteCmsSession(request: Request) {
  const token = cookieToken(request.headers.get("cookie"));
  if (token) await supabase.from("cms_sessions").delete().eq("token", token);
}

export function sessionCookie(token: string, secure: boolean) {
  return `${CMS_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CMS_SESSION_MAX_AGE}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookie(secure: boolean) {
  return `${CMS_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}
