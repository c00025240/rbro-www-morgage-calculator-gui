export function formatRoNumber(
  value: number | null | undefined,
  decimals: number = 2,
  suffix?: string
): string {
  if (value === null || value === undefined || isNaN(value)) {
    const fallback = '0' + (decimals > 0 ? ',' + '0'.repeat(decimals) : '');
    return suffix ? `${fallback} ${suffix}` : fallback;
  }
  const formatted = new Intl.NumberFormat('ro-RO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
  return suffix ? `${formatted} ${suffix}` : formatted;
}
