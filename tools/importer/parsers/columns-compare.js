/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-compare.
 * Base: columns. Source: https://www.ancestry.com
 * Extracts: Two comparison items (Family History vs DNA), each with heading, description, CTA
 * from .cmp-item-list.listNoWrap inside .container-media-9dbef534c3 (showBAUBody)
 * Source DOM (captured): lines 1306-1407 of cleaned.html
 */
export default function parse(element, { document }) {
  // Find the two comparison item wrappers
  // Found in captured DOM: two .cmp-item-list__item-wrapper children
  const items = element.querySelectorAll(':scope > .cmp-item-list__items > .cmp-item-list__item-wrapper');

  const columns = [];
  items.forEach((item) => {
    const col = [];

    // Extract heading (desktop variant, skip mobile duplicates)
    // Found in captured DOM: <p class="hide480 text4xlrg bold">Family History is who you're from.</p>
    // and <p class="hide480 text4xlrg bold">DNA is where you're from.</p>
    const headings = item.querySelectorAll('.cmp-text p');
    for (const h of headings) {
      if (!h.classList.contains('show480') && !h.classList.contains('show768')
        && (h.classList.contains('text4xlrg') || h.classList.contains('text3xlrg'))) {
        col.push(h);
        break;
      }
    }

    // Extract description paragraph (desktop variant)
    // Found in captured DOM: <p class="hide768 textxlrg">Your membership serves as a vital hub...</p>
    // and <p class="hide768 textxlrg">With a simple saliva test...</p>
    const descs = item.querySelectorAll('.cmp-text p.textxlrg');
    for (const d of descs) {
      if (!d.classList.contains('show480') && !d.classList.contains('show768')) {
        col.push(d);
        break;
      }
    }

    // Extract CTA link (desktop variant)
    // Found in captured DOM: <a id="LOHPFamilyLearnMoreCTA" class="cmp-button hide480" href="/c/ancestry-family">Learn more</a>
    // and <a id="LOHPDNALearnMoreCTA" class="cmp-button hide480" href="/dna/">Learn more</a>
    const ctas = item.querySelectorAll('a.cmp-button');
    for (const cta of ctas) {
      if (!cta.classList.contains('show480') && !cta.classList.contains('show768')) {
        col.push(cta);
        break;
      }
    }

    if (col.length > 0) columns.push(col);
  });

  // Build cells: columns block = 1 row with N columns
  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-compare', cells });
  element.replaceWith(block);
}
