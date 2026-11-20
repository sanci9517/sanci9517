import { SCHEMA_VERSION, createDocument, createNode, createPage, NODE_TYPES } from './schema.js';
import { assertValidEditorDocument } from './validation.js?v=20261120-d03-tooltip-viewport-bounds-v1';
import { EDITOR_TEMPLATE_CATALOG as TEMPLATES } from './design-system/template-catalog.js?v=20261119-edt041-stream-schedule-v1';

const TEMPLATE_BY_ID = new Map(TEMPLATES.map(template => [template.id, template]));
const TEMPLATE_NODE_TYPES = new Set([NODE_TYPES.SECTION, NODE_TYPES.CONTAINER, NODE_TYPES.HEADING, NODE_TYPES.TEXT, NODE_TYPES.BUTTON]);

export function listEditorTemplates() {
  return TEMPLATES.map(({ id, version, schemaVersion, label, description, preview }) => ({
    id, version, schemaVersion, label, description, preview: [...preview]
  }));
}

export function instantiateEditorTemplate(templateId, { id, title, slug } = {}) {
  const template = TEMPLATE_BY_ID.get(templateId);
  if (!template) throw new Error('Ismeretlen vagy nem támogatott sablon.');
  if (template.version !== 1 || template.schemaVersion !== SCHEMA_VERSION) throw new Error('A sablon verziója nem kompatibilis ezzel az Editorral.');
  const cleanTitle = typeof title === 'string' ? title.trim() : '';
  const cleanSlug = typeof slug === 'string' ? slug.trim().toLowerCase() : '';
  if (!cleanTitle || cleanTitle.length > 160) throw new Error('Az oldal neve 1–160 karakter legyen.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug) || cleanSlug.length > 80) throw new Error('A slug csak kisbetűt, számot és kötőjelet tartalmazhat.');

  const page = createPage({ id, name: cleanTitle, slug: cleanSlug });
  page.settings.templateId = template.id;
  const document = createDocument(page, { modern: true });
  const targetPage = document.pages[page.id];
  const nodesByKey = new Map();
  for (const spec of template.nodes) {
    if (!spec || typeof spec.key !== 'string' || !spec.key || nodesByKey.has(spec.key) || !TEMPLATE_NODE_TYPES.has(spec.type)) throw new Error('A sablon node listája érvénytelen.');
    const node = createNode(spec.type, {
      name: spec.name,
      props: structuredClone(spec.props || {}),
      style: structuredClone(spec.style || {}),
      metadata: { templateVersion: template.version }
    });
    nodesByKey.set(spec.key, { spec, node });
    targetPage.nodes[node.id] = node;
  }
  const parentsByKey = new Map();
  const attach = (parentKey, children) => {
    if (!Array.isArray(children)) throw new Error('A sablon gyermeklistája érvénytelen.');
    const siblings = new Set();
    for (const key of children) {
      if (typeof key !== 'string' || !nodesByKey.has(key) || siblings.has(key) || parentsByKey.has(key)) throw new Error('A sablon hierarchiája érvénytelen.');
      siblings.add(key);
      parentsByKey.set(key, parentKey);
    }
  };
  attach(null, template.rootChildren);
  for (const [key, { spec }] of nodesByKey) attach(key, spec.children || []);
  if (parentsByKey.size !== nodesByKey.size) throw new Error('A sablon minden eleme pontosan egyszer kapcsolódjon az oldalhoz.');
  const resolveChildren = keys => keys.map(key => nodesByKey.get(key).node.id);
  const root = targetPage.nodes[targetPage.rootId];
  root.children = resolveChildren(template.rootChildren);
  for (const { spec, node } of nodesByKey.values()) {
    node.children = resolveChildren(spec.children || []);
    const parentKey = parentsByKey.get(spec.key);
    const parent = parentKey === null ? root : nodesByKey.get(parentKey)?.node;
    if (!parent) throw new Error('A sablonban árva elem nem engedélyezett.');
    node.parentId = parent.id;
  }
  assertValidEditorDocument(document);
  return document;
}
