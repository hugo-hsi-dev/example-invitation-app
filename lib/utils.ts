/**
 * Generate a unique ticket code in format ABC12345
 * (3 uppercase letters + 5 digits)
 */
export function generateTicketCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  let code = '';

  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate 5 random digits
  for (let i = 0; i < 5; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return code;
}

/**
 * Get price in cents based on ticket type
 */
export function getTicketPrice(type: 'regular' | 'vip'): number {
  return type === 'regular' ? 12000 : 20000;
}

/**
 * Format price from cents to dollars
 */
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
