import { createDefaultScheduleConfig, normalizeScheduleConfig } from './schedule-schema.js';

/*
 * Sanci9517 Visual Editor v2 — Page Model schema
 *
 * This is the only canonical editor document shape. The editor never treats
 * rendered HTML as its source of truth. Every mutation must preserve the
 * invariants validated by this module.
 */

export const SCHEMA_VERSION = 1;
export const DOCUMENT_TYPE = 'sanci-page-document';

export const NODE_TYPES = Object.freeze({
  ROOT: 'root',
  SECTION: 'section',
  CONTAINER: 'container',
  ROW: 'row',
  COLUMNS: 'columns',
  FLEX: 'flex',
  GRID: 'grid',
  STACK: 'stack',
  GROUP: 'group',
  SLOT: 'slot',
  HEADING: 'heading',
  TEXT: 'text',
  RICHTEXT: 'richtext',
  LINK: 'link',
  BUTTON: 'button',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  ICON: 'icon',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  CARD: 'card',
  LIST: 'list',
  TABLE: 'table',
  TABS: 'tabs',
  ACCORDION: 'accordion',
  DROPDOWN: 'dropdown',
  BREADCRUMB: 'breadcrumb',
  PAGINATION: 'pagination',
  SEARCH: 'search',
  COUNTDOWN: 'countdown',
  MODAL: 'modal',
  NAVBAR: 'navbar',
  MENU: 'menu',
  FOOTER: 'footer',
  SIDEBAR: 'sidebar',
  FORM: 'form',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
  SLIDER: 'slider',
  FILE: 'file',
  SUBMIT: 'submit',
  GALLERY: 'gallery',
  CAROUSEL: 'carousel',
  EMBED: 'embed',
  IFRAME: 'iframe',
  CODE: 'code',
  SOCIAL: 'social',
  LIVE: 'live',
  TWITCH: 'twitch',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  DISCORD: 'discord',
  SCHEDULE: 'schedule',
  STREAM_COUNT: 'streamcount',
  FOLLOWERS: 'followers',
  SUBS: 'subs',
  VOD: 'vod',
  SUPPORT: 'support',
  COMMUNITY: 'community',
  GAME_CARD: 'gamecard',
  GAME_LIST: 'gamelist',
  COMPONENT: 'component',
  CUSTOM: 'custom',
  BADGE: 'badge',
  QUOTE: 'quote',
  PANEL: 'panel',
  OVERLAY: 'overlay',
  ABSOLUTE: 'absolute',
  STICKY: 'sticky',
  TOOLTIP: 'tooltip',
  SHORTS: 'shorts',
  SPONSOR: 'sponsor',
  BUSINESS: 'business',
  ABOUT: 'about',
  SANCI_BUTTON: 'sanci-button'
});

const LEAF_TYPES = new Set([
  NODE_TYPES.HEADING,
  NODE_TYPES.TEXT,
  NODE_TYPES.RICHTEXT,
  NODE_TYPES.LINK,
  NODE_TYPES.BUTTON,
  NODE_TYPES.IMAGE,
  NODE_TYPES.VIDEO,
  NODE_TYPES.AUDIO,
  NODE_TYPES.ICON,
  NODE_TYPES.DIVIDER,
  NODE_TYPES.SPACER,
  NODE_TYPES.INPUT,
  NODE_TYPES.TEXTAREA,
  NODE_TYPES.CHECKBOX,
  NODE_TYPES.RADIO,
  NODE_TYPES.SELECT,
  NODE_TYPES.SLIDER,
  NODE_TYPES.FILE,
  NODE_TYPES.SUBMIT,
  NODE_TYPES.COUNTDOWN,
  NODE_TYPES.FOLLOWERS,
  NODE_TYPES.SUBS
]);

export const RICH_TEXT_SCHEMA_VERSION = 1;
export const RICH_TEXT_TYPE = 'richtext-document';

export const RICH_TEXT_BLOCK_TYPES = Object.freeze(new Set([
  'paragraph', 'heading', 'quote', 'code', 'bulleted-list', 'numbered-list'
]));

export const RICH_TEXT_MARKS = Object.freeze(new Set([]));

export function createEmptyRichText() {
  return {
    schemaVersion: RICH_TEXT_SCHEMA_VERSION,
    type: RICH_TEXT_TYPE,
    blocks: [{
      type: 'paragraph',
      children: [{ type: 'text', text: '', marks: [] }]
    }]
  };
}

export function normalizeRichText(value) {
  if (!value || typeof value !== 'object') throw new Error('Rich Text document must be an object');
  if (value.schemaVersion !== RICH_TEXT_SCHEMA_VERSION) throw new Error('Unsupported Rich Text schema version');
  if (value.type !== RICH_TEXT_TYPE) throw new Error('Invalid Rich Text document type');
  if (!Array.isArray(value.blocks) || value.blocks.length === 0) throw new Error('Rich Text blocks are required');

  const blocks = value.blocks.map((block) => {
    if (!block || typeof block !== 'object' || !RICH_TEXT_BLOCK_TYPES.has(block.type)) {
      throw new Error('Invalid Rich Text block type');
    }
    if (block.type === 'heading') {
      if (![1, 2, 3, 4, 5, 6].includes(block.level)) throw new Error('Heading level must be 1-6');
    }
    if (block.type === 'bulleted-list' || block.type === 'numbered-list') {
      if (!Array.isArray(block.items) || block.items.length === 0) throw new Error('List items are required');
      return {
        type: block.type,
        items: block.items.map((item) => normalizeRichTextInlineChildren(item?.children))
      };
    }
    return {
      type: block.type,
      ...(block.type === 'heading' ? { level: block.level } : {}),
      children: normalizeRichTextInlineChildren(block.children)
    };
  });

  return {
    schemaVersion: RICH_TEXT_SCHEMA_VERSION,
    type: RICH_TEXT_TYPE,
    blocks
  };
}

function normalizeRichTextInlineChildren(children) {
  if (!Array.isArray(children) || children.length === 0) {
    return [{ type: 'text', text: '', marks: [] }];
  }
  return children.map((inline) => {
    if (!inline || inline.type !== 'text' || typeof inline.text !== 'string') {
      throw new Error('Invalid Rich Text inline node');
    }
    const marks = [...new Set(Array.isArray(inline.marks) ? inline.marks : [])];
    if (marks.some((mark) => !RICH_TEXT_MARKS.has(mark))) throw new Error('Invalid Rich Text mark');
    const result = { type: 'text', text: inline.text, marks };
    if (inline.link != null) {
      if (!inline.link || typeof inline.link !== 'object' || typeof inline.link.href !== 'string' || !inline.link.href.trim()) {
        throw new Error('Invalid Rich Text link');
      }
      result.link = {
        href: inline.link.href,
        ...(inline.link.target ? { target: String(inline.link.target) } : {}),
        ...(inline.link.rel ? { rel: String(inline.link.rel) } : {}),
        ...(inline.link.title ? { title: String(inline.link.title) } : {})
      };
    }
    return result;
  });
}

export const DEFAULT_RESPONSIVE = Object.freeze({
  desktop: {},
  tablet: {},
  mobile: {}
});

export function createId(prefix = 'node') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function createNode(type = NODE_TYPES.CONTAINER, overrides = {}) {
  return {
    id: createId('node'),
    type,
    name: type,
    parentId: null,
    children: [],
    props: type === NODE_TYPES.SCHEDULE ? { schedule: createDefaultScheduleConfig() } : {},
    style: {},
    responsive: {
      desktop: {},
      tablet: {},
      mobile: {}
    },
    states: {},
    visibility: { desktop: true, tablet: true, mobile: true },
    locked: false,
    component: null,
    dataBindings: {},
    interactions: [],
    accessibility: {},
    metadata: {},
    ...overrides
  };
}

export function createPage({ id = createId('page'), name = 'Új oldal', slug = 'uj-oldal' } = {}) {
  const root = createNode(NODE_TYPES.ROOT, {
    id: createId('root'),
    name: 'Oldal gyökér'
  });

  return {
    id,
    name,
    slug,
    status: 'draft',
    metadata: {
      title: name,
      description: '',
      canonical: '',
      openGraph: {}
    },
    settings: {
      templateId: null,
      access: 'public',
      customCode: { head: '', bodyStart: '', bodyEnd: '' }
    },
    schemaVersion: SCHEMA_VERSION,
    rootId: root.id,
    nodes: { [root.id]: root },
    revision: 0
  };
}

export function createDocument(page = createPage()) {
  return {
    schemaVersion: SCHEMA_VERSION,
    type: DOCUMENT_TYPE,
    siteId: null,
    activePageId: page.id,
    pages: { [page.id]: page },
    metadata: {},
    revision: 0
  };
}

export function isLeafType(type) {
  return LEAF_TYPES.has(type);
}

export function cloneDocument(document) {
  return structuredClone(document);
}

export function getPage(document, pageId = document?.activePageId) {
  return document?.pages?.[pageId] ?? null;
}

export function getNode(page, nodeId) {
  return page?.nodes?.[nodeId] ?? null;
}

export function getChildren(page, nodeId) {
  const node = getNode(page, nodeId);
  if (!node) return [];
  return node.children.map((id) => page.nodes[id]).filter(Boolean);
}

export function canContain(parent, childType) {
  if (!parent) return false;
  if (isLeafType(parent.type)) return false;
  if (childType === NODE_TYPES.ROOT) return false;
  return true;
}

export function validatePage(page) {
  const errors = [];
  const seen = new Set();

  if (!page || typeof page !== 'object') {
    return ['page must be an object'];
  }

  if (!page.id || !page.rootId) errors.push('page.id and page.rootId are required');
  if (!page.nodes || typeof page.nodes !== 'object') errors.push('page.nodes must be an object');

  for (const [id, node] of Object.entries(page.nodes ?? {})) {
    if (seen.has(id)) errors.push(`duplicate node id: ${id}`);
    seen.add(id);

    if (!node.id || node.id !== id) errors.push(`node id mismatch: ${id}`);
    if (!node.type) errors.push(`node type missing: ${id}`);
    if (node.type === NODE_TYPES.SCHEDULE) {
      try {
        normalizeScheduleConfig(node.props?.schedule);
      } catch (error) {
        errors.push(`invalid schedule config: ${id}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    if (!Array.isArray(node.children)) errors.push(`children must be an array: ${id}`);

    for (const childId of node.children ?? []) {
      const child = page.nodes[childId];
      if (!child) errors.push(`missing child ${childId} referenced by ${id}`);
      else if (child.parentId !== id) errors.push(`parent mismatch: ${childId} -> ${id}`);
    }
  }

  const root = page.nodes?.[page.rootId];
  if (!root) errors.push('root node missing');
  else if (root.parentId !== null) errors.push('root parentId must be null');

  return errors;
}

export function validateDocument(document) {
  const errors = [];
  if (!document || typeof document !== 'object') return ['document must be an object'];
  if (document.type !== DOCUMENT_TYPE) errors.push(`invalid document type: ${document.type}`);
  if (document.schemaVersion !== SCHEMA_VERSION) errors.push(`unsupported schema version: ${document.schemaVersion}`);
  if (!document.pages || typeof document.pages !== 'object') errors.push('document.pages must be an object');
  if (!document.activePageId || !document.pages?.[document.activePageId]) {
    errors.push('activePageId must reference an existing page');
  }

  for (const page of Object.values(document.pages ?? {})) {
    errors.push(...validatePage(page).map((error) => `page ${page.id}: ${error}`));
  }

  return errors;
}
