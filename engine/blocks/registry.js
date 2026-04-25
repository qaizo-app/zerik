// Реестр блоков. Приложение вызывает registerEngineBlocks() один раз при старте,
// затем может зарегистрировать свои продуктовые блоки через registerBlock(type, Comp).

const _registry = {};

export function registerBlock(type, component) {
  _registry[type] = component;
}

export function getBlockComponent(type) {
  return _registry[type] || null;
}

export function listRegisteredBlocks() {
  return Object.keys(_registry).sort();
}

export function registerEngineBlocks() {
  registerBlock('category_label',  require('./CategoryLabelBlock').default);
  registerBlock('hook',             require('./HookBlock').default);
  registerBlock('title',            require('./TitleBlock').default);
  registerBlock('subtitle',         require('./SubtitleBlock').default);
  registerBlock('illustration',     require('./IllustrationBlock').default);
  registerBlock('body_paragraphs',  require('./BodyParagraphsBlock').default);
  registerBlock('principle',        require('./PrincipleBlock').default);
  registerBlock('scenario',         require('./ScenarioBlock').default);
  registerBlock('domains',          require('./DomainsBlock').default);
  registerBlock('action_today',     require('./ActionTodayBlock').default);
  registerBlock('trap',             require('./TrapBlock').default);
}
