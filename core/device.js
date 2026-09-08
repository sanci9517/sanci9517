// Mobile fallback for Android browsers that have "Desktop site" enabled.
// The existing mobile CSS remains the source of truth; this only activates
// its equivalent fallback when the browser reports a desktop-style viewport.
export function initDeviceClass() {
  const root = document.documentElement;
  const update = () => {
    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    const touch = Number(navigator.maxTouchPoints || 0) > 0;
    const android = /Android/i.test(ua) || /Android/i.test(platform);
    const iphoneOrIpad = /iPhone|iPad|iPod/i.test(ua);
    const smallScreen = Math.min(window.screen?.width || 9999, window.screen?.height || 9999) <= 760;
    const mobileDevice = touch && (android || iphoneOrIpad || smallScreen);

    root.classList.toggle('mobile-device', mobileDevice);

    if (mobileDevice) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) viewport.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    }
  };

  update();
  window.addEventListener('resize', update, { passive: true });
}
