import {isAuthoredContent,CONTENT_FIELDS} from './authored-content.js';
import {isStructuredType} from './element-content.js';

// These describe existing version gates, not a new content schema or validator.
// More than one gate may apply: publication must not skip a legacy gate merely
// because the same node also carries an authored content marker.
const definition=(id,marker,types,storage,validation)=>Object.freeze({id,marker,types:types?Object.freeze(types):null,storage,validation});
export const CONTENT_PROFILES=Object.freeze({
 'authored-v1':definition('authored-v1','contentVersion',null,'props','validateElementContent + validatePageForPublication'),
 'media-v1':definition('media-v1','editorContentVersion',['image','video','audio'],'props','validateMediaNode'),
 'basic-v1':definition('basic-v1','basicContentVersion',['badge','quote','icon'],'props','basic text/icon checks'),
 'structured-v1':definition('structured-v1','structuredContentVersion',null,'props.contentModel','validateElementContent (structured)'),
 'divider-v1':definition('divider-v1','decorativeVersion',['divider'],'props.decoration','normalizeDividerStyle'),
 'spacer-v1':definition('spacer-v1','spacerVersion',['spacer'],'responsive.height','document validation only'),
 'card-v1':definition('card-v1','cardContentVersion',['card'],'props.cardContent','normalizeCardContent'),
 'countdown-v1':definition('countdown-v1','countdownVersion',['countdown'],'props.countdown','normalizeCountdownContent'),
 'social-v1':definition('social-v1','socialLinksVersion',['social'],'props.socialLinks','normalizeSocialLinks'),
 'embed-v1':definition('embed-v1','embedContentVersion',['embed'],'props.embedContent','normalizeEmbedContent'),
 'code-v1':definition('code-v1','codeSnippetVersion',['code'],'props.codeSnippet','normalizeCodeSnippet'),
 'schedule':definition('schedule',null,['schedule'],'props.schedule','validateScheduleConfig'),
});

export function hasContentProfile(node,id){
 if(!node||typeof node!=='object'||typeof id!=='string'||!Object.hasOwn(CONTENT_PROFILES,id))return false;
 if(id==='authored-v1')return isAuthoredContent(node);
 const profile=CONTENT_PROFILES[id];
 if(profile.types&&!profile.types.includes(node.type))return false;
 if(id==='structured-v1'&&!isStructuredType(node.type))return false;
 return profile.marker===null||node.metadata?.[profile.marker]===1;
}

const legacy=Object.freeze({id:'legacy-or-unrecognized-version',marker:null,types:null,storage:'existing document',validation:'existing document checks; no implicit migration'});
export function getElementContentContract(node){
 const profiles=Object.values(CONTENT_PROFILES).filter(profile=>hasContentProfile(node,profile.id));
 const declared=hasContentProfile(node,'authored-v1')&&typeof node.type==='string'&&Object.hasOwn(CONTENT_FIELDS,node.type)?CONTENT_FIELDS[node.type]:[];
 const fields=Object.freeze(declared.map(field=>Object.freeze({key:field.key,control:field.type})));
 return Object.freeze({fields,type:typeof node?.type==='string'?node.type:null,acceptance:'NOT_CERTIFIED',profiles:Object.freeze(profiles.length?profiles:[legacy])});
}
