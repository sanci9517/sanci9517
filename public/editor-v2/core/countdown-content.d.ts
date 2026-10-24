export type CountdownContent={version:1,title:string,targetISO:string,finishText:string,showSeconds:boolean};
export function defaultCountdownContent():CountdownContent;
export function normalizeCountdownContent(value:unknown):CountdownContent;
export function remainingParts(targetISO:string,now?:number):{expired:boolean,days:number,hours:number,minutes:number,seconds:number}|null;
export function remainingText(targetISO:string,now?:number,showSeconds?:boolean,finishText?:string):string;
export function renderCountdownContent(value:Partial<CountdownContent>):string;
export function activateCountdowns(root:unknown):void;
