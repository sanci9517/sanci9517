import { listProperties } from './property-registry.js?v=20261030-inspector-default-contract';
import { normalizeInspectorValue } from './property-values.js';

const SCOPES = new Set(['style', 'desktop', 'tablet', 'mobile']);
const CONTRACT_KEY = 'inspectorStyleContract';

function propertyFor(node, key) {
  return listProperties({nodeType:node?.type}).find(property => property.responsive && property.key === key) ?? null;
}

/** Record only style fields explicitly written through an Inspector command. */
export function trackInspectorStylePatch(node, scope, patch) {
  if (!node || !SCOPES.has(scope) || !patch || typeof patch !== 'object') return;
  const prior=node.metadata?.[CONTRACT_KEY];
  const fields=new Set(prior?.version===1&&Array.isArray(prior.fields)?prior.fields:[]);
  for (const [key,value] of Object.entries(patch)) {
    if (!propertyFor(node,key)) continue;
    const field=`${scope}:${key}`;
    if (value===undefined || value===null || value==='') fields.delete(field);
    else fields.add(field);
  }
  const metadata={...(node.metadata||{})};
  if (fields.size) metadata[CONTRACT_KEY]={version:1,fields:[...fields].sort()};
  else delete metadata[CONTRACT_KEY];
  node.metadata=metadata;
}

/** Validate the fields this Editor version authored, leaving legacy styles readable. */
export function validateInspectorStyleContract(node) {
  const contract=node?.metadata?.[CONTRACT_KEY];
  if (contract===undefined) return true;
  if (!contract || contract.version!==1 || !Array.isArray(contract.fields) || contract.fields.length>280) return false;
  const seen=new Set();
  for (const field of contract.fields) {
    if (typeof field!=='string') return false;
    const separator=field.indexOf(':');
    if (separator<1) return false;
    const scope=field.slice(0,separator),key=field.slice(separator+1);
    if (!SCOPES.has(scope) || !key || seen.has(field)) return false;
    seen.add(field);
    const property=propertyFor(node,key);
    if (!property) return false;
    const values=scope==='style'?node.style:node.responsive?.[scope];
    const value=values?.[key];
    if (value===undefined || value===null || value==='') return false;
    try {
      if (normalizeInspectorValue(property,value)!==String(value).trim()) return false;
    } catch {
      return false;
    }
  }
  return true;
}
