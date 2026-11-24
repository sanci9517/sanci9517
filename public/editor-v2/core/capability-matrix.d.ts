export type ElementCapabilityStatus = 'PARTIAL' | 'PLANNED';
export type PublicCapabilityStatus = 'PARTIAL' | 'PLANNED';

export type ElementCapability = Readonly<{
  status: ElementCapabilityStatus;
  canvas: boolean;
  inspector: ElementCapabilityStatus;
  public: PublicCapabilityStatus;
}>;

export const ELEMENT_CAPABILITIES: Readonly<Record<string, ElementCapability>>;
export function getElementCapability(type: unknown): ElementCapability;
export function getElementInspectorContract(type: unknown): Readonly<{
  type: string | null;
  status: ElementCapabilityStatus;
  acceptance: 'NOT_CERTIFIED';
  fields: readonly Readonly<Record<string, unknown>>[];
  groups: readonly string[];
}>;
