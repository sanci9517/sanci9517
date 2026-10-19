import {CONTENT_TYPES,STRUCTURAL_TYPES} from './authored-content.js';
import { NODE_TYPES } from './schema.js';

// A palette entry is only complete when Inspector, canvas and public behavior
// are all verified. The current Editor has no such blanket acceptance yet.
const partial=new Set([...CONTENT_TYPES,...STRUCTURAL_TYPES,'root','richtext','schedule','code','countdown','social','embed','divider','spacer']);
const published=partial;

export const ELEMENT_CAPABILITIES = Object.freeze(Object.fromEntries(
  Object.values(NODE_TYPES).map(type => [type, Object.freeze({
    status: partial.has(type) ? 'PARTIAL' : 'PLANNED',
    canvas: partial.has(type),
    inspector: partial.has(type) ? 'PARTIAL' : 'PLANNED',
    public: published.has(type) ? 'PARTIAL' : 'PLANNED'
  })])
));

export function getElementCapability(type) {
  return ELEMENT_CAPABILITIES[type] ?? Object.freeze({status:'PLANNED',canvas:false,inspector:'PLANNED',public:'PLANNED'});
}
