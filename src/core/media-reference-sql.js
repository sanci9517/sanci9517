// SQL candidate predicate shared by the media usage, public delivery,
// atomic archival and future retention guards. Inputs are code-owned SQL
// identifiers/expressions only; never interpolate request input here.
const COLUMNS=new Set([
 'content_json','published_content_json',
 'p.content_json','p.published_content_json',
 'er.document_json','r.document_json'
]);
const ASSET_EXPRESSIONS=new Set(['?','m.id']);

export function mediaReferenceSql(column,assetExpression){
 if(!COLUMNS.has(column)||!ASSET_EXPRESSIONS.has(assetExpression))throw new TypeError('Invalid media reference SQL expression');
 const raw=`instr(lower(COALESCE(${column},'')),lower(${assetExpression}))>0`;
 const decoded=`EXISTS (SELECT 1 FROM json_tree(CASE WHEN json_valid(${column}) THEN ${column} ELSE 'null' END) AS media_ref_json
   WHERE media_ref_json.type='text' AND instr(lower(media_ref_json.value),lower(${assetExpression}))>0)`;
 return `(${raw} OR (instr(COALESCE(${column},''),char(92)||'u')>0 AND ${decoded}))`;
}
