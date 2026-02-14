// htmlNormalizer.js
// Normalize HTML between Quill (web) and Pell (Expo) editors

/**
 * Convert Pell-style <div> HTML to Quill-compatible <p> tags
 */
export function toQuillHtml(html: any) {
  if (!html) return '';
  return html
    .replace(/<div>([\s\S]*?)<\/div>/gi, '<p>$1</p>')
    // Remove empty <p><br></p> or <p>&nbsp;</p>
    .replace(/>\s+</g, '><')
    .trim();
}

/**
 * Convert Quill-style <p> HTML to Pell-compatible <div> tags
 */
export function toPellHtml(html: any) {
  if (!html) return '';
  return html
    .replace(/<p>/g, '<div>')
    .replace(/<\/p>/g, '</div>')
    .replace(/<div><br><\/div>/g, '') // remove empty lines
    .replace(/<div>\s*<\/div>/g, '')  // remove empty divs
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Remove excessive <br> tags (optional helper)
 */
export function cleanBreaks(html: any) {
  if (!html) return '';
  return html
    .replace(/(<br\s*\/?>\s*){2,}/g, '<br>') // collapse multiple breaks
    .trim();
}

/**
 * Extract plain text (for search/snippet preview)
 */
export function stripHtmlTags(html: any) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Full cleanup chain — use before saving
 */
export function normalizeForSave(html: any) {
  return cleanBreaks(toQuillHtml(html));
}

export default {
  toQuillHtml,
  toPellHtml,
  cleanBreaks,
  stripHtmlTags,
  normalizeForSave
};