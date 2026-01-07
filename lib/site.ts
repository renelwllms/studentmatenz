const DEFAULT_SITE_URL = "https://studentmate.edgepoint.co.nz";

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;
  return siteUrl.replace(/\/+$/, "");
}
