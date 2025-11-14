// app/_utils/searchUtils.ts

/**
 * Normalize search query untuk URL dan database matching
 * Input: "Vacheron Constantine" atau "vacheron constantine"
 * Output: "vacheron-constantine"
 */
export function normalizeSearchQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/[^\w-]+/g, "") // remove special chars
    .replace(/-+/g, "-") // multiple dashes → single
    .replace(/^-|-$/g, ""); // remove leading/trailing dash
}

/**
 * Format untuk display di UI
 * Input: "vacheron-constantine"
 * Output: "Vacheron Constantine"
 */
export function formatDisplayName(slug: string): string {
  if (!slug) return "";

  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate flexible search patterns untuk database
 * Ini handle case: user search "vacheron constantine"
 * tapi di DB tersimpan sebagai "vacheron-constantine"
 */
export function createSearchPattern(query: string): string {
  // Replace spaces dengan wildcard untuk flexible matching
  return query.toLowerCase().trim().replace(/\s+/g, "%"); // "vacheron constantine" → "vacheron%constantine"
}
