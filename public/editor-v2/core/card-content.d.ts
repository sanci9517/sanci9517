export type CardContent={version:1,title:string,description:string,variant:'solid'|'outline'|'glass',imageSrc:string,imageAlt:string,actionLabel:string,actionHref:string,newWindow:boolean};
export const CARD_VARIANTS:readonly string[];
export function defaultCardContent():CardContent;
export function normalizeCardContent(value:unknown):CardContent;
