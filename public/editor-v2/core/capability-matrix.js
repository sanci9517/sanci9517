import {CONTENT_TYPES,STRUCTURAL_TYPES} from './authored-content.js';
import { NODE_TYPES } from './schema.js';
import { listProperties } from './property-registry.js?v=20261030-inspector-value-metadata-contract';
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

function inspectorInitialValueSource(property){
  if(property.responsive)return Object.freeze({
    strategy:'resolved-style',
    key:property.key,
    precedence:Object.freeze(['responsive-cascade','node.style','authored-content-default']),
    fallback:['layout','flex','grid'].includes(property.group)?'computed-canvas-style':'css-initial-or-inherited'
  });
  if(property.id==='content.text')return Object.freeze({strategy:'node-props',keys:Object.freeze(['text','content']),fallback:'node.name'});
  if(property.id==='content.href')return Object.freeze({strategy:'node-props',keys:Object.freeze(['href']),fallback:'empty'});
  return Object.freeze({strategy:'node-field',key:property.key??'name',fallback:'node.type'});
}

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
    layoutContext:property.layoutContext??null,
    scope:property.responsive?'viewport':'node',
    reset:property.responsive?'inherit':'type-specific',
    resetContract:Object.freeze(property.responsive
      ? {status:'SUPPORTED',command:property.command,operation:'clear-override',effect:'inherit'}
      : {status:'TYPE_SPECIFIC',command:property.command,operation:'type-specific'}),
    initialValue:Object.hasOwn(property,'defaultValue')
      ? Object.freeze({status:'DECLARED',value:property.defaultValue,source:inspectorInitialValueSource(property)})
      : Object.freeze({status:'NOT_DECLARED',source:inspectorInitialValueSource(property)}),
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
export {getElementContentContract} from './content-profiles.js?v=20261025-inspector-lifecycle-contract';
