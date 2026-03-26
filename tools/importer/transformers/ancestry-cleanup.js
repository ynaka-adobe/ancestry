/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ancestry cleanup.
 * Removes non-authorable content from ancestry.com pages.
 * Selectors from captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove hidden A/B test variants (Fantasy/holiday variants hidden via noDisplay class)
    // Found in captured DOM: <div class="cmp-container showFantasyHero noDisplay ...">
    WebImporter.DOMUtils.remove(element, [
      '.showFantasyHero.noDisplay',
      '.showFantasyBody.noDisplay',
    ]);

    // Remove empty embed containers (found in captured DOM as empty .cmp-embed divs)
    const emptyEmbeds = element.querySelectorAll('.embed');
    emptyEmbeds.forEach((embed) => {
      const cmpEmbed = embed.querySelector('.cmp-embed');
      if (cmpEmbed && !cmpEmbed.textContent.trim()) {
        embed.remove();
      }
    });

    // Remove spacer elements (non-authorable presentation)
    // Found in captured DOM: <div class="cmp-spacer spacer-media-...">
    WebImporter.DOMUtils.remove(element, ['.cmp-spacer', '.spacer']);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome
    // Found in captured DOM: <header class="container_1922310524 ..."> and <footer class="experiencefragment">
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'noscript',
      'iframe',
      'link',
    ]);

    // Remove mobile-only duplicate content (responsive variants)
    // Found in captured DOM: elements with show480, show768 classes that duplicate desktop content
    const mobileOnly = element.querySelectorAll('.show480, .show768');
    mobileOnly.forEach((el) => el.remove());

    // Remove empty span elements left over
    const emptySpans = element.querySelectorAll('span:empty');
    emptySpans.forEach((span) => span.remove());
  }
}
