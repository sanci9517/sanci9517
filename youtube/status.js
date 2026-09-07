import { api } from '../core/api.js';

export async function loadYouTubeChannel() {
  return api.get('/youtube/channel');
}

export async function loadIntegrationStatus() {
  return api.get('/integrations/status');
}
