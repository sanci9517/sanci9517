export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && !specifier.match(/\.[a-zA-Z0-9]+$/)) {
    try { return await nextResolve(`${specifier}.ts`, context); } catch {}
  }
  return nextResolve(specifier, context);
}
