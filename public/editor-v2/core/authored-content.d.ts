export function validateElementContent(node: any): void;
export function validatePageForPublication(page:any):void;
export function normalizeElementContent(node: any, patch: Record<string, unknown>): Record<string, unknown>;
export function safeMediaUrl(value: unknown): string;
export const CONTENT_TYPES: readonly string[];

export function imageFocalPosition(item?: {focalPoint?: unknown; focalX?: unknown; focalY?: unknown}): {focalX:number; focalY:number};
export function getPublicationContentIssue(node: any): string | null;
