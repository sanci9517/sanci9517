import { createRouteDispatcher } from './routes/index.js';
import { corsHeaders, json } from './http.js';
import { isTwitchConfigured, getTwitchChannel, getTwitchClips, getTwitchData, getTwitchStreamStatus, getTwitchVideos } from '../../integrations/twitch/client.js';
import { getTwitchStatistics } from '../../integrations/twitch/statistics.js';

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
