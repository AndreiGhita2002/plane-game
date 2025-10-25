
// Generates a random int in the range [inclusive min, exclusive max)
export function getRandomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min));
}