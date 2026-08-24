import { getChatGPTUser } from "../../chatgpt-auth";
import { isCmsAdmin } from "../../../lib/cms-auth";
import { defaultAgenda, defaultContent, defaultNews, type GalleryAlbum, type GalleryPhoto } from "../../../lib/cms-defaults";
import { CMS_SESSION_COOKIE } from "../../../lib/cms-session";

export const dynamic = "force-dynamic";

// CMS content must never be served from an intermediary cache. A content edit
// is expected to appear on the public site immediately after it is confirmed.
const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
  pragma: "no-cache",
  expires: "0",
  vary: "Cookie",
};
const SUPABASE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";
const ALBUM_INDEX_KEY = "galleryAlbumsIndex";
const PHOTO_INDEX_KEY = "galleryPhotosIndex";
type CmsRecord = Record<string, unknown>;

function cookieToken(request: Request) {
  const header = request.headers.get("cookie");
  const value = header?.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${CMS_SESSION_COOKIE}=`));
  return value ? decodeURIComponent(value.slice(CMS_SESSION_COOKIE.length + 1)) : null;
}

async function callCms(request: Request, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("apikey", SUPABASE_KEY);
  headers.set("authorization", `Bearer ${SUPABASE_KEY}`);
  headers.set("cache-control", "no-store, no-cache, max-age=0");
  const token = cookieToken(request);
  if (token) headers.set("x-cms-session", token);
  return fetch(SUPABASE_FUNCTION_URL, { ...init, headers, cache: "no-store" });
}

function fallbackPayload() {
  return { content: defaultContent, agenda: defaultAgenda, news: defaultNews, albums: [], photos: [] };
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function storedCollection<T extends { id: string }>(content: Record<string, string>, indexKey: string, itemPrefix: string) {
  const ids = parseJson<string[]>(content[indexKey], []);
  return ids.map((id) => parseJson<T | null>(content[`${itemPrefix}${id}`], null)).filter((item): item is T => Boolean(item));
}

function normalizePayload(raw: CmsRecord) {
  const sourceContent = raw.content && typeof raw.content === "object" ? raw.content as Record<string, string> : {};
  const content = { ...defaultContent, ...sourceContent } as Record<string, string>;
  const rawAlbums = Array.isArray(raw.albums) ? raw.albums : [];
  const rawPhotos = Array.isArray(raw.photos) ? raw.photos : [];
  const directAlbums = rawAlbums.length ? rawAlbums as GalleryAlbum[] : null;
  const directPhotos = rawPhotos.length ? rawPhotos as GalleryPhoto[] : null;
  const albums = directAlbums ?? storedCollection<GalleryAlbum>(content, ALBUM_INDEX_KEY, "galleryAlbum:");
  const photos = directPhotos ?? storedCollection<GalleryPhoto>(content, PHOTO_INDEX_KEY, "galleryPhoto:");
  return {
    ...raw,
    content,
    albums: albums.length ? albums : parseJson<GalleryAlbum[]>(content.galleryAlbumsJson, []),
    photos: photos.length ? photos : parseJson<GalleryPhoto[]>(content.galleryPhotosJson, []),
  };
}

export async function GET(request: Request) {
  try {
    const response = await callCms(request);
    const raw = await response.text();
    if (!response.ok) return Response.json({ ...fallbackPayload(), isAdmin: false, error: raw }, { status: response.status, headers: jsonHeaders });
    const payload = JSON.parse(raw) as CmsRecord;
    const user = await getChatGPTUser();
    const adminEmail = typeof payload.email === "string" ? payload.email : user?.email;
    const configured = process.env.CMS_ADMIN_EMAILS;
    const isAdmin = Boolean(payload.email) || Boolean(user && isCmsAdmin(user.email, configured));
    if (new URL(request.url).searchParams.get("download") === "1") {
      if (!isAdmin) return Response.json({ error: "Acesso restrito ao gestor do site." }, { status: 403, headers: jsonHeaders });
      return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), ...payload }, null, 2), {
        headers: { ...jsonHeaders, "content-disposition": 'attachment; filename="claudia-benassuly-cms-backup.json"' },
      });
    }
    const normalized = normalizePayload(payload);
    // Return the exact persisted values. Rewriting fields during a read made an
    // editor appear successful even when the public page received a different
    // value from the one just saved.
    return Response.json({ ...normalized, isAdmin, adminEmail }, { headers: jsonHeaders });
  } catch (error) {
    console.error("CMS GET failed", error);
    return Response.json({ ...fallbackPayload(), isAdmin: false, error: "Não foi possível carregar o conteúdo do CMS." }, { status: 500, headers: jsonHeaders });
  }
}

async function mutate(request: Request, defaultAction: string) {
  const body = await request.json();
  if (body.resource === "gallery-album" || body.resource === "gallery-photo") return mutateGallery(request, body, defaultAction);
  const specialActions = new Set(["profile", "admin_create", "admin_delete", "email_test"]);
  const action = specialActions.has(body.action) ? body.action : defaultAction;
  const response = await callCms(request, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, action }) });
  const raw = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { payload = { error: raw }; }
  return Response.json(normalizePayload(payload as CmsRecord), { status: response.status, headers: jsonHeaders });
}

async function readCmsPayload(request: Request) {
  const response = await callCms(request, { cache: "no-store" });
  const raw = await response.text();
  let payload: CmsRecord;
  try { payload = JSON.parse(raw) as CmsRecord; } catch { payload = { error: raw }; }
  if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Não foi possível carregar a galeria.");
  return normalizePayload(payload);
}

async function writeContent(request: Request, key: string, value: string) {
  const response = await callCms(request, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "update", resource: "content", key, value }) });
  const raw = await response.text();
  let payload: CmsRecord;
  try { payload = JSON.parse(raw) as CmsRecord; } catch { payload = { error: raw }; }
  if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "Não foi possível salvar a imagem.");
  return payload;
}

async function persistCollection(request: Request, collection: "album" | "photo", items: Array<GalleryAlbum | GalleryPhoto>) {
  const prefix = collection === "album" ? "galleryAlbum:" : "galleryPhoto:";
  const indexKey = collection === "album" ? ALBUM_INDEX_KEY : PHOTO_INDEX_KEY;
  let result: CmsRecord = {};
  for (const item of items) result = await writeContent(request, `${prefix}${item.id}`, JSON.stringify(item));
  result = await writeContent(request, indexKey, JSON.stringify(items.map((item) => item.id)));
  return result;
}

async function mutateGallery(request: Request, body: CmsRecord, defaultAction: string) {
  try {
    const current = await readCmsPayload(request);
    const collection = body.resource === "gallery-album" ? "album" : "photo";
    const list = collection === "album" ? [...current.albums] : [...current.photos];
    const item = { ...(body.item ?? {}) } as GalleryAlbum | GalleryPhoto;
    const editing = defaultAction === "update";
    const id = String(body.id ?? item.id ?? crypto.randomUUID());
    const nextItem = { ...item, id } as GalleryAlbum | GalleryPhoto;
    const index = list.findIndex((entry) => entry.id === id);
    if (editing && index < 0) return Response.json({ error: "Registro da galeria não encontrado." }, { status: 404, headers: jsonHeaders });
    if (editing) list[index] = nextItem;
    else list.unshift(nextItem);
    const saved = await persistCollection(request, collection, list);
    const normalized = normalizePayload(saved);
    return Response.json({ ...normalized, albums: collection === "album" ? list : normalized.albums, photos: collection === "photo" ? list : normalized.photos }, { headers: jsonHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível salvar a galeria." }, { status: 500, headers: jsonHeaders });
  }
}

async function deleteGallery(request: Request, resource: string, id: string | null) {
  if (!id) return Response.json({ error: "Registro da galeria não informado." }, { status: 400, headers: jsonHeaders });
  try {
    const current = await readCmsPayload(request);
    const collection = resource === "gallery-album" ? "album" : "photo";
    const list = collection === "album" ? current.albums.filter((entry) => entry.id !== id) : current.photos.filter((entry) => entry.id !== id);
    const saved = await persistCollection(request, collection, list);
    const normalized = normalizePayload(saved);
    return Response.json({ ...normalized, albums: collection === "album" ? list : normalized.albums, photos: collection === "photo" ? list : normalized.photos }, { headers: jsonHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível excluir o registro." }, { status: 500, headers: jsonHeaders });
  }
}

export async function POST(request: Request) { return mutate(request, "create"); }
export async function PUT(request: Request) { return mutate(request, "update"); }
export async function DELETE(request: Request) {
  const params = new URL(request.url).searchParams;
  const resource = params.get("resource");
  if (resource === "gallery-album" || resource === "gallery-photo") return deleteGallery(request, resource, params.get("id"));
  const response = await callCms(request, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "delete", resource: params.get("resource"), id: params.get("id") }),
  });
  const raw = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { payload = { error: raw }; }
  return Response.json(normalizePayload(payload as CmsRecord), { status: response.status, headers: jsonHeaders });
}
