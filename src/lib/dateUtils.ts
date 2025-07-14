export function getPreviousYears(count: number): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => currentYear - count + 1 + i);
  }
  