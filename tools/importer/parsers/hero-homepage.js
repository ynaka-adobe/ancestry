/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage.
 * Base: hero. Source: https://www.ancestry.com
 * Extracts: h1 heading, supporting paragraph, CTA button, disclaimer text
 * from .cmp-container-centered inside .a250-gradient
 * Source DOM (captured): lines 491-531 of cleaned.html
 */
export default function parse(element, { document }) {
  // Extract heading (h1 with responsive variants)
  // Found in captured DOM: <h1><span class="hide768">You've got questions...</span>...</h1>
  const heading = element.querySelector('h1');

  // Extract supporting paragraph (desktop variant, skip mobile duplicates)
  // Found in captured DOM: <p class="bold hide480">Curious about your family history?...</p>
  const descriptions = element.querySelectorAll('.cmp-text p');
  let description = null;
  for (const p of descriptions) {
    if (!p.classList.contains('show480') && !p.classList.contains('show768') && !p.classList.contains('textsml')) {
      description = p;
      break;
    }
  }

  // Extract CTA button link
  // Found in captured DOM: <a class="cmp-button" href="/c/ancestry-family">Try Ancestry free</a>
  const cta = element.querySelector('.cmp-button[href], a.cmp-button');

  // Extract disclaimer text
  // Found in captured DOM: <p class="textsml">Free trial terms apply.</p>
  const disclaimer = element.querySelector('p.textsml');

  // Build cells to match hero block library structure:
  // Row 1 (optional): background image - not present in this hero
  // Row 2: content cell with heading, description, CTA, disclaimer
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) contentCell.push(cta);
  if (disclaimer) contentCell.push(disclaimer);

  const cells = [contentCell];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
