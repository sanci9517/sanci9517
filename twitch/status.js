import { api } from '../core/api.js';

export async function loadTwitchStatus() {
  return api.get('/twitch/status');
}
