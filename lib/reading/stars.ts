export function calculateStars(averageScore: number | null | undefined): number {
  if (averageScore === null || averageScore === undefined || Number.isNaN(averageScore)) return 1;
  if (averageScore >= 90) return 3;
  if (averageScore >= 70) return 2;
  return 1;
}