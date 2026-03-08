/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pricing.
 * Base: cards. Source: https://www.ancestry.com
 * Extracts: Three pricing cards (Family History, DNA, Family History + DNA)
 * Each card has: product name, price, feature description/list, CTA button, disclaimer
 * from .cmp-item-list.listNoWrap inside .container-media-209050d539 (showBAUBody)
 * Source DOM (captured): lines 1487-1758 of cleaned.html
 */
export default function parse(element, { document }) {
  // Find the three pricing card item wrappers
  // Found in captured DOM: three .cmp-item-list__item-wrapper children
  const items = element.querySelectorAll(':scope > .cmp-item-list__items > .cmp-item-list__item-wrapper');

  const cells = [];
  items.forEach((item) => {
    const cardContent = [];

    // Extract product image (icon/badge at top of card)
    // Found in captured DOM: .cmp-image__image inside each card
    const img = item.querySelector('.cmp-image__image');
    if (img) cardContent.push(img);

    // Extract product name (desktop variant)
    // Found in captured DOM: <p class="hide768 bold">Family History</p>
    const names = item.querySelectorAll('.cmp-text p.bold');
    for (const n of names) {
      if (!n.classList.contains('show480') && !n.classList.contains('show768')
        && !n.classList.contains('textxlrg') && !n.classList.contains('noTopSpacing')) {
        cardContent.push(n);
        break;
      }
    }

    // Extract price text (includes "From" and price amount)
    // Found in captured DOM: <p class="textxlrg bold">From</p> followed by price paragraph
    const priceTexts = item.querySelectorAll('.cmp-text p');
    for (const pt of priceTexts) {
      if (pt.classList.contains('textxlrg') && pt.classList.contains('bold')
        && pt.textContent.trim().startsWith('From')) {
        cardContent.push(pt);
      }
      if (pt.classList.contains('noTopSpacing') && pt.querySelector('sup')) {
        cardContent.push(pt);
      }
    }

    // Extract feature description (desktop variant, not mobile list)
    // Found in captured DOM: <p class="hide768 textxlrg">A membership gives you access...</p>
    const featureDescs = item.querySelectorAll('.cmp-text p.textxlrg:not(.bold)');
    for (const fd of featureDescs) {
      if (!fd.classList.contains('show480') && !fd.classList.contains('show768')) {
        cardContent.push(fd);
        break;
      }
    }

    // Extract CTA button
    // Found in captured DOM: <a class="cmp-button" href="/offers/freetrial">Start a 14-day free trial</a>
    const cta = item.querySelector('a.cmp-button');
    if (cta) cardContent.push(cta);

    // Extract disclaimer text
    // Found in captured DOM: <p class="textsml textCenter">*Ends 18 Mar 2026...</p>
    const disclaimer = item.querySelector('.cmp-text p.textsml');
    if (disclaimer) cardContent.push(disclaimer);

    if (cardContent.length > 0) cells.push(cardContent);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
