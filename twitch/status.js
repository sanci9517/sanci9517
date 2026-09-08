import { api } from '../core/api.js';

export async function loadTwitchStatus() { return api.get('/twitch/status'); }
export async function loadTwitchChannel() { return api.get('/twitch/channel'); }
export async function loadTwitchStatistics() { return api.get('/twitch/statistics'); }
export async function loadTwitchData() { return api.get('/twitch/data'); }
