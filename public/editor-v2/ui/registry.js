export function createRegistry() {
  const entries = new Map();
  return {
    register(key, value) {
      if (!key || entries.has(key)) throw new Error(`Registry key already exists: ${key}`);
      entries.set(key, value);
      return value;
    },
    get(key) { return entries.get(key); },
    has(key) { return entries.has(key); },
    list() { return [...entries.entries()]; },
  };
}

export const panelRegistry = createRegistry();
export const featureRegistry = createRegistry();
export const commandRegistry = createRegistry();
