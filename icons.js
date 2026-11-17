// NA-47 Clean Vector SVG Icons
// Replaces emojis throughout the entire game with authentic phosphor/CRT vector SVGs
const GAME_ICONS = {
  // Combat, Hazards & Survival
  flame: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M12 23c-4.97 0-9-3.95-9-8.83 0-3.32 1.83-6.18 3.52-8.32.74-.93 1.5-1.78 2.08-2.61.42-.61.76-1.23.95-1.92.17.65.48 1.25.88 1.83.65.93 1.48 1.88 2.31 2.92C14.7 8.35 17 11.2 17 14.17c0 1.28-.27 2.47-.76 3.53-.44.96-1.07 1.8-1.85 2.48C13.56 22.37 12.8 23 12 23z"/></svg>',
  chai: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  shark: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M2 19c2.5-1.5 5-2 8-2 6 0 10 3 12 5-3-6-5-14-11-17-1 4-3 9-9 14z"/><path d="M2 21c3-1 6-1 10-1s7 1 10 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  lightning: '<svg class="game-icon" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  alert: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  siren: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v5l-2 2v2h16v-2l-2-2V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/></svg>',
  flashlight: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M18 6l-3-3H9L6 6v3l3 3v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9l3-3V6z"/><line x1="6" y1="6" x2="18" y2="6"/></svg>',
  wifi: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  wifiCut: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  phone: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/></svg>',
  hammer: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M21 7.28l-4.28-4.28a1.5 1.5 0 0 0-2.12 0l-1.42 1.42 4.28 4.28 1.42-1.42a1.5 1.5 0 0 0 0-2.12zM12.46 5.84L2.88 15.42a1.5 1.5 0 0 0 0 2.12l3.58 3.58a1.5 1.5 0 0 0 2.12 0l9.58-9.58-5.7-5.7z"/></svg>',
  doc: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  upload: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>',
  hand: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"/></svg>',
  check: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
  skip: '<svg class="game-icon" viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2.5"/></svg>',
  close: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  eye: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  lock: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  skull: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.62 6.24 4.12 8.04V22h3v-2h2v2h2v-2h2v2h3v-1.96C20.38 18.24 22 15.31 22 12c0-5.52-4.48-10-10-10zm-3 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>',
  speaker: '<svg class="game-icon" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  speakerMute: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',
  monitor: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  battery: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><rect x="1" y="6" width="18" height="12" rx="2" ry="2"/><line x1="23" y1="11" x2="23" y2="13"/><rect x="4" y="9" width="6" height="6" fill="currentColor" stroke="none"/></svg>',
  glasses: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><circle cx="6" cy="14" r="4"/><circle cx="18" cy="14" r="4"/><path d="M10 14h4"/><path d="M2 14L4 6"/><path d="M22 14l-2-8"/></svg>',
  door: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M3 21h18M5 21V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v18"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>',
  bell: '<svg class="game-icon" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 0-6 6v5l-2 2v2h16v-2l-2-2V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3z"/></svg>',
  crt: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="14" rx="3"/><line x1="7" y1="21" x2="17" y2="21"/><line x1="12" y1="18" x2="12" y2="21"/><circle cx="17.5" cy="8.5" r="1" fill="currentColor"/><circle cx="17.5" cy="13.5" r="1" fill="currentColor"/></svg>',
  shake: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M2 12h3l2-5 4 10 3-7 2 4 2-2h4"/></svg>',
  stop: '<svg class="game-icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
  sun: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  pen: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>',
  search: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  user: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  rotate: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
  disk: '<svg class="game-icon-stroke" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>'
};

// Auto icon detection helper for game toasts
function getToastIcon(msg) {
  if (!msg) return '';
  const m = String(msg).toUpperCase();
  if (m.includes('CHAI')) return GAME_ICONS.flame;
  if (m.includes('SHARK')) return GAME_ICONS.shark;
  if (m.includes('POWER') || m.includes('WIRE') || m.includes('SABOTAGE') || m.includes('GRID')) return GAME_ICONS.lightning;
  if (m.includes('WIFI') || m.includes('LINK')) return GAME_ICONS.wifi;
  if (m.includes('FLASH')) return GAME_ICONS.flashlight;
  if (m.includes('REPAIR') || m.includes('RESTORED') || m.includes('SECURED') || m.includes('100%') || m.includes('NOMINAL')) return GAME_ICONS.check;
  if (m.includes('PEEK')) return GAME_ICONS.eye;
  if (m.includes('LEFT') || m.includes('LOCK')) return GAME_ICONS.lock;
  if (m.includes('KHAKI') || m.includes('BABU') || m.includes('SLAM') || m.includes('SPOTTED') || m.includes('POUNDING') || m.includes('FOOTSTEPS') || m.includes('CHARGING') || m.includes('CUT')) return GAME_ICONS.alert;
  return '';
}

if (typeof window !== 'undefined') {
  window.GAME_ICONS = GAME_ICONS;
  window.getToastIcon = getToastIcon;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GAME_ICONS, getToastIcon };
}
