/**
 * Format a currency amount according to the specified currency code
 * @param amount Amount in smallest currency unit (e.g., paise for INR, cents for USD)
 * @param currency Currency code (e.g., 'INR', 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Convert from paisa/cents to rupees/dollars
} 