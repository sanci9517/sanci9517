export type CodeLanguage='text'|'bash'|'powershell'|'javascript'|'typescript'|'json'|'html'|'css'|'python'|'sql'|'yaml'|'markdown';
export type CodeSnippet={version:1,title:string,language:CodeLanguage,code:string,theme:'dark'|'light',showLineNumbers:boolean,wrapLines:boolean};
export const SNIPPET_LANGUAGES:readonly [CodeLanguage,string][];
export const SNIPPET_THEMES:readonly string[];
export function defaultCodeSnippet():CodeSnippet;
export function normalizeCodeSnippet(value:unknown):CodeSnippet;
export function renderCodeSnippet(value:unknown):string;
export function activateCodeBlocks(root:unknown):void;
