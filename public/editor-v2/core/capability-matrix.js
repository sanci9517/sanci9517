import {CONTENT_TYPES,STRUCTURAL_TYPES} from './authored-content.js';
import { NODE_TYPES } from './schema.js';
import { listProperties } from './property-registry.js';
import {getInspectorValueContract} from './property-values.js';

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

const unavailable=Object.freeze({status:'PLANNED',canvas:false,inspector:'PLANNED',public:'PLANNED'});

export function getElementCapability(type) {
  return typeof type==='string'&&Object.hasOwn(ELEMENT_CAPABILITIES,type)?ELEMENT_CAPABILITIES[type]:unavailable;
}

/** Registry declarations, not a claim that every lifecycle acceptance passed.
 * Query at use time so registered extensions and appliesTo stay authoritative.
 * Planned and unknown types deliberately expose no working Inspector controls.
 */
export function getElementInspectorContract(type) {
  const capability=getElementCapability(type);
  const properties=capability.status==='PLANNED'?[]:listProperties({nodeType:type});
  const fields=properties.map(property=>Object.freeze({
    id:property.id,
    group:property.group,
    control:property.type,
    command:property.command,
    key:property.key??null,
    scope:property.responsive?'viewport':'node',
    reset:property.responsive?'inherit':'type-specific',
    resetContract:Object.freeze(property.responsive
      ? {status:'SUPPORTED',command:property.command,operation:'clear-override',effect:'inherit'}
      : {status:'TYPE_SPECIFIC',command:property.command,operation:'type-specific'}),
    initialValue:Object.hasOwn(property,'defaultValue')
      ? Object.freeze({status:'DECLARED',value:property.defaultValue})
      : Object.freeze({status:'NOT_DECLARED'}),
    valueContract:getInspectorValueContract(property),
  }));
  return Object.freeze({
    type:typeof type==='string'?type:null,
    status:capability.status,
    acceptance:'NOT_CERTIFIED',
    fields:Object.freeze(fields),
    groups:Object.freeze([...new Set(fields.map(field=>field.group))]),
  });
}

// Content versions share the same gates as Inspector and server publication.
export {getElementContentContract} from './content-profiles.js';
