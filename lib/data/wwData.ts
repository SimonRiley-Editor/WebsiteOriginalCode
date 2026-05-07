export const ELEMENTS = [
  { id: 'glacio', name: 'Glacio', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/glacio_logo_png__wuthering_weaves__by_kabasara_dhp6y4z-pre_yvyttl.png', color: '#60A5FA' },
  { id: 'fusion', name: 'Fusion', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/dhp6xtz-c8d40dd3-92f9-4ca9-b57f-29195fd2f237_pza0yj.png', color: '#F87171' },
  { id: 'electro', name: 'Electro', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/electro_logo_png__wuthering_weaves__by_kabasara_dhp6x3i-pre_sxrzdp.png', color: '#C084FC' },
  { id: 'aero', name: 'Aero', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/aero_logo_png__wuthering_weaves__by_kabasara_dhp6xbu-pre_xnsfza.png', color: '#4ADE80' },
  { id: 'spectro', name: 'Spectro', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681267/spectro_logo_png__wuthering_weaves__by_kabasara_dhp6vy2-pre_qpslx6.png', color: '#FBBF24' },
  { id: 'havoc', name: 'Havoc', imgSrc: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776681266/havoc_logo_png__wuthering_weaves__by_kabasara_dhp6wig-pre_jmcguj.png', color: '#8B5CF6' },
];

export const fallbackGuides = [
  {
    id: 'hiyuki',
    name: 'HIYUKI',
    element: 'glacio',
    role: 'MAIN DPS',
    weapon: 'Rectifier',
    faction: 'Black Shores',
    rarity: '5 Star',
    content: {
       description: 'Administrator of the domain. Observes from the quiet frost.',
       foregroundImage: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776770540/hiyuki_render__wuthering_waves__by_kabasara_dlr6l4k-fullview_plyuxp.png',
    }
  },
  {
    id: 'rover',
    name: 'ROVER',
    element: 'spectro',
    role: 'SUB DPS',
    weapon: 'Sword',
    faction: 'Huanglong',
    rarity: '5 Star',
    content: {
       description: 'Designated as the core awakening asset.',
       foregroundImage: 'https://res.cloudinary.com/ds6dwbk37/image/upload/v1776670099/rover_male__render__wuthering_waves__by_kabasara_dj5cvap-pre_tjktiq.png',
    }
  }
];

export const getSafeField = (obj: any, keys: string[]): string | null => {
  if (!obj) return null;
  for (const key of keys) {
     if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return String(obj[key]);
     const matchingKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
     if (matchingKey && obj[matchingKey] !== undefined && obj[matchingKey] !== null && obj[matchingKey] !== '') {
         return String(obj[matchingKey]);
     }
     if (obj.content) {
        if (obj.content[key] !== undefined && obj.content[key] !== null && obj.content[key] !== '') return String(obj.content[key]);
        const foundContentKey = Object.keys(obj.content).find(k => k.toLowerCase() === key.toLowerCase());
        if (foundContentKey && obj.content[foundContentKey] !== undefined && obj.content[foundContentKey] !== null && obj.content[foundContentKey] !== '') {
           return String(obj.content[foundContentKey]);
        }
        if (Array.isArray(obj.content.Attributes)) {
          const attr = obj.content.Attributes.find((a: any) => a.name && a.name.toLowerCase() === key.toLowerCase() && a.value !== undefined && a.value !== null && a.value !== '');
          if (attr) return String(attr.value);
        }
     }
  }
  return null;
};
