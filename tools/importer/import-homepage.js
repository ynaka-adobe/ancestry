/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import columnsCompareParser from './parsers/columns-compare.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsResourcesParser from './parsers/columns-resources.js';

// TRANSFORMER IMPORTS
import ancestryCleanupTransformer from './transformers/ancestry-cleanup.js';
import ancestrySectionsTransformer from './transformers/ancestry-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'columns-compare': columnsCompareParser,
  'cards-pricing': cardsPricingParser,
  'cards-feature': cardsFeatureParser,
  'columns-resources': columnsResourcesParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Ancestry.com homepage with hero, search features, promotional content, and calls to action',
  urls: [
    'https://www.ancestry.com'
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.showBAUHero .a250-gradient .cmp-container-centered']
    },
    {
      name: 'columns-compare',
      instances: ['.showBAUBody .container-media-9dbef534c3 .cmp-item-list.listNoWrap']
    },
    {
      name: 'cards-pricing',
      instances: ['.showBAUBody .container-media-209050d539 .cmp-item-list.listNoWrap']
    },
    {
      name: 'cards-feature',
      instances: ['.showBAUBody .container-media-88b48f4f93 .cmp-item-list']
    },
    {
      name: 'columns-resources',
      instances: ['.ancestry-footer .cmp-item-list']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Sale Headband',
      selector: '.showBAUHero .flashSaleHeadband.bgDark',
      style: 'dark',
      blocks: [],
      defaultContent: ['.flashSaleHeadband h2.textalt', '.flashSaleHeadband .cmp-text p', '.flashSaleHeadband .cmp-button', '.flashSaleHeadband p.textsml']
    },
    {
      id: 'section-2',
      name: 'Hero',
      selector: '.showBAUHero .a250-gradient',
      style: null,
      blocks: ['hero-homepage'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: "Women's History Month Promo",
      selector: '.showBAUHero .container-media-64f6229726',
      style: 'dark',
      blocks: [],
      defaultContent: ['.container-media-64f6229726 .cmp-image__image', '.container-media-64f6229726 .cmp-text p', '.container-media-64f6229726 .cmp-button']
    },
    {
      id: 'section-4',
      name: 'Family History and AncestryDNA',
      selector: '.showBAUBody .container-media-9dbef534c3',
      style: null,
      blocks: ['columns-compare'],
      defaultContent: ['.container-media-9dbef534c3 h2.textalt', '.container-media-9dbef534c3 .cmp-text p.text3xlrg']
    },
    {
      id: 'section-5',
      name: 'AncestryPreserve',
      selector: '.showBAUBody .container-media-8f09b9dbdd',
      style: null,
      blocks: [],
      defaultContent: ['.container-media-8f09b9dbdd .cmp-image__image', '.container-media-8f09b9dbdd h3', '.container-media-8f09b9dbdd p.textdesc', '.container-media-8f09b9dbdd .cmp-button']
    },
    {
      id: 'section-6',
      name: 'Pricing Cards',
      selector: '.showBAUBody .container-media-209050d539',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['.container-media-209050d539 h2.textalt', '.container-media-209050d539 .cmp-text p.text3xlrg']
    },
    {
      id: 'section-7',
      name: 'Finding Your Roots',
      selector: '.showBAUBody .container-media-3b8f82d127',
      style: 'accent-teal',
      blocks: [],
      defaultContent: ['.container-media-3b8f82d127 .cmp-image__image', '.container-media-3b8f82d127 h3', '.container-media-3b8f82d127 p.textdesc', '.container-media-3b8f82d127 p.textsml', '.container-media-3b8f82d127 .cmp-button']
    },
    {
      id: 'section-8',
      name: 'Learn More',
      selector: '.showBAUBody .container-media-88b48f4f93',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: ['.container-media-88b48f4f93 h2.textalt', '.container-media-88b48f4f93 .cmp-text p.text2xlrg']
    },
    {
      id: 'section-9',
      name: 'Genealogy Resources',
      selector: '.ancestry-footer',
      style: 'dark',
      blocks: ['columns-resources'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  ancestryCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [ancestrySectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
