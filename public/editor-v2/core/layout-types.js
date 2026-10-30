// One shared list drives both layout preset eligibility and container-level
// Flex/Grid Inspector fields, so their type contracts cannot drift apart.
export const LAYOUT_TYPES = Object.freeze([
  'section','container','row','columns','flex','grid','stack','group','slot',
  'card','panel','navbar','menu','footer','sidebar','absolute','sticky','overlay'
]);
