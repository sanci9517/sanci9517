export type ContentProfile = Readonly<{id:string;marker:string|null;types:readonly string[]|null;storage:string;validation:string}>;
export const CONTENT_PROFILES:Readonly<Record<string,ContentProfile>>;
export function hasContentProfile(node:unknown,id:string):boolean;
export function getElementContentContract(node:unknown):Readonly<{fields:readonly Readonly<{key:string;control:string}>[];type:string|null;acceptance:'NOT_CERTIFIED';profiles:readonly ContentProfile[]}>;
