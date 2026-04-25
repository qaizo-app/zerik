// Реестр иллюстраций. Приложение регистрирует свои SVG-компоненты по slug.
// Карточка ссылается через card.illustration_ref = "bundle://illustrations/<slug>.svg"
// или через block.props.ref. IllustrationBlock резолвит slug через этот реестр.
//
// SVG живут на стороне приложения (apps/<name>/illustrations/), а движок
// просто умеет их рендерить когда они зарегистрированы.

const _registry = {};

export function registerIllustration(slug, component) {
  _registry[slug] = component;
}

export function getIllustration(slug) {
  return _registry[slug] || null;
}

export function refToSlug(ref) {
  if (!ref || typeof ref !== 'string') return null;
  // bundle://illustrations/sunk_cost.svg → sunk_cost
  const match = ref.match(/illustrations\/([^/.]+)/);
  return match ? match[1] : null;
}
