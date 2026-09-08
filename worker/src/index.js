import { createRouteDispatcher } from './routes/index.js';
import { corsHeaders, json } from './http.js';
import { isTwitchConfigured, getTwitchChannel, getTwitchClips, getTwitchData, getTwitchStreamStatus, getTwitchVideos } from '../../integrations/twitch/client.js';
import { getTwitchStatistics } from '../../integrations/twitch/statistics.js';

// Route ownership lives in worker/src/routes/*.js. Keep the public route
// contract explicit here so tooling and maintainers can audit it centrally.
// /health /health/storage /integrations/status /site-state /youtube/channel
// /twitch/status /twitch/channel /twitch/statistics /twitch/videos /twitch/clips /twitch/data
// /admin/auth/login /admin/auth/check /admin/auth/logout /admin/settings /admin/audit
// Integration ownership: twitch / youtube / tiktok (registry-driven).

const dispatch = createRouteDispatcher({
  json,
  corsHeaders,
  isTwitchConfigured,
  twitch: { getTwitchChannel, getTwitchClips, getTwitchData, getTwitchStreamStatus, getTwitchVideos, getTwitchStatistics },
});

export default {
  fetch(request, env) {
    return dispatch(request, env);
  },
};
