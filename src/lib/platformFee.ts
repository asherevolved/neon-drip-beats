/**
 * Platform Fee Configuration
 * Centralized configuration for consistent platform fee application
 */

export const PLATFORM_FEE = 20; // Fixed ₹20 platform fee

/**
 * Calculate subtotal from selected tickets
 */
export function calculateSubtotal(tickets: Array<{ price: number; quantity: number }>): number {
  return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
}

/**
 * Calculate total amount including platform fee
 */
export function calculateTotalAmount(subtotal: number): number {
  return subtotal + PLATFORM_FEE;
}

/**
 * Calculate total from tickets with platform fee
 */
export function calculateTotalFromTickets(tickets: Array<{ price: number; quantity: number }>): number {
  const subtotal = calculateSubtotal(tickets);
  return calculateTotalAmount(subtotal);
}