export interface IconChoice {id:string;label:string;glyph:string}
export declare const ICON_CHOICES:readonly IconChoice[];
export declare function iconById(id:unknown):IconChoice;
export declare function isSupportedIcon(id:unknown):boolean;
