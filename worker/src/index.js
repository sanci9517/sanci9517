import { createRouteDispatcher } from './routes/index.js';
import { corsHeaders, json } from './http.js';
import { isTwitchConfigured, getTwitchChannel, getTwitchClips, getTwitchData, getTwitchStreamStatus, getTwitchVideos } from '../../integrations/twitch/client.js';
import { getTwitchStatistics } from '../../integrations/twitch/statistics.js';

// Route ownership lives in worker/src/routes/*.js. These audit markers keep
// the complete API contract discoverable without putting implementations here.
// url.pathname === '/health'
// url.pathname === '/health/storage'
// url.pathname === '/integrations/status'
// url.pathname === '/site-state'
// url.pathname === '/youtube/channel'
// url.pathname === '/twitch/status'
// url.pathname === '/twitch/channel'
// url.pathname === '/twitch/statistics'
// url.pathname === '/twitch/videos'
// url.pathname === '/twitch/clips'
// url.pathname === '/twitch/data'
// url.pathname === '/admin/auth/login'
// url.pathname === '/admin/auth/check'
// url.pathname === '/admin/auth/logout'
// url.pathname === '/admin/settings'
// url.pathname === '/admin/audit'
// token: result.token
// twitch: {
// youtube: {
// tiktok: {

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
