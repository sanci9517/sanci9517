const VALID_OWNER_ID=/^[A-Za-z0-9_-]{1,96}$/u;

/** Return an account-owned browser key without ever falling back to an unowned cache. */
export function workspacePreferenceStorageKey(baseKey,userId){
  if(typeof baseKey!=='string'||!baseKey||typeof userId!=='string'||!VALID_OWNER_ID.test(userId))return null;
  return `${baseKey}:user:${encodeURIComponent(userId)}`;
}
