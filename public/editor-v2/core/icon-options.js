/* Shared, self-contained icon set. Unicode glyphs avoid third-party asset and font dependencies. */
export const ICON_CHOICES=Object.freeze([
 {id:'star',label:'Csillag',glyph:'★'},
 {id:'heart',label:'Szív',glyph:'♥'},
 {id:'check',label:'Pipa',glyph:'✓'},
 {id:'bolt',label:'Villám',glyph:'⚡'},
 {id:'play',label:'Lejátszás',glyph:'▶'},
 {id:'sparkles',label:'Ragyogás',glyph:'✦'},
 {id:'video',label:'Videó',glyph:'▣'},
 {id:'calendar',label:'Naptár',glyph:'▦'},
 {id:'chat',label:'Üzenet',glyph:'☏'},
 {id:'link',label:'Hivatkozás',glyph:'↗'}
]);
export const iconById=id=>ICON_CHOICES.find(icon=>icon.id===id)||ICON_CHOICES[0];
export const isSupportedIcon=id=>ICON_CHOICES.some(icon=>icon.id===id);
