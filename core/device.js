// Mobile fallback for Android browsers that have "Desktop site" enabled.
// Normal responsive CSS remains the source of truth; this only mirrors the
// existing mobile breakpoint when the physical device is clearly touch/mobile.
export function initDeviceClass() {
  const root = document.documentElement;
  const update = () => {
    const ua = navigator.userAgent || '';
    const touch = navigator.maxTouchPoints > 0;
    const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
    const smallScreen = Math.min(window.screen?.width || 9999, window.screen?.height || 9999) <= 760;
    root.classList.toggle('mobile-device', touch && (mobileUa || smallScreen));
  };

  update();
  window.addEventListener('resize', update, { passive: true });
}
