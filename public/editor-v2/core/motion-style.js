// The Editor and public renderer share this narrow motion allowlist so a
// malformed or legacy Page Model cannot opt into arbitrary animation names.
export const MOTION_STYLE_OPTIONS = Object.freeze({
  animationName: Object.freeze(['none','sanci-entry-fade','sanci-entry-rise','sanci-entry-scale']),
  animationDuration: Object.freeze(['180ms','280ms','420ms']),
  animationTimingFunction: Object.freeze(['ease-out','cubic-bezier(0.22,1,0.36,1)'])
});
export const MOTION_TRIGGER_OPTIONS = Object.freeze(['on-load','in-view']);

export function isAllowlistedMotionStyle(property, value) {
  const options=MOTION_STYLE_OPTIONS[property];
  return !options || typeof value==='string'&&options.includes(value);
}

// A trigger is metadata, never arbitrary CSS. Only a known finite entrance
// animation may opt into view-timeline behavior; legacy/invalid values retain
// the normal visible-content fallback.
export function motionTriggerForStyle(style = {}) {
  return style?.motionTrigger === 'in-view' &&
    style.animationName !== 'none' &&
    isAllowlistedMotionStyle('animationName', style.animationName)
    ? 'in-view'
    : '';
}
