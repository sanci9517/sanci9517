/*
 * Sanci9517 Visual Editor v2 — Property Registry
 *
 * The registry is the extensibility boundary for the Inspector. New editable
 * properties should be added here instead of creating another hardcoded
 * Inspector branch. Rendering and mutation remain owned by the Core command API.
 */

const groups = Object.freeze([
  { id: 'content', label: 'Tartalom', order: 10 },
  { id: 'layout', label: 'Elrendezés', order: 20 },
  { id: 'size', label: 'Méret', order: 30 },
  { id: 'spacing', label: 'Térközök', order: 40 },
  { id: 'flex', label: 'Flex', order: 50 },
  { id: 'grid', label: 'Grid', order: 60 },
  { id: 'position', label: 'Pozíció', order: 70 },
  { id: 'typography', label: 'Tipográfia', order: 80 },
  { id: 'background', label: 'Háttér', order: 90 },
  { id: 'border', label: 'Szegély', order: 100 },
  { id: 'radius', label: 'Lekerekítés', order: 110 },
  { id: 'shadow', label: 'Árnyék', order: 120 },
  { id: 'opacity', label: 'Átlátszóság', order: 130 },
  { id: 'transform', label: 'Transzformáció', order: 140 },
  { id: 'filter', label: 'Szűrők', order: 150 },
  { id: 'animation', label: 'Animáció', order: 160 },
  { id: 'interaction', label: 'Interakció', order: 170 },
  { id: 'responsive', label: 'Responsive', order: 180 },
  { id: 'accessibility', label: 'Akadálymentesítés', order: 190 },
  { id: 'seo', label: 'SEO', order: 200 },
  { id: 'data', label: 'Adat', order: 210 },
  { id: 'advanced', label: 'Haladó', order: 220 }
]);

const properties = [
  { id: 'content.text', key: 'text', group: 'content', label: 'Szöveg', type: 'text', command: 'element.content.set', appliesTo: ['heading', 'text', 'button', 'link'] },
  { id: 'content.href', key: 'href', group: 'content', label: 'Link / URL', type: 'url', command: 'content.properties.set', appliesTo: ['link', 'button'] },
  { id: 'size.width', key: 'width', group: 'size', label: 'Szélesség', type: 'dimension', units: ['auto', 'px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.height', key: 'height', group: 'size', label: 'Magasság', type: 'dimension', units: ['auto', 'px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.minWidth', key: 'minWidth', group: 'size', label: 'Min. szélesség', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.maxWidth', key: 'maxWidth', group: 'size', label: 'Max. szélesség', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.minHeight', key: 'minHeight', group: 'size', label: 'Min. magasság', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.maxHeight', key: 'maxHeight', group: 'size', label: 'Max. magasság', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'spacing.margin', key: 'margin', group: 'spacing', label: 'Külső térköz', type: 'box', responsive: true, command: 'responsive.set' },
  { id: 'spacing.padding', key: 'padding', group: 'spacing', label: 'Belső térköz', type: 'box', responsive: true, command: 'responsive.set' },
  { id: 'layout.display', key: 'display', group: 'layout', label: 'Megjelenítés', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'none'], responsive: true, command: 'responsive.set' },
  { id: 'layout.overflow', key: 'overflow', group: 'layout', label: 'Túlcsordulás', type: 'select', options: ['visible', 'hidden', 'auto', 'scroll'], responsive: true, command: 'responsive.set' },
  { id: 'position.position', key: 'position', group: 'position', label: 'Pozícionálás', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], responsive: true, command: 'responsive.set' },
  { id: 'position.x', key: 'x', group: 'position', label: 'X pozíció', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'position.y', key: 'y', group: 'position', label: 'Y pozíció', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'position.zIndex', key: 'zIndex', group: 'position', label: 'Z-index', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'typography.fontFamily', key: 'fontFamily', group: 'typography', label: 'Betűtípus', type: 'font', responsive: true, command: 'responsive.set' },
  { id: 'typography.fontSize', key: 'fontSize', group: 'typography', label: 'Betűméret', type: 'dimension', units: ['px', 'rem', 'em', 'vw'], responsive: true, command: 'responsive.set' },
  { id: 'typography.fontWeight', key: 'fontWeight', group: 'typography', label: 'Vastagság', type: 'select', options: ['300', '400', '500', '600', '700', '800', '900'], responsive: true, command: 'responsive.set' },
  { id: 'typography.fontStyle', key: 'fontStyle', group: 'typography', label: 'Dőlt betű', type: 'select', options: ['normal', 'italic'], responsive: true, command: 'responsive.set' },
  { id: 'typography.lineHeight', key: 'lineHeight', group: 'typography', label: 'Sormagasság', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'typography.letterSpacing', key: 'letterSpacing', group: 'typography', label: 'Betűköz', type: 'dimension', units: ['px', 'rem', 'em'], responsive: true, command: 'responsive.set' },
  { id: 'typography.textAlign', key: 'textAlign', group: 'typography', label: 'Igazítás', type: 'select', options: ['left', 'center', 'right', 'justify'], responsive: true, command: 'responsive.set' },
  { id: 'typography.textTransform', key: 'textTransform', group: 'typography', label: 'Kis- és nagybetűk', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'], responsive: true, command: 'responsive.set' },
  { id: 'typography.textDecoration', key: 'textDecoration', group: 'typography', label: 'Szöveg aláhúzása', type: 'select', options: ['none', 'underline', 'line-through', 'overline'], responsive: true, command: 'responsive.set' },
  { id: 'typography.color', key: 'color', group: 'typography', label: 'Szöveg alapszíne', type: 'color', help: 'Az egész elem szövegének színe. A Rich Texten belül külön színezett szavak megtartják saját színüket; a kijelölt szövegrész formázásának törlésével visszatérhetsz ehhez az alaphoz.', responsive: true, command: 'responsive.set' },
  { id: 'typography.textWrap', key: 'textWrap', group: 'typography', label: 'Sortörés módja', type: 'select', options: ['wrap','balance','pretty','nowrap'], optionLabels:{wrap:'Normál tördelés',balance:'Kiegyensúlyozott címsor',pretty:'Szebb bekezdéstördelés',nowrap:'Egyetlen sor'}, help:'A kiegyensúlyozott tördelés a címsor sorait hasonló hosszúságúra alakítja. A szebb tördelés a bekezdés végén kerüli a magányos szavakat. A böngésző támogatásától függ; az egyetlen sor keskeny mobilon kilóghat.', responsive:true, command:'responsive.set' },
  { id: 'typography.overflowWrap', key:'overflowWrap', group:'typography', label:'Hosszú szavak törése', type:'select', options:['normal','anywhere','break-word'], optionLabels:{normal:'Normál szóhatárok',anywhere:'Szükség esetén bárhol','break-word':'Kilógó szó törése'}, help:'Hosszú címek, felhasználónevek és URL-ek ne tolják szét a kártyát. A „Szükség esetén bárhol” lehetővé teszi a hosszú szó megtörését, ha másképp nem férne el a rendelkezésre álló szélességben.',responsive:true,command:'responsive.set' },
  { id:'typography.wordSpacing',key:'wordSpacing',group:'typography',label:'Szóközök távolsága',type:'dimension',units:['px','rem','em'],responsive:true,command:'responsive.set' },
  { id:'typography.textIndent',key:'textIndent',group:'typography',label:'Első sor behúzása',type:'dimension',units:['px','rem','em','%'],responsive:true,command:'responsive.set' },
  { id:'typography.textShadow',key:'textShadow',group:'typography',label:'Szövegárnyék',type:'select',options:['none','0 2px 8px #0006','0 4px 16px #000a','0 0 16px #7c3aed80'],optionLabels:{none:'Nincs','0 2px 8px #0006':'Finom kontraszt','0 4px 16px #000a':'Videó feletti kiemelés','0 0 16px #7c3aed80':'Lila fényudvar'},help:'A betűk mögé ad árnyékot, például fotó vagy videó feletti felirat olvashatóságához. Az árnyék nem helyettesíti a megfelelő színkontrasztot; mobilon is ellenőrizd az olvashatóságot.',responsive:true,command:'responsive.set' },
  { id: 'background.color', key: 'backgroundColor', group: 'background', label: 'Háttérszín', type: 'color', responsive: true, command: 'responsive.set' },
  { id: 'background.image', key: 'backgroundAssetId', group: 'background', label: 'Háttérkép', type: 'asset', responsive: true, command: 'responsive.set', help:'A webhely Médiatárából választott kép dekoratív háttérként jelenik meg. Asztali, tablet és mobil nézetben külön képet választhatsz, vagy örökölheted a szélesebb nézetét. A Kép eltávolítása csak az aktuális nézeten rejti el az örökölt képet; az Öröklés visszaállítása újra megjelenítheti. A mentés nem publikál.' },
  { id: 'background.size', key: 'backgroundSize', group: 'background', label: 'Háttérkép illesztése', type: 'select', options:['cover','contain','auto'], optionLabels:{cover:'Kitöltés, képkivágással',contain:'Teljes kép megjelenítése',auto:'Eredeti méret'}, responsive:true, command:'responsive.set', help:'A Kitöltés befedi az elemet, de levághat a kép széleiből. A Teljes kép minden részt megmutat; üres sávok maradhatnak. Nézetenként külön állítható.' },
  { id: 'background.position', key: 'backgroundPosition', group: 'background', label: 'Háttérkép fókusza', type: 'select', options:['center center','center top','center bottom','left center','right center'], optionLabels:{'center center':'Középen','center top':'Fent középen','center bottom':'Lent középen','left center':'Bal középen','right center':'Jobb középen'}, responsive:true, command:'responsive.set', help:'Megadja, a kép melyik részét tartsuk szem előtt, amikor a Kitöltés levágja a széleit. Például portrénál a Fent középen választás segít, hogy az arc mobilon is látható maradjon.' },
  { id: 'background.repeat', key: 'backgroundRepeat', group: 'background', label: 'Háttérkép ismétlése', type: 'select', options:['no-repeat','repeat','repeat-x','repeat-y'], optionLabels:{'no-repeat':'Ne ismétlődjön',repeat:'Minden irányban','repeat-x':'Vízszintesen','repeat-y':'Függőlegesen'}, responsive:true, command:'responsive.set', help:'Az ismétlés kis mintázatképeknél hasznos: a minta vízszintesen, függőlegesen vagy mindkét irányban folytatódhat. Fotóhoz a Ne ismétlődjön beállítás ajánlott, és a Kitöltés illesztés gyakran jobb.' },
  { id: 'border.width', key: 'borderWidth', group: 'border', label: 'Szegélyvastagság', type: 'dimension', units: ['0', 'px'], responsive: true, command: 'responsive.set' },
  { id: 'border.style', key: 'borderStyle', group: 'border', label: 'Szegélystílus', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'], responsive: true, command: 'responsive.set' },
  { id: 'border.color', key: 'borderColor', group: 'border', label: 'Szegélyszín', type: 'color', responsive: true, command: 'responsive.set' },
  { id: 'radius.all', key: 'borderRadius', group: 'radius', label: 'Lekerekítés', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.topLeft', key: 'borderTopLeftRadius', group: 'radius', label: 'Bal felső sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.topRight', key: 'borderTopRightRadius', group: 'radius', label: 'Jobb felső sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.bottomRight', key: 'borderBottomRightRadius', group: 'radius', label: 'Jobb alsó sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.bottomLeft', key: 'borderBottomLeftRadius', group: 'radius', label: 'Bal alsó sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'shadow.box', key: 'boxShadow', group: 'shadow', label: 'Árnyék', type: 'shadow', responsive: true, command: 'responsive.set' },
  { id: 'opacity.value', key: 'opacity', group: 'opacity', label: 'Átlátszóság', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.direction', key: 'flexDirection', group: 'flex', label: 'Irány', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.justify', key: 'justifyContent', group: 'flex', label: 'Elosztás a főirány mentén', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.align', key: 'alignItems', group: 'flex', label: 'Elemek igazítása', type: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.wrap', key: 'flexWrap', group: 'flex', label: 'Tördelés', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.gap', key: 'gap', group: 'flex', label: 'Elemköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['flex','row','columns','stack','grid'], responsive: true, command: 'responsive.set' },
  { id: 'flex.grow', key: 'flexGrow', group: 'flex', label: 'Növekedés', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.shrink', key: 'flexShrink', group: 'flex', label: 'Zsugorodás', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.basis', key: 'flexBasis', group: 'flex', label: 'Alapméret', type: 'dimension', units: ['auto', 'px', '%', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'flex.alignSelf', key: 'alignSelf', group: 'flex', label: 'Saját igazítás', type: 'select', options: ['auto', 'stretch', 'flex-start', 'center', 'flex-end', 'baseline'], responsive: true, command: 'responsive.set' },
  { id: 'grid.columns', key: 'gridTemplateColumns', group: 'grid', label: 'Oszlopok', type: 'select', options: ['1fr', 'minmax(0, 2fr) minmax(0, 1fr)', 'repeat(2, minmax(0, 1fr))', 'repeat(3, minmax(0, 1fr))', 'repeat(4, minmax(0, 1fr))'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.rows', key: 'gridTemplateRows', group: 'grid', label: 'Sorok', type: 'select', options: ['auto', '1fr', 'repeat(2, minmax(0, 1fr))', 'repeat(3, minmax(0, 1fr))'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.column', key: 'gridColumn', group: 'grid', label: 'Oszlophely', type: 'select', options: ['auto', '1', '2', '3', '4', '1 / -1'], responsive: true, command: 'responsive.set' },
  { id: 'grid.row', key: 'gridRow', group: 'grid', label: 'Sorhely', type: 'select', options: ['auto', '1', '2', '3', '4', '1 / -1'], responsive: true, command: 'responsive.set' },
  { id: 'grid.rowGap', key: 'rowGap', group: 'grid', label: 'Sorköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.columnGap', key: 'columnGap', group: 'grid', label: 'Oszlopköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  {id:'size.aspectRatio',key:'aspectRatio',group:'size',label:'Oldalarány',type:'select',options:['auto','1 / 1','16 / 9','4 / 3','3 / 4'],responsive:true,command:'responsive.set',help:'A szélesség és magasság arányát szabályozza. Rögzített szélesség és magasság mellett azok az értékek az irányadók. Telefonon külön felülírható.'},
  {id:'transform.rotate',key:'rotate',group:'transform',label:'Forgatás',type:'dimension',units:['deg'],responsive:true,command:'responsive.set',help:'Az elemet a középpontja körül forgatja, fokban megadva (-360–360). A normál elrendezésben elfoglalt helyét nem változtatja meg; figyeld az átfedéseket és a vászon szélét.'},
  {id:'transform.scale',key:'scale',group:'transform',label:'Vizuális nagyítás',type:'number',responsive:true,command:'responsive.set',help:'1 az eredeti méret, 1.1 tíz százalékkal nagyobb, 0.9 kisebb. Csak a vizuális méret változik, a szomszédos elemek helye megmarad. .1–4 tartományban állítható.'},
  {id:'filter.effect',key:'filter',group:'filter',label:'Képhatás',type:'select',options:['none','grayscale(1)','sepia(.7)','blur(2px)','contrast(1.2)','brightness(1.15)'],optionLabels:{none:'Nincs','grayscale(1)':'Fekete-fehér','sepia(.7)':'Meleg tónus','blur(2px)':'Finom elmosás','contrast(1.2)':'Erősebb kontraszt','brightness(1.15)':'Világosítás'},responsive:true,command:'responsive.set',help:'Vizuális hatás az egész elemre és gyermekeire. Szövegen az elmosás ronthatja az olvashatóságot. Nem módosítja az eredeti médiafájlt.'},
  {id:'animation.transition',key:'transition',group:'animation',label:'Állapotváltás',type:'select',options:['none','all 180ms ease','all 300ms ease'],optionLabels:{none:'Azonnali','all 180ms ease':'Finom · 180 ms','all 300ms ease':'Lassabb · 300 ms'},responsive:true,command:'responsive.set',help:'A szín, méret és más vizuális állapotváltás átmenete. Csökkentett mozgást kérő eszközön a rendszer kikapcsolja az animációt.'},
  {id:'background.gradient',key:'backgroundImage',group:'background',label:'Háttérátmenet',type:'select',options:['none','linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)','linear-gradient(135deg, #111827 0%, #475569 100%)','linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)','linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)'],optionLabels:{none:'Nincs','linear-gradient(135deg, #7047eb 0%, #17b8a6 100%)':'Alkotói lila–menta','linear-gradient(135deg, #111827 0%, #475569 100%)':'Éjféli grafit','linear-gradient(135deg, #fb7185 0%, #fbbf24 100%)':'Naplemente','linear-gradient(180deg, #ffffff 0%, #e0e7ff 100%)':'Világos levendula'},responsive:true,command:'responsive.set',help:'A háttérszín fölé, a kiválasztott háttérkép alá kerülő színátmenet. A Nincs csak az átmenetet kapcsolja ki, a Médiatár-kép külön mezőben törölhető.'},
  { id: 'advanced.nodeName', key: 'name', group: 'advanced', label: 'Elem neve', type: 'text', command: 'element.update' }
];

// Named, validated starting points are owned by the same registry as each
// property. The Inspector may show them inline, while a future token/preset
// module can consume this exact source without duplicating CSS semantics.
const presets = Object.freeze({
  'size.width': [['Auto','auto'],['Keskeny 320','320px'],['Tartalom 480','480px'],['Fél szélesség','50%'],['Kétharmad','66.6667%'],['Háromnegyed','75%'],['Teljes szélesség','100%'],['Tablet 768','768px'],['Laptop 1024','1024px'],['Asztali 1200','1200px']],
  'size.height': [['Auto','auto'],['Kompakt 120','120px'],['Közepes 240','240px'],['Szakasz 400','400px'],['Fél képernyő','50vh'],['Teljes képernyő','100vh']],
  'size.minWidth': [['320px','320px'],['480px','480px'],['640px','640px'],['768px','768px']],
  'size.maxWidth': [['640px','640px'],['768px','768px'],['1024px','1024px'],['1200px','1200px'],['1440px','1440px'],['Teljes','100%']],
  'size.minHeight': [['120px','120px'],['240px','240px'],['400px','400px'],['50vh','50vh']],
  'size.maxHeight': [['400px','400px'],['600px','600px'],['800px','800px'],['Teljes képernyő','100vh']],
  'position.position': [['Normál folyás','static'],['Mozgatható','relative'],['Réteg','absolute'],['Ragadós','sticky']],
  'position.x': [['0','0'],['Kis eltolás · 8','8px'],['Eltolás · 16','16px'],['Eltolás · 32','32px'],['Fél szélesség','50%']],
  'position.y': [['0','0'],['Kis eltolás · 8','8px'],['Eltolás · 16','16px'],['Eltolás · 32','32px'],['Fél magasság','50%']],
  'position.zIndex': [['Alap · 0','0'],['Réteg · 1','1'],['Fent · 10','10'],['Overlay · 100','100']],
  'spacing.margin': [['Nincs','0'],['XS · 4','4px'],['S · 8','8px'],['M · 16','16px'],['L · 24','24px'],['XL · 32','32px'],['Középre','0 auto']],
  'spacing.padding': [['Nincs','0'],['XS · 4','4px'],['S · 8','8px'],['M · 16','16px'],['L · 24','24px'],['XL · 32','32px'],['Szakasz · 48','48px'],['Kártya · 16/24','16px 24px']],
  'layout.display': [['Blokk','block'],['Egymás mellé','flex'],['Rács','grid']],
  'layout.overflow': [['Látható','visible'],['Levágás','hidden'],['Görgethető','auto']],
  'typography.fontSize': [['Apró · 12','12px'],['Kicsi · 14','14px'],['Törzs · 16','16px'],['Kiemelt · 20','20px'],['Alcím · 24','24px'],['Címsor · 32','32px'],['Nagy · 48','48px'],['Hero · 64','64px']],
  'typography.fontFamily': [['Rendszer','system-ui'],['Arial','Arial'],['Georgia','Georgia'],['Verdana','Verdana'],['Monospace','monospace']],
  'typography.fontWeight': [['Vékony · 300','300'],['Normál · 400','400'],['Közepes · 500','500'],['Félkövér · 600','600'],['Erős · 700','700'],['Extra · 800','800'],['Fekete · 900','900']],
  'typography.lineHeight': [['Szoros · 1.1','1.1'],['Cím · 1.25','1.25'],['Kompakt · 1.4','1.4'],['Kényelmes · 1.5','1.5'],['Laza · 1.75','1.75'],['Dupla · 2','2']],
  'typography.letterSpacing': [['Szoros · -0.5','-0.5px'],['Normál · 0','0'],['Nyitott · 0.5','0.5px'],['Tág · 1','1px']],
  'typography.textAlign': [['Balra','left'],['Középre','center'],['Jobbra','right'],['Sorkizárt','justify']],
  'background.color': [['Fehér','#ffffff'],['Világos','#f1f5f9'],['Palaszürke','#64748b'],['Sötét','#0f172a'],['Kék','#2563eb'],['Lila','#7c3aed'],['Áttetsző','transparent']],
  'border.width': [['Nincs','0'],['Vékony · 1','1px'],['Normál · 2','2px'],['Erős · 4','4px']],
  'border.style': [['Nincs','none'],['Folytonos','solid'],['Szaggatott','dashed'],['Pontozott','dotted']],
  'border.color': [['Sötét','#0f172a'],['Szürke','#94a3b8'],['Világos','#e2e8f0'],['Kék','#2563eb']],
  'radius.all': [['Éles · 0','0'],['Finom · 4','4px'],['Kártya · 8','8px'],['Lágy · 16','16px'],['Kerek · 24','24px'],['Pill · 999','999px']],
  'radius.topLeft': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.topRight': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.bottomRight': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.bottomLeft': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'shadow.box': [['Nincs','none'],['Finom','0 2px 8px #0003'],['Kártya','0 8px 24px #0005'],['Emelt','0 16px 48px #0007']],
  'opacity.value': [['Teljes · 100%','1'],['Halvány · 75%','0.75'],['Fél · 50%','0.5'],['Visszafogott · 25%','0.25']],
  'flex.direction': [['Sor','row'],['Oszlop','column']],
  'flex.justify': [['Kezdő','flex-start'],['Közép','center'],['Vég','flex-end'],['Közte elosztva','space-between'],['Egyenletes','space-evenly']],
  'flex.align': [['Nyújtás','stretch'],['Közép','center'],['Fent','flex-start'],['Lent','flex-end']],
  'flex.wrap': [['Egy sor','nowrap'],['Tördelés','wrap']],
  'flex.grow': [['Ne nőjön','0'],['Töltse ki a helyet','1'],['Kétszeres','2']],
  'flex.shrink': [['Ne zsugorodjon','0'],['Rugalmas','1'],['Erősebben zsugorodjon','2']],
  'flex.gap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']],
  'flex.basis': [['Automatikus','auto'],['25%','25%'],['50%','50%'],['75%','75%'],['Teljes','100%']],
  'flex.alignSelf': [['Szülőtől','auto'],['Nyújtás','stretch'],['Közép','center'],['Fent','flex-start'],['Lent','flex-end']],
  'grid.columns': [['1 oszlop','1fr'],['Tartalom és oldalsáv','minmax(0, 2fr) minmax(0, 1fr)'],['2 oszlop','repeat(2, minmax(0, 1fr))'],['3 oszlop','repeat(3, minmax(0, 1fr))'],['4 oszlop','repeat(4, minmax(0, 1fr))']],
  'grid.rows': [['Automatikus','auto'],['Egy sor','1fr'],['2 sor','repeat(2, minmax(0, 1fr))'],['3 sor','repeat(3, minmax(0, 1fr))']],
  'grid.column': [['Automatikus','auto'],['1. oszlop','1'],['2. oszlop','2'],['3. oszlop','3'],['4. oszlop','4'],['Teljes sor','1 / -1']],
  'grid.row': [['Automatikus','auto'],['1. sor','1'],['2. sor','2'],['3. sor','3'],['4. sor','4'],['Teljes oszlop','1 / -1']],
  'grid.rowGap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']],
  'grid.columnGap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']]
});

const frozenMetadataKeys = ['appliesTo','optionLabels','options','presets','units'];
const propertyMap = new Map(properties.map((property) => [property.id, freezeProperty({ ...property,
  presets: presets[property.id] ? Object.freeze(presets[property.id].map(([label,value])=>Object.freeze({label,value}))) : undefined
})]));
const groupMap = new Map(groups.map((group) => [group.id, Object.freeze({ ...group })]));

const propertyControlTypes = new Set(['asset','box','color','dimension','font','number','select','shadow','text','url']);
const propertyCommands = new Set(['content.properties.set','element.content.set','element.update','responsive.set']);
function freezeMetadata(value, path, ancestors = new WeakSet()) {
  if (value === null || ['string','number','boolean'].includes(typeof value)) return value;
  if (typeof value !== 'object') throw new TypeError(`${path} csak adatot tartalmazhat.`);
  if (ancestors.has(value)) throw new TypeError(`${path} nem tartalmazhat körkörös hivatkozást.`);
  ancestors.add(value);
  let result;
  if (Array.isArray(value)) {
    result = Object.freeze(value.map((entry,index)=>freezeMetadata(entry,`${path}[${index}]`,ancestors)));
  } else {
    const prototype=Object.getPrototypeOf(value);
    if (prototype!==Object.prototype && prototype!==null) throw new TypeError(`${path} csak egyszerű objektumot tartalmazhat.`);
    result=Object.freeze(Object.fromEntries(Object.entries(value).map(([key,entry])=>[key,freezeMetadata(entry,`${path}.${key}`,ancestors)])));
  }
  ancestors.delete(value);
  return result;
}

function freezeProperty(property, extra = {}) {
  const result={...property,...extra};
  for(const key of frozenMetadataKeys){
    if(Object.hasOwn(result,key)&&result[key]!==undefined)result[key]=freezeMetadata(result[key],`property.${key}`);
  }
  return Object.freeze(result);
}

export function listPropertyGroups() {
  return [...groups].sort((a, b) => a.order - b.order);
}

export function getProperty(id) {
  return propertyMap.get(id) ?? null;
}

export function listProperties({ group = null, nodeType = null } = {}) {
  return properties.filter((property) => {
    if (group && property.group !== group) return false;
    if (nodeType && Array.isArray(property.appliesTo) && !property.appliesTo.includes(nodeType)) return false;
    return true;
  }).map(property=>propertyMap.get(property.id));
}

export function getPropertyGroup(id) {
  return groupMap.get(id) ?? null;
}

export function registerProperty(property) {
  if (!property?.id || !property?.group) throw new Error('A property id és group kötelező.');
  if (typeof property.id!=='string'||typeof property.label!=='string'||!property.label.trim()) throw new Error('A property id és label nem üres szöveg kell legyen.');
  if (propertyMap.has(property.id)) throw new Error(`Property már létezik: ${property.id}`);
  if (!groupMap.has(property.group)) throw new Error(`Ismeretlen property group: ${property.group}`);
  if(!propertyControlTypes.has(property.type))throw new Error(`Ismeretlen Inspector control: ${property.type}`);
  if(!propertyCommands.has(property.command))throw new Error(`Ismeretlen Inspector command: ${property.command}`);
  if(property.responsive===true&&(!property.key||property.command!=='responsive.set'))throw new Error('A responsive property key és responsive.set command kötelező.');
  if(property.type==='select'&&(!Array.isArray(property.options)||property.options.length===0||property.options.some(option=>typeof option!=='string')))throw new Error('A select property nem üres, szöveges options listát igényel.');
  if(property.type==='dimension'&&(!Array.isArray(property.units)||property.units.length===0||property.units.some(unit=>typeof unit!=='string')))throw new Error('A dimension property nem üres, szöveges units listát igényel.');
  const normalized = freezeProperty(property);
  properties.push(normalized);
  propertyMap.set(normalized.id, normalized);
  return normalized;
}

export const PROPERTY_REGISTRY = Object.freeze({
  groups: listPropertyGroups,
  get: getProperty,
  list: listProperties,
  getGroup: getPropertyGroup,
  register: registerProperty
});
