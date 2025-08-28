export function formatINR(value: number | string | null | undefined, options?: Intl.NumberFormatOptions) {
  const num = typeof value === 'number' ? value : value ? parseFloat(String(value)) : 0;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, ...options }).format(num);
}

export default formatINR;
