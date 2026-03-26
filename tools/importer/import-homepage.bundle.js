var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1");
    const descriptions = element.querySelectorAll(".cmp-text p");
    let description = null;
    for (const p of descriptions) {
      if (!p.classList.contains("show480") && !p.classList.contains("show768") && !p.classList.contains("textsml")) {
        description = p;
        break;
      }
    }
    const cta = element.querySelector(".cmp-button[href], a.cmp-button");
    const disclaimer = element.querySelector("p.textsml");
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);
    if (disclaimer) contentCell.push(disclaimer);
    const cells = [contentCell];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-compare.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(":scope > .cmp-item-list__items > .cmp-item-list__item-wrapper");
    const columns = [];
    items.forEach((item) => {
      const col = [];
      const headings = item.querySelectorAll(".cmp-text p");
      for (const h of headings) {
        if (!h.classList.contains("show480") && !h.classList.contains("show768") && (h.classList.contains("text4xlrg") || h.classList.contains("text3xlrg"))) {
          col.push(h);
          break;
        }
      }
      const descs = item.querySelectorAll(".cmp-text p.textxlrg");
      for (const d of descs) {
        if (!d.classList.contains("show480") && !d.classList.contains("show768")) {
          col.push(d);
          break;
        }
      }
      const ctas = item.querySelectorAll("a.cmp-button");
      for (const cta of ctas) {
        if (!cta.classList.contains("show480") && !cta.classList.contains("show768")) {
          col.push(cta);
          break;
        }
      }
      if (col.length > 0) columns.push(col);
    });
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-compare", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pricing.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll(":scope > .cmp-item-list__items > .cmp-item-list__item-wrapper");
    const cells = [];
    items.forEach((item) => {
      const cardContent = [];
      const img = item.querySelector(".cmp-image__image");
      if (img) cardContent.push(img);
      const names = item.querySelectorAll(".cmp-text p.bold");
      for (const n of names) {
        if (!n.classList.contains("show480") && !n.classList.contains("show768") && !n.classList.contains("textxlrg") && !n.classList.contains("noTopSpacing")) {
          cardContent.push(n);
          break;
        }
      }
      const priceTexts = item.querySelectorAll(".cmp-text p");
      for (const pt of priceTexts) {
        if (pt.classList.contains("textxlrg") && pt.classList.contains("bold") && pt.textContent.trim().startsWith("From")) {
          cardContent.push(pt);
        }
        if (pt.classList.contains("noTopSpacing") && pt.querySelector("sup")) {
          cardContent.push(pt);
        }
      }
      const featureDescs = item.querySelectorAll(".cmp-text p.textxlrg:not(.bold)");
      for (const fd of featureDescs) {
        if (!fd.classList.contains("show480") && !fd.classList.contains("show768")) {
          cardContent.push(fd);
          break;
        }
      }
      const cta = item.querySelector("a.cmp-button");
      if (cta) cardContent.push(cta);
      const disclaimer = item.querySelector(".cmp-text p.textsml");
      if (disclaimer) cardContent.push(disclaimer);
      if (cardContent.length > 0) cells.push(cardContent);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const allH3 = element.querySelectorAll("h3");
    const cells = [];
    allH3.forEach((h3) => {
      const cardContent = [];
      const parentContainer = h3.closest('.cmp-container[class*="container-media"]');
      if (parentContainer) {
        const textDiv2 = h3.closest(".text");
        if (textDiv2) {
          let prev = textDiv2.previousElementSibling;
          while (prev) {
            const img = prev.querySelector(".cmp-image__image");
            if (img) {
              cardContent.push(img);
              break;
            }
            prev = prev.previousElementSibling;
          }
        }
      }
      cardContent.push(h3);
      const textContainer = h3.closest(".cmp-text");
      if (textContainer) {
        const paragraphs = textContainer.querySelectorAll("p");
        paragraphs.forEach((p) => {
          if (!p.classList.contains("show480") && !p.classList.contains("show768")) {
            cardContent.push(p);
          }
        });
      }
      const textDiv = h3.closest(".text");
      if (textDiv) {
        const nextSib = textDiv.nextElementSibling;
        if (nextSib) {
          const cta = nextSib.querySelector("a.cmp-button");
          if (cta) cardContent.push(cta);
        }
      }
      if (cardContent.length > 0) cells.push(cardContent);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-resources.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll(":scope > .cmp-item-list__items > .cmp-item-list__item-wrapper");
    const columns = [];
    items.forEach((item) => {
      const col = [];
      const heading = item.querySelector("h2");
      if (heading) col.push(heading);
      const linkList = item.querySelector(".ancestry-cmp-link-list__list");
      if (linkList) col.push(linkList);
      if (col.length > 0) columns.push(col);
    });
    const cells = [columns];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ancestry-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        ".showFantasyHero.noDisplay",
        ".showFantasyBody.noDisplay"
      ]);
      const emptyEmbeds = element.querySelectorAll(".embed");
      emptyEmbeds.forEach((embed) => {
        const cmpEmbed = embed.querySelector(".cmp-embed");
        if (cmpEmbed && !cmpEmbed.textContent.trim()) {
          embed.remove();
        }
      });
      WebImporter.DOMUtils.remove(element, [".cmp-spacer", ".spacer"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "noscript",
        "iframe",
        "link"
      ]);
      const mobileOnly = element.querySelectorAll(".show480, .show768");
      mobileOnly.forEach((el) => el.remove());
      const emptySpans = element.querySelectorAll("span:empty");
      emptySpans.forEach((span) => span.remove());
    }
  }

  // tools/importer/transformers/ancestry-sections.js
  var H2 = { after: "afterTransform" };
  function transform2(hookName, element, payload) {
    var _a;
    if (hookName === H2.after) {
      const sections = (_a = payload == null ? void 0 : payload.template) == null ? void 0 : _a.sections;
      if (!sections || sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "columns-compare": parse2,
    "cards-pricing": parse3,
    "cards-feature": parse4,
    "columns-resources": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Ancestry.com homepage with hero, search features, promotional content, and calls to action",
    urls: [
      "https://www.ancestry.com"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: [".showBAUHero .a250-gradient .cmp-container-centered"]
      },
      {
        name: "columns-compare",
        instances: [".showBAUBody .container-media-9dbef534c3 .cmp-item-list.listNoWrap"]
      },
      {
        name: "cards-pricing",
        instances: [".showBAUBody .container-media-209050d539 .cmp-item-list.listNoWrap"]
      },
      {
        name: "cards-feature",
        instances: [".showBAUBody .container-media-88b48f4f93 .cmp-item-list"]
      },
      {
        name: "columns-resources",
        instances: [".ancestry-footer .cmp-item-list"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Sale Headband",
        selector: ".showBAUHero .flashSaleHeadband.bgDark",
        style: "dark",
        blocks: [],
        defaultContent: [".flashSaleHeadband h2.textalt", ".flashSaleHeadband .cmp-text p", ".flashSaleHeadband .cmp-button", ".flashSaleHeadband p.textsml"]
      },
      {
        id: "section-2",
        name: "Hero",
        selector: ".showBAUHero .a250-gradient",
        style: null,
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Women's History Month Promo",
        selector: ".showBAUHero .container-media-64f6229726",
        style: "dark",
        blocks: [],
        defaultContent: [".container-media-64f6229726 .cmp-image__image", ".container-media-64f6229726 .cmp-text p", ".container-media-64f6229726 .cmp-button"]
      },
      {
        id: "section-4",
        name: "Family History and AncestryDNA",
        selector: ".showBAUBody .container-media-9dbef534c3",
        style: null,
        blocks: ["columns-compare"],
        defaultContent: [".container-media-9dbef534c3 h2.textalt", ".container-media-9dbef534c3 .cmp-text p.text3xlrg"]
      },
      {
        id: "section-5",
        name: "AncestryPreserve",
        selector: ".showBAUBody .container-media-8f09b9dbdd",
        style: null,
        blocks: [],
        defaultContent: [".container-media-8f09b9dbdd .cmp-image__image", ".container-media-8f09b9dbdd h3", ".container-media-8f09b9dbdd p.textdesc", ".container-media-8f09b9dbdd .cmp-button"]
      },
      {
        id: "section-6",
        name: "Pricing Cards",
        selector: ".showBAUBody .container-media-209050d539",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: [".container-media-209050d539 h2.textalt", ".container-media-209050d539 .cmp-text p.text3xlrg"]
      },
      {
        id: "section-7",
        name: "Finding Your Roots",
        selector: ".showBAUBody .container-media-3b8f82d127",
        style: "accent-teal",
        blocks: [],
        defaultContent: [".container-media-3b8f82d127 .cmp-image__image", ".container-media-3b8f82d127 h3", ".container-media-3b8f82d127 p.textdesc", ".container-media-3b8f82d127 p.textsml", ".container-media-3b8f82d127 .cmp-button"]
      },
      {
        id: "section-8",
        name: "Learn More",
        selector: ".showBAUBody .container-media-88b48f4f93",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: [".container-media-88b48f4f93 h2.textalt", ".container-media-88b48f4f93 .cmp-text p.text2xlrg"]
      },
      {
        id: "section-9",
        name: "Genealogy Resources",
        selector: ".ancestry-footer",
        style: "dark",
        blocks: ["columns-resources"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
