import { logoutAdmin } from './auth.js';
import { getAdminAudit, getAdminSettings, saveAdminSettings } from './backend.js';
import { renderWebsiteAdmin } from './website/index.js';
import { CONTROL_CENTER_MODULES } from './modules/registry.js';
import { loadIntegrationStatus, loadSystemHealth, loadTwitchClips, loadTwitchOverview, loadTwitchVideos } from './modules/platform.js';
import { runControlCenterTests } from './modules/tests.js';

export function renderAdminDashboard(root) { renderShell(root); bindShell(root); loadOverview(root); }

