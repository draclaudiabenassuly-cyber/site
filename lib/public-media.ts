/**
 * Adds a small, deterministic cache key to public CMS media.
 *
 * The CMS stores image data or a public path. When an editor replaces a file
 * at the same path, browsers and the CDN are allowed to keep the previous
 * bytes. The content revision is therefore part of every rendered media URL.
 */
export function publicMediaSrc(value: string, revision = 0) {
  if (!value || value.startsWith("data:") || value.startsWith("blob:") || !revision) return value;
  const separator = value.includes("?") ? "&" : "?";
  return `${value}${separator}cms_revision=${revision}`;
}

export function mediaRevisionFor(values: Array<string | undefined>) {
  const mediaValues = values.filter((value): value is string => Boolean(value)).sort().join("|");
  let hash = 0;
  for (const character of mediaValues) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash) || 1;
}
