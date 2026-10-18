import { NODE_TYPES } from './schema.js';

// A palette entry is only complete when Inspector, canvas and public behavior
// are all verified. The current Editor has no such blanket acceptance yet.
const partial = new Set([
  'section','container','row','columns','flex','grid','stack','group','spacer',
  'heading','text','richtext','link','button','image','icon','divider','card',
  'list','table','tabs','accordion','gallery','carousel','badge','quote','form','schedule'
]);
const published = new Set([
  'section','container','row','columns','flex','grid','stack','group','spacer',
  'heading','text','richtext','link','button','image','icon','divider','card','badge','quote','schedule'
]);

export const ELEMENT_CAPABILITIES = Object.freeze(Object.fromEntries(
  Object.values(NODE_TYPES).map(type => [type, Object.freeze({
    status: partial.has(type) ? 'PARTIAL' : 'PLANNED',
    canvas: true,
    inspector: partial.has(type) ? 'PARTIAL' : 'PLANNED',
    public: published.has(type) ? 'PARTIAL' : 'PLANNED'
  })])
));

export function getElementCapability(type) {
  return ELEMENT_CAPABILITIES[type] ?? Object.freeze({status:'PLANNED',canvas:false,inspector:'PLANNED',public:'PLANNED'});
}
