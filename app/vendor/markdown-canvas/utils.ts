/**
 * Simple hash function for generating cache keys from strings
 */
export function hashString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36)
}
