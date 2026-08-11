export function getSectionInitials(name: string, maxLetters = 2): string {
  return name
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z]/g, '').charAt(0))
    .filter(Boolean)
    .slice(0, maxLetters)
    .join('')
    .toUpperCase();
}
