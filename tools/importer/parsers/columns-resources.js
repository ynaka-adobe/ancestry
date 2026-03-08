/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-resources.
 * Base: columns. Source: https://www.ancestry.com
 * Extracts: Three columns of categorized links (Genealogy Resources, Historical Collections, Family Trees)
 * Each column has: h2 heading + unordered list of links
 * from .cmp-item-list inside .ancestry-footer
 * Source DOM (captured): lines 2086-2168 of cleaned.html
 */
export default function parse(element, { document }) {
  // Find the three resource column item wrappers
  // Found in captured DOM: three .cmp-item-list__item-wrapper.align-to-top-vertically children
  const items = element.querySelectorAll(':scope > .cmp-item-list__items > .cmp-item-list__item-wrapper');

  const columns = [];
  items.forEach((item) => {
    const col = [];

    // Extract column heading
    // Found in captured DOM: <h2><b>Genealogy Resources</b></h2>
    // <h2><b>Historical Collections</b></h2>
    // <h2><b>Family Trees</b></h2>
    const heading = item.querySelector('h2');
    if (heading) col.push(heading);

    // Extract link list
    // Found in captured DOM: <ul class="ancestry-cmp-link-list__list"> with <li> items
    const linkList = item.querySelector('.ancestry-cmp-link-list__list');
    if (linkList) col.push(linkList);

    if (col.length > 0) columns.push(col);
  });

  // Build cells: columns block = 1 row with N columns
  const cells = [columns];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-resources', cells });
  element.replaceWith(block);
}
