// Backward-compatible entry point. All admin backend requests now use the
// bearer-aware client so every caller shares the same authenticated transport.
export { getAdminSettings, saveAdminSettings, getAdminAudit } from './backend-auth.js';
