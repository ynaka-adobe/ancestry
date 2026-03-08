/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature.
 * Base: cards. Source: https://www.ancestry.com
 * Extracts: Three feature items (how-tos, survey, curiosity center)
 * Each has: optional image, h3 heading, description paragraphs, CTA button
 * from .cmp-item-list inside .container-media-88b48f4f93 (showBAUBody, hide768 = desktop)
 * Source DOM (captured): lines 1853-1973 of cleaned.html
 *
 * Note: The item-list contains 2 item-wrappers but 3 logical features.
 * Item 1 has section heading (h2) + how-tos feature.
 * Item 2 has survey feature + curiosity center feature.
 * Features are identified by h3 headings within the DOM.
 */
export default function parse(element, { document }) {
  // Find all feature groups by h3 headings within the element
  // Found in captured DOM:
  //   h3 "Watch helpful how-tos." (with image before)
  //   h3 "Get started with a quick survey." (with image before)
  //   h3 "Explore our Curiosity Center." (with image before)
  const allH3 = element.querySelectorAll('h3');
  const cells = [];

  allH3.forEach((h3) => {
    const cardContent = [];

    // Look for an image preceding this h3 (within the same container scope)
    // Found in captured DOM: images in .cmp-container before each h3's .text div
    const parentContainer = h3.closest('.cmp-container[class*="container-media"]');
    if (parentContainer) {
      // Check for image in a sibling container before this text element
      const textDiv = h3.closest('.text');
      if (textDiv) {
        let prev = textDiv.previousElementSibling;
        while (prev) {
          const img = prev.querySelector('.cmp-image__image');
          if (img) {
            cardContent.push(img);
            break;
          }
          prev = prev.previousElementSibling;
        }
      }
    }

    // Add the heading
    cardContent.push(h3);

    // Extract description paragraphs following the h3
    // Found in captured DOM: <p class="text2xlrg"> descriptions after each h3
    const textContainer = h3.closest('.cmp-text');
    if (textContainer) {
      const paragraphs = textContainer.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (!p.classList.contains('show480') && !p.classList.contains('show768')) {
          cardContent.push(p);
        }
      });
    }

    // Extract CTA button after the h3's text container
    // Found in captured DOM: <a class="cmp-button"> in .button div after .text div
    const textDiv = h3.closest('.text');
    if (textDiv) {
      const nextSib = textDiv.nextElementSibling;
      if (nextSib) {
        const cta = nextSib.querySelector('a.cmp-button');
        if (cta) cardContent.push(cta);
      }
    }

    if (cardContent.length > 0) cells.push(cardContent);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
