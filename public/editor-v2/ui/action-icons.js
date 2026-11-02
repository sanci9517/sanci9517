/*
 * Curated Lucide Icons 1.66.0 geometry. Source: lucide-icons/lucide,
 * tag 1.66.0 (a630cec77eac6568b989e87e4947a8bfe45caacd).
 * See docs/licenses/lucide-icons-1.66.0.txt for ISC/MIT notices.
 */
const iconShapes=Object.freeze({
  'panel-left-open':[['rect',{width:'18',height:'18',x:'3',y:'3',rx:'2'}],['path',{d:'M9 3v18'}],['path',{d:'m14 9 3 3-3 3'}]],
  'panel-left-close':[['rect',{width:'18',height:'18',x:'3',y:'3',rx:'2'}],['path',{d:'M9 3v18'}],['path',{d:'m16 15-3-3 3-3'}]],
  'panel-right-open':[['rect',{width:'18',height:'18',x:'3',y:'3',rx:'2'}],['path',{d:'M15 3v18'}],['path',{d:'m10 15-3-3 3-3'}]],
  'panel-right-close':[['rect',{width:'18',height:'18',x:'3',y:'3',rx:'2'}],['path',{d:'M15 3v18'}],['path',{d:'m8 9 3 3-3 3'}]],
  'file-plus':[['path',{d:'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z'}],['path',{d:'M14 2v5a1 1 0 0 0 1 1h5'}],['path',{d:'M9 15h6'}],['path',{d:'M12 18v-6'}]],
  'undo-2':[['path',{d:'M9 14 4 9l5-5'}],['path',{d:'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11'}]],
  'redo-2':[['path',{d:'m15 14 5-5-5-5'}],['path',{d:'M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13'}]],
  eye:[['path',{d:'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'}],['circle',{cx:'12',cy:'12',r:'3'}]],
  files:[['path',{d:'M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8'}],['path',{d:'M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z'}],['path',{d:'M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1'}]],
  shapes:[['path',{d:'M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z'}],['rect',{x:'3',y:'14',width:'7',height:'7',rx:'1'}],['circle',{cx:'17.5',cy:'17.5',r:'3.5'}]],
  'layers-2':[['path',{d:'M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z'}],['path',{d:'m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845'}]],
  'calendar-days':[['path',{d:'M8 2v3'}],['path',{d:'M16 2v3'}],['rect',{x:'3',y:'3',width:'18',height:'18',rx:'2'}],['path',{d:'M3 9h18'}],...[[8,13],[12,13],[16,13],[8,17],[12,17],[16,17]].map(([x,y])=>['path',{d:`M${x} ${y}h.01`}])],
  route:[['circle',{cx:'6',cy:'19',r:'3'}],['path',{d:'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15'}],['circle',{cx:'18',cy:'5',r:'3'}]],
  'mouse-pointer-2':[['path',{d:'M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z'}]],
  hand:[['path',{d:'M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2'}],['path',{d:'M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2'}],['path',{d:'M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8'}],['path',{d:'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'}]],
  monitor:[['rect',{width:'20',height:'14',x:'2',y:'3',rx:'2'}],['line',{x1:'8',x2:'16',y1:'21',y2:'21'}],['line',{x1:'12',x2:'12',y1:'17',y2:'21'}]],
  tablet:[['rect',{width:'16',height:'20',x:'4',y:'2',rx:'2',ry:'2'}],['line',{x1:'12',x2:'12.01',y1:'18',y2:'18'}]],
  smartphone:[['rect',{width:'14',height:'20',x:'5',y:'2',rx:'2',ry:'2'}],['path',{d:'M12 18h.01'}]],
  maximize:[['path',{d:'M8 3H5a2 2 0 0 0-2 2v3'}],['path',{d:'M21 8V5a2 2 0 0 0-2-2h-3'}],['path',{d:'M3 16v3a2 2 0 0 0 2 2h3'}],['path',{d:'M16 21h3a2 2 0 0 0 2-2v-3'}]],
  'zoom-in':[['circle',{cx:'11',cy:'11',r:'8'}],['line',{x1:'21',x2:'16.65',y1:'21',y2:'16.65'}],['line',{x1:'11',x2:'11',y1:'8',y2:'14'}],['line',{x1:'8',x2:'14',y1:'11',y2:'11'}]],
  'zoom-out':[['circle',{cx:'11',cy:'11',r:'8'}],['line',{x1:'21',x2:'16.65',y1:'21',y2:'16.65'}],['line',{x1:'8',x2:'14',y1:'11',y2:'11'}]],
  save:[['path',{d:'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'}],['path',{d:'M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7'}],['path',{d:'M7 3v4a1 1 0 0 0 1 1h7'}]],
  'cloud-upload':[['path',{d:'M12 13v8'}],['path',{d:'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242'}],['path',{d:'m8 17 4-4 4 4'}]],
  globe:[['circle',{cx:'12',cy:'12',r:'10'}],['path',{d:'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20'}],['path',{d:'M2 12h20'}]],
  ellipsis:[['circle',{cx:'12',cy:'12',r:'1'}],['circle',{cx:'19',cy:'12',r:'1'}],['circle',{cx:'5',cy:'12',r:'1'}]],
  'sliders-horizontal':[['line',{x1:'21',x2:'14',y1:'4',y2:'4'}],['line',{x1:'10',x2:'3',y1:'4',y2:'4'}],['line',{x1:'21',x2:'12',y1:'12',y2:'12'}],['line',{x1:'8',x2:'3',y1:'12',y2:'12'}],['line',{x1:'21',x2:'16',y1:'20',y2:'20'}],['line',{x1:'12',x2:'3',y1:'20',y2:'20'}],['line',{x1:'14',x2:'14',y1:'2',y2:'6'}],['line',{x1:'8',x2:'8',y1:'10',y2:'14'}],['line',{x1:'16',x2:'16',y1:'18',y2:'22'}]],
  radio:[['path',{d:'M4.9 19.1C1 15.2 1 8.8 4.9 4.9'}],['path',{d:'M7.8 16.2a6 6 0 0 1 0-8.4'}],['circle',{cx:'12',cy:'12',r:'2'}],['path',{d:'M16.2 7.8a6 6 0 0 1 0 8.4'}],['path',{d:'M19.1 4.9a10 10 0 0 1 0 14.2'}]],
  combine:[['path',{d:'M14 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1'}],['path',{d:'M19 3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1'}],['path',{d:'m7 15 3 3'}],['path',{d:'m7 21 3-3H5a2 2 0 0 1-2-2v-2'}],['rect',{x:'14',y:'14',width:'7',height:'7',rx:'1'}],['rect',{x:'3',y:'3',width:'7',height:'7',rx:'1'}]],
  ungroup:[['rect',{x:'11',y:'14',width:'10',height:'7',rx:'2'}],['rect',{x:'3',y:'3',width:'10',height:'7',rx:'2'}]],
  'arrow-up':[['path',{d:'m5 12 7-7 7 7'}],['path',{d:'M12 19V5'}]],
  'arrow-down':[['path',{d:'M12 5v14'}],['path',{d:'m19 12-7 7-7-7'}]],
  'corner-up-right':[['path',{d:'m15 14 5-5-5-5'}],['path',{d:'M4 20v-7a4 4 0 0 1 4-4h12'}]],
  'corner-down-left':[['path',{d:'m9 14-5-5 5-5'}],['path',{d:'M20 20v-7a4 4 0 0 0-4-4H4'}]],
});

export const EDITOR_ICON_NAMES=Object.freeze(Object.keys(iconShapes));

export function createEditorIcon(name,documentRef=globalThis.document){
  const shapes=iconShapes[name];
  if(!shapes)throw new Error(`Unknown editor icon: ${name}`);
  if(!documentRef)throw new Error('A document is required to render Editor icons');
  const svg=documentRef.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('fill','none');
  svg.setAttribute('stroke','currentColor');
  svg.setAttribute('stroke-width','2');
  svg.setAttribute('stroke-linecap','round');
  svg.setAttribute('stroke-linejoin','round');
  svg.setAttribute('focusable','false');
  svg.setAttribute('aria-hidden','true');
  for(const [tag,attributes] of shapes){
    const shape=documentRef.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [key,value] of Object.entries(attributes))shape.setAttribute(key,value);
    svg.append(shape);
  }
  return svg;
}
