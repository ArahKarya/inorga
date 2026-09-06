/** FNV-1a 32-bit → 8 heksa. Cukup untuk sidik verifikasi demo, bukan tanda tangan digital. */
export function hashSertifikat(
  nomor: string,
  atletId: string,
  eventId: string,
): string {
  let h = 0x811c9dc5;
  for (const ch of `${nomor}|${atletId}|${eventId}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0").toUpperCase();
}

/** `KORMI/SS/2026/05/0412` ⇄ `KORMI-SS-2026-05-0412` — garis miring tidak bisa jadi segmen rute. */
export const nomorKeSlug = (nomor: string): string =>
  nomor.replaceAll("/", "-");
export const slugKeNomor = (slug: string): string =>
  decodeURIComponent(slug).replaceAll("-", "/");
