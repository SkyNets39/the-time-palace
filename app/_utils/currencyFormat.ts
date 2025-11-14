// src/app/_utils/currency.ts

/**
 * Format a number into US Dollar currency format
 * @param amount number to format
 * @returns string formatted as USD (e.g. $1,234.56)
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0, // no decimals if not needed
    maximumFractionDigits: 2, // show cents only if they exist
  }).format(amount);
}
