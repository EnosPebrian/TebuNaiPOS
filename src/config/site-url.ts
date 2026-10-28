/** Canonical origin is optional in development; never invent a production domain. */
export function parseSiteUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export const siteUrl = parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
