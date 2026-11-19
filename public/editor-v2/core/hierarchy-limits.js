// Recursive Editor consumers (notably the layer tree) require a bounded page
// model depth. Keep the client and Worker Publish validator on one contract.
export const MAX_PAGE_HIERARCHY_DEPTH = 128;
