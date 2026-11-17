import { SCHEMA_VERSION, NODE_TYPES } from '../schema.js?v=20261117-edt041-template-v1';

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
  }
]);
