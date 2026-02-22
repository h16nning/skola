import type { ReactNode } from "react";

const BASE = "spotlight";

/**
 * Highlights matching query text within a string by wrapping it in a <mark> element.
 * Case-insensitive search.
 *
 * @param text - The text to search within
 * @param query - The query string to highlight
 * @returns ReactNode with highlighted text or original text if no match
 */
export function highlightQuery(text: string, query: string): ReactNode {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <mark className={`${BASE}__highlight`}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}
