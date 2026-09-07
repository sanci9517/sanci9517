export const CONTROL_CENTER_MODULES = Object.freeze([
  { id: 'overview', title: 'Áttekintés', description: 'Teljes Sanci9517 állapot és legfontosabb mutatók.', icon: '⌂', group: 'core' },
  { id: 'website', title: 'Weboldal / Brand', description: 'Oldalak, menük, szövegek, blokkok és publikált tartalom.', icon: '◫', group: 'brand' },
  { id: 'twitch', title: 'Twitch', description: 'Csatorna, live, VOD, klipek, statisztikák és későbbi teljes API-kezelés.', icon: '◈', group: 'platform' },
  { id: 'youtube', title: 'YouTube', description: 'Csatorna, videók, Shorts, live és statisztikák.', icon: '▶', group: 'platform' },
  { id: 'tiktok', title: 'TikTok', description: 'Profil, videók, live és elérhető statisztikák.', icon: '♪', group: 'platform' },
  { id: 'analytics', title: 'Analytics', description: 'Összesített brand- és platformnövekedés.', icon: '▥', group: 'insights' },
  { id: 'system', title: 'Rendszer', description: 'Worker, D1, KV, API-k, cache és rendszerállapot.', icon: '⚙', group: 'system' },
  { id: 'security', title: 'Biztonság', description: 'Admin munkamenet, hozzáférések, audit és biztonsági állapot.', icon: '◆', group: 'system' },
  { id: 'tests', title: 'Test Center', description: 'A teljes rendszer és minden integráció ellenőrzése.', icon: '✓', group: 'system' },
  { id: 'settings', title: 'Beállítások', description: 'Admin és rendszerbeállítások, szerveroldali mentéssel.', icon: '☷', group: 'system' },
  { id: 'ai', title: 'SANCI AI', description: 'Előkészített hely a későbbi AI asszisztensnek.', icon: '✦', group: 'future' },
]);

export function getControlCenterModule(id) {
  return CONTROL_CENTER_MODULES.find(module => module.id === id) || null;
}
