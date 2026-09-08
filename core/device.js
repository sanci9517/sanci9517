// Mobile fallback for Android/iOS browsers that report a desktop-style user agent.
// The existing mobile CSS remains the source of truth; this only activates
// its equivalent fallback when the browser is physically touch-oriented.
export function initDeviceClass() {
  const root = document.documentElement;

  const update = () => {
    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    const touch = Number(navigator.maxTouchPoints || 0) > 0;
    const android = /Android/i.test(ua) || /Android/i.test(platform);
    const iphoneOrIpad = /iPhone|iPad|iPod/i.test(ua);
    const coarsePointer = typeof window.matchMedia === 'function'
      && window.matchMedia('(pointer: coarse)').matches;
    const hoverNone = typeof window.matchMedia === 'function'
      && window.matchMedia('(hover: none)').matches;
    const devicePixelRatio = Math.max(Number(window.devicePixelRatio || 1), 1);
    const screenWidth = Number(window.screen?.width || 9999);
    const screenHeight = Number(window.screen?.height || 9999);
    const effectiveScreenWidth = Math.min(screenWidth, screenHeight) / devicePixelRatio;
    const smallPhysicalScreen = effectiveScreenWidth <= 760;

    // Android "Desktop site" can hide Android from the UA and report a wide
    // CSS viewport. Touch + coarse pointer or the physical screen size keeps
    // the public site in its mobile layout without changing the mobile CSS.
    const mobileDevice = touch && (
      android
      || iphoneOrIpad
      || (coarsePointer && hoverNone)
      || smallPhysicalScreen
    );

    root.classList.toggle('mobile-device', mobileDevice);

    if (mobileDevice) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1, viewport-fit=cover'
        );
      }
    }
  };

  update();
  window.addEventListener('resize', update, { passive: true });
}
