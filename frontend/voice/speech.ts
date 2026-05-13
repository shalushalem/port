export function normalizeTranscript(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}
