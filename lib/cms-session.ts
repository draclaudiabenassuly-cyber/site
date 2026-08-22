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

export function sessionCookie(token: string, secure: boolean) {
  return `${CMS_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CMS_SESSION_MAX_AGE}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookie(secure: boolean) {
  return `${CMS_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}
