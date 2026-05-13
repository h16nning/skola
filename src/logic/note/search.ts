import { Note, NoteType } from "./note";

export function noteMatchesSearch(note: Note<NoteType>, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return true;
  }

  const haystack = getNoteSearchText(note);
  return normalizedQuery
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term) || fuzzyIncludes(haystack, term));
}

export function getNoteSearchText(note: Note<NoteType>) {
  const contentValues = Object.entries(note.content)
    .filter(([key]) => key !== "type")
    .map(([, value]) => (typeof value === "string" ? value : ""))
    .join(" ");

  return normalizeSearchText(`${note.sortField} ${contentValues}`);
}

export function normalizeSearchText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .toLocaleLowerCase()
    .trim();
}

function fuzzyIncludes(haystack: string, needle: string) {
  let needleIndex = 0;

  for (const char of haystack) {
    if (char === needle[needleIndex]) {
      needleIndex++;
    }

    if (needleIndex === needle.length) {
      return true;
    }
  }

  return false;
}
