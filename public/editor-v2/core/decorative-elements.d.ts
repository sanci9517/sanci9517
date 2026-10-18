export type DividerStyle={version:1,thickness:number,color:string,lineStyle:'solid'|'dashed'|'dotted'|'double'};
export const DIVIDER_LINE_STYLES:readonly string[];
export function defaultDividerStyle():DividerStyle;
export function normalizeDividerStyle(value:unknown):DividerStyle;
