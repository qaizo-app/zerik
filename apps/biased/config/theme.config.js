import categoryPalettesRaw from '@design/category_palettes.json';

function stripMetaKeys(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (!k.startsWith('_')) out[k] = v;
  }
  return out;
}

const cleaned = {};
for (const [slug, palette] of Object.entries(categoryPalettesRaw)) {
  if (slug.startsWith('_')) continue;
  cleaned[slug] = stripMetaKeys(palette);
  cleaned[slug]._meta = {
    grain_color:   palette._grain_color,
    grain_opacity: palette._grain_opacity,
    label:         palette._label
  };
}

cleaned.default = cleaned.cognitive_biases;

export const categoryPalettes = cleaned;
