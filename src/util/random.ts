
// Generates a random int in the range [inclusive 0, exclusive max)
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
