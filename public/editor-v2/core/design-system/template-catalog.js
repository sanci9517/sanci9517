import { SCHEMA_VERSION, NODE_TYPES } from '../schema.js?v=20261125-edt016-child-reference-limit-v1';

const frozen = value => {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) frozen(child);
  }
  return value;
};

export const EDITOR_TEMPLATE_CATALOG = frozen([
  {
    id: 'blank-page', version: 1, schemaVersion: SCHEMA_VERSION,
    label: 'Üres oldal', description: 'Tiszta, csak piszkozatként létrejövő oldal.',
    preview: ['Saját címsor', 'Saját tartalom', 'Te választod meg az elrendezést.'],
    rootChildren: [], nodes: []
  },
  {
    id: 'creator-home', version: 1, schemaVersion: SCHEMA_VERSION,
    label: 'Creator bemutatkozás', description: 'Letisztult nyitó blokk címsorral, bemutatkozással és helyekkel a saját közösségi linkjeidnek.',
    preview: ['SANCI9517 · STREAMER & CREATOR', 'Játék. Kikapcsolódás. Közösség.', 'Ismerd meg a csatornát és a közösséget.'],
    rootChildren: ['hero'],
    nodes: [
      { key: 'hero', type: NODE_TYPES.SECTION, name: 'Bemutatkozó blokk', children: ['eyebrow', 'title', 'intro', 'community'], style: { display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1120px', margin: '0 auto', padding: '56px 24px', backgroundColor: '#101827', borderRadius: '18px' } },
      { key: 'eyebrow', type: NODE_TYPES.TEXT, name: 'Rövid márkafelirat', props: { text: 'SANCI9517 · STREAMER & CREATOR' }, style: { color: '#8fb4ff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em' } },
      { key: 'title', type: NODE_TYPES.HEADING, name: 'Bemutatkozó címsor', props: { text: 'Játék. Kikapcsolódás. Közösség.', level: 1 }, style: { color: '#f3f6fb', fontSize: 'clamp(32px, 6vw, 64px)', lineHeight: '1.05', margin: '0' } },
      { key: 'intro', type: NODE_TYPES.TEXT, name: 'Bemutatkozó szöveg', props: { text: 'Nézd meg a legújabb adásokat, kapcsolódj be a közösségbe, és találd meg a neked szóló tartalmat.' }, style: { maxWidth: '680px', color: '#c2ccda', fontSize: '18px', lineHeight: '1.6' } },
      { key: 'community', type: NODE_TYPES.TEXT, name: 'Saját csatornalink helye', props: { text: 'A saját csatorna- és közösségi linkjeidet később add hozzá az Elemek panelen.' }, style: { color: '#b9c5d6', fontSize: '15px', lineHeight: '1.5' } }
    ]
  },
  {
    id: 'creator-schedule', version: 1, schemaVersion: SCHEMA_VERSION,
    label: 'Stream menetrend', description: 'Saját közvetítési időpontok szerkeszthető, publikálásra kész vázlata.',
    preview: ['Következő adások', 'Te add meg a saját időpontjaidat.', 'A sablon nem tartalmaz kitalált dátumot, csatorna-URL-t vagy médiafájlt.'],
    rootChildren: ['schedule'],
    nodes: [
      { key: 'schedule', type: NODE_TYPES.SECTION, name: 'Stream menetrend', children: ['eyebrow', 'title', 'intro', 'slots'], style: { display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '1120px', margin: '0 auto', padding: '48px 24px', backgroundColor: '#101827', borderRadius: '18px' } },
      { key: 'eyebrow', type: NODE_TYPES.TEXT, name: 'Rövid szekciófelirat', props: { text: 'TALÁLKOZZUNK ÉLŐBEN' }, style: { color: '#a99bff', fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em' } },
      { key: 'title', type: NODE_TYPES.HEADING, name: 'Menetrend címsor', props: { text: 'Következő adások', level: 1 }, style: { color: '#f3f6fb', fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: '1.08', margin: '0' } },
      { key: 'intro', type: NODE_TYPES.TEXT, name: 'Menetrend bevezető', props: { text: 'Add meg az aktuális közvetítési időpontjaidat. A helyőrzőket publikálás előtt cseréld a saját programodra.' }, style: { maxWidth: '700px', color: '#c2ccda', fontSize: '17px', lineHeight: '1.6' } },
      { key: 'slots', type: NODE_TYPES.CONTAINER, name: 'Időpontok', children: ['slot-1', 'slot-2', 'slot-3'], style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' } },
      { key: 'slot-1', type: NODE_TYPES.SECTION, name: 'Első időpont', children: ['slot-1-title', 'slot-1-copy'], style: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px', backgroundColor: '#172438', borderRadius: '14px', border: '1px solid #34435b' } },
      { key: 'slot-1-title', type: NODE_TYPES.HEADING, name: 'Első nap címe', props: { text: 'Első közvetítés', level: 3 }, style: { color: '#f3f6fb', fontSize: '18px', margin: '0' } },
      { key: 'slot-1-copy', type: NODE_TYPES.TEXT, name: 'Első időpont szövege', props: { text: 'Írd ide a napot és az időpontot.' }, style: { color: '#c2ccda', lineHeight: '1.5' } },
      { key: 'slot-2', type: NODE_TYPES.SECTION, name: 'Második időpont', children: ['slot-2-title', 'slot-2-copy'], style: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px', backgroundColor: '#172438', borderRadius: '14px', border: '1px solid #34435b' } },
      { key: 'slot-2-title', type: NODE_TYPES.HEADING, name: 'Második nap címe', props: { text: 'Második közvetítés', level: 3 }, style: { color: '#f3f6fb', fontSize: '18px', margin: '0' } },
      { key: 'slot-2-copy', type: NODE_TYPES.TEXT, name: 'Második időpont szövege', props: { text: 'Írd ide a napot és az időpontot.' }, style: { color: '#c2ccda', lineHeight: '1.5' } },
      { key: 'slot-3', type: NODE_TYPES.SECTION, name: 'Harmadik időpont', children: ['slot-3-title', 'slot-3-copy'], style: { display: 'flex', flexDirection: 'column', gap: '8px', padding: '18px', backgroundColor: '#172438', borderRadius: '14px', border: '1px solid #34435b' } },
      { key: 'slot-3-title', type: NODE_TYPES.HEADING, name: 'Harmadik nap címe', props: { text: 'Közösségi alkalom', level: 3 }, style: { color: '#f3f6fb', fontSize: '18px', margin: '0' } },
      { key: 'slot-3-copy', type: NODE_TYPES.TEXT, name: 'Harmadik időpont szövege', props: { text: 'Írd ide a közösségi eseményed időpontját.' }, style: { color: '#c2ccda', lineHeight: '1.5' } }
    ]
  }
]);
