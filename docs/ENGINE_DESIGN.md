# Qaizo Engine — Архитектура универсального движка

**Версия:** 0.2 (после интеграции linup roadmap)
**Дата:** 2026-04-25
**Контекст:** Qaizo Engine — фундамент **линейки из 5-7 продуктов студии** в нише ежедневного образовательного/когнитивного контента. Senik — первый и флагманский продукт. См. `studio_lineup_roadmap.md`.

**Список приложений на движке:**
1. Senik (флагман, бирюза)
2. Cognitive Biases Daily (янтарь)
3. Thought Experiments (фиолетовый)
4. Psychology Experiments (коралл)
5. Paradoxes (индиго)
6. Rhetorical Fallacies (жёлтый)
7. Book Idea Daily (оливковый, опционально)

**Не на движке:** Qaizo (личные финансы, отдельный продукт).

---

## 1. Цель

Построить движок, который позволяет за **1-2 недели** запустить новое приложение жанра "ежедневная редакторская карточка" с:
- собственной темой и брендом,
- своими типами блоков карточки,
- своей структурой контента в Firestore,
- общей инфраструктурой: auth, paywall, push, прогресс, голосования, share, i18n, onboarding.

**Ключевой принцип:** контент описывается JSON-схемой блоков. Движок рендерит блоки по типу. Новое приложение = новые типы блоков (если нужны) + новая палитра + новый контент. Бизнес-логика (auth, прогресс, голосования) переиспользуется как есть.

**Метрика успеха движка:** запуск 7-го приложения занимает не больше **1 недели чистой работы** на готовом контенте.

---

## 2. Принципы проектирования

1. **Block-based rendering.** Карточка = массив типизированных блоков. Реестр блоков расширяется приложением.
2. **Config-driven branding.** Бренд (имя, иконки, цвета, тексты onboarding/paywall) — конфиг, не код.
3. **Category-aware theming.** Тема меняет акцент в зависимости от категории текущей карточки. База остаётся стабильной.
4. **Pluggable content provider.** Движок не знает, как структурирована Firestore — приложение даёт `ContentProvider`.
5. **Offline-first guest mode.** Гибрид Firestore + AsyncStorage (паттерн Qaizo): залогинен — Firestore, гость — local. Миграция при логине.
6. **Раннее перемещение в monorepo.** При втором приложении (Cognitive Biases) — Yarn workspaces. Ждать дальше нет смысла, у нас 7 продуктов в roadmap.
7. **Тонкое приложение.** В `apps/<name>/` лежат только: config, кастомные блоки, App.js, ассеты. Всё остальное — в движке.
8. **Cross-promotion первого класса.** Раздел "Другие приложения студии" — обязательная часть `engine/screens/SettingsScreen.js`, не опциональная.
9. **Движок должен покрывать минимум 3 продукта.** Если фича нужна только одному приложению — она в `apps/<name>/`, не в `engine/`.

---

## 3. Структура папок

### Текущая (single package, Senik в одиночку)

```
Desktop/Zerik/
├── docs/                               ← brief, roadmap, ENGINE_DESIGN
├── mockups/                            ← HTML-макеты
├── content/                            ← schema, master_prompt, seed
├── design/                             ← дизайн-токены, палитры
├── engine/                             ← УНИВЕРСАЛЬНЫЙ ДВИЖОК
│   ├── core/                           ← services
│   ├── blocks/                         ← block renderer + 11 базовых блоков
│   ├── components/                     ← shared UI
│   ├── screens/                        ← generic screens
│   ├── navigation/
│   ├── theme/                          ← ThemeContext, tokens, usePalette
│   ├── i18n/
│   └── hooks/
├── apps/
│   └── senik/                  ← КОНФИГ + СПЕЦИФИКА Senik
│       ├── App.js                      ← точка входа
│       ├── app.json
│       ├── package.json
│       ├── babel.config.js             ← алиасы @engine/* @app/*
│       ├── eas.json
│       ├── google-services.json
│       ├── firebase.json
│       ├── firestore.rules
│       ├── config/
│       │   ├── brand.config.js
│       │   ├── theme.config.js         ← бирюзовая палитра + переходы
│       │   ├── content.config.js
│       │   ├── paywall.config.js
│       │   └── push.config.js
│       ├── blocks/                     ← кастомные блоки (если нужны)
│       ├── i18n/                       ← RU/EN строки Senik
│       └── assets/
└── scripts/
    ├── seed-firestore.js
    └── validate-card.js
```

### Целевая (после второго продукта — Yarn workspaces)

```
Desktop/Zerik/
├── package.json                        ← workspace root
├── packages/
│   └── engine/                         ← npm-package "@qaizo/engine"
├── apps/
│   ├── senik/                  ← @qaizo/senik
│   ├── cognitive-biases/               ← @qaizo/cognitive-biases
│   ├── thought-experiments/            ← @qaizo/thought-experiments
│   ├── psychology-experiments/         ← @qaizo/psychology-experiments
│   ├── paradoxes/                      ← @qaizo/paradoxes
│   ├── rhetorical-fallacies/           ← @qaizo/rhetorical-fallacies
│   └── book-idea/                      ← @qaizo/book-idea
├── shared/
│   ├── content-schemas/                ← общие JSON Schemas карточек
│   └── design-tokens/                  ← shared дизайн-токены
└── docs/
```

**Триггер миграции:** старт работы над Cognitive Biases Daily (примерно через 5-7 месяцев).

**Алиасы (single-package фаза, babel.config.js):**
```js
plugins: [
  ['module-resolver', {
    alias: {
      '@engine': '../../engine',
      '@app': './'
    }
  }]
]
```

---

## 4. Card Schema — формат карточки

Карточка = JSON-документ в Firestore, описывающий цепочку блоков для каждого языка. См. `content/card_schema.json` для полной спецификации.

**Базовая структура (одинакова для всех 7 продуктов):**
- `id`, `category`, `release_number`, `release_date`, `tags`, `difficulty`, `reading_time_sec`
- `i18n.<locale>.blocks` — массив блоков
- `levels` — расширения глубины (опц.)
- `theme_override` — переопределение акцента (опц.)
- `illustration_ref` — путь к SVG

**Inline-маркеры:**
- `{{accent:слово}}` → акцентное выделение (italic + accent color)
- `{{em:слово}}` → курсив без цвета
- `{{votes_count}}` → подставляется из VotingService при рендере
- `{{user_name}}` → имя пользователя (для персонализации)

---

## 5. Реестр блоков — базовые + продуктовые

**Engine блоки (универсальные, 11 типов):**

| Тип | Используется в продуктах | Назначение |
|---|---|---|
| `category_label` | Все 7 | "Когнитивное искажение · №3" |
| `hook` | Все 7 | Italic intro, конкретная сцена |
| `title` | Все 7 | Название с inline-акцентом |
| `subtitle` | Все 7 | "Sunk Cost Fallacy · D. Kahneman · 1979" |
| `illustration` | Все 7 | SVG-иллюстрация |
| `body_paragraphs` | Все 7 | 2-4 абзаца, drop_cap опц. |
| `principle` | Senik, Cognitive Biases, Fallacies | Цитата сути |
| `scenario` | Senik, Cognitive Biases, Thought Experiments, Psych Experiments | Голосование с reveal |
| `domains` | Senik, Cognitive Biases, Fallacies | "Где встретите сегодня" |
| `action_today` | Все кроме Paradoxes | Выполнимое за день |
| `trap` | Senik, Paradoxes | Где правило не работает |

**Продуктовые блоки (специфика, регистрируются приложением):**

| Тип | Продукт | Назначение |
|---|---|---|
| `modern_critique` | Psychology Experiments | Современная ревизия классики (зефирный тест 2018, кризис воспроизводимости). Поля: `label`, `text`, `sources` |
| `riddle_reveal` | Paradoxes | Вопрос → юзер тапает «думаю» → reveal с разгадкой. Без вариантов голосования. Поля: `question`, `hint`, `reveal_text`, `formula` |
| `fallacy_example` | Rhetorical Fallacies | Гипотетический пример (политически нейтральный). Поля: `setup`, `example_quote`, `recognition_signal`, `nuance_warning` |
| `book_quote` | Book Idea Daily | Цитата + источник + применение. Поля: `quote`, `book_title`, `author`, `application` |
| `historical_data` | Thought Experiments, Psych Experiments | Готовая академическая статистика без cold start. Поля: `source`, `sample_size`, `year`, `breakdown` |

**Реестр (engine/blocks/registry.js):**

```js
const _registry = {};

export function registerBlock(type, component) {
  _registry[type] = component;
}

export function getBlockComponent(type) {
  return _registry[type] || null;
}

export function registerEngineBlocks() {
  registerBlock('category_label', require('./CategoryLabelBlock').default);
  registerBlock('hook', require('./HookBlock').default);
  registerBlock('title', require('./TitleBlock').default);
  registerBlock('subtitle', require('./SubtitleBlock').default);
  registerBlock('illustration', require('./IllustrationBlock').default);
  registerBlock('body_paragraphs', require('./BodyParagraphsBlock').default);
  registerBlock('principle', require('./PrincipleBlock').default);
  registerBlock('scenario', require('./ScenarioBlock').default);
  registerBlock('domains', require('./DomainsBlock').default);
  registerBlock('action_today', require('./ActionTodayBlock').default);
  registerBlock('trap', require('./TrapBlock').default);
}
```

**Расширение приложением:**

```js
// apps/psychology-experiments/App.js
import { registerEngineBlocks, registerBlock } from '@engine/blocks/registry';
import ModernCritiqueBlock from './blocks/ModernCritiqueBlock';
import HistoricalDataBlock from './blocks/HistoricalDataBlock';

registerEngineBlocks();
registerBlock('modern_critique', ModernCritiqueBlock);
registerBlock('historical_data', HistoricalDataBlock);
```

---

## 6. Theming — категорийные палитры

**Архитектура:**
- `engine/theme/ThemeContext` управляет: режим темы (`system|light|dark|amoled`) + текущая категория.
- При смене карточки: `setCategory(card.category)` → пересчёт акцента → ремаунт.
- `tokens.js` — shared spacing/typography (Prata/Spectral/JetBrains Mono).
- `apps/<name>/config/theme.config.js` поставляет палитры по категориям.

**Расширенный список палитр (см. `design/category_palettes.json`):**

| Slug | Цвет акцента | Продукт |
|---|---|---|
| `mental_models` | `#5EEAD4` (teal) | Senik |
| `cognitive_biases` | `#E89647` (amber) | Cognitive Biases Daily |
| `thought_experiments` | `#A78BFA` (violet) | Thought Experiments |
| `psychology_experiments` | `#F87171` (coral) | Psychology Experiments |
| `paradoxes` | `#6366F1` (indigo) | Paradoxes |
| `rhetorical_fallacies` | `#FBBF24` (yellow warn) | Rhetorical Fallacies |
| `book_idea` | `#A3B18A` (sage olive) | Book Idea Daily |

Каждое приложение использует **одну основную палитру**, но движок поддерживает все семь — это позволяет cross-promo превью, deeplink-карточки и единое воспоминание о бренде студии.

---

## 7. Content Service — абстракция Firestore

```js
// engine/core/contentService.js
class ContentService {
  constructor({ collectionName, statsCollectionName, userProgressCollection }) {
    this.collectionName = collectionName;
    this.statsCollectionName = statsCollectionName;
    this.userProgressCollection = userProgressCollection;
  }

  async getCardForToday(locale) { /* by release_date */ }
  async getCardById(id, locale) { /* */ }
  async getCardChain({ limit, before, locale }) { /* пагинация */ }
  async getCardLevels(cardId) { /* уровни глубины */ }
  async searchCards({ query, tags, category, locale }) { /* */ }
}

// apps/senik/App.js
import { ContentService } from '@engine/core/contentService';
const contentService = new ContentService({
  collectionName: 'models',
  statsCollectionName: 'scenario_stats',
  userProgressCollection: 'user_progress',
});
```

**Гибрид Firestore + AsyncStorage** (паттерн Qaizo): для гостей — оффлайн-кэш последних N карточек.

---

## 8. Voting Service — distributed counters + hardcoded stats

**Архитектура шардирования** (для пользовательских голосов):

```
scenario_stats/
  sunk_cost/
    metadata: { total_votes, last_updated, min_votes_to_show: 1000 }
    shards/
      shard_0: { options: { stay: { count }, switch: { count } }, total }
      ...
      shard_9: { ... }
```

**Hardcoded stats** (для академических данных — критично для Thought Experiments / Psych Experiments):

Если в `scenario.reveal.hardcoded_stats` лежит готовая статистика — VotingService её отдаёт без обращения к Firestore. Используется для:
- Дилемма вагонетки (Moral Machine MIT, 40 млн ответов)
- Ultimatum Game (Хенрих и др.)
- Зефирный тест (оригинал + repeat 2018)

Голос пользователя в этом случае **записывается отдельно** в `user_progress.scenario_answers` (для личной истории), но **не влияет** на отображаемую глобальную статистику.

```js
async function getStats(modelId, hardcodedStats) {
  if (hardcodedStats) {
    return {
      total: hardcodedStats.total_votes,
      options: hardcodedStats.options,
      source: hardcodedStats.source,
      is_academic: true,
    };
  }
  // ... обычная агрегация шардов
}
```

**UX-правило:** пока `total < min_votes_to_show` (1000) — UI показывает "Ты N-й, кто ответил" без процентов. Для academic stats этого правила нет — статистика сразу.

---

## 9. Progress Service — streak, history, saved

Документ пользователя в `user_progress/{uid}`:
```json
{
  "uid": "...",
  "streak_current": 12,
  "streak_best": 34,
  "last_opened_date": "2026-04-25",
  "total_cards_read": 47,
  "saved_card_ids": ["sunk_cost", "occam_razor"],
  "scenario_answers": { "sunk_cost": "stay", "occam_razor": "simple" },
  "language_preference": "ru",
  "subscription": { "active": true, "plan": "yearly", "renews_at": "2027-04-24" }
}
```

API:
```js
// engine/core/progressService.js
async function recordCardOpened(cardId) { /* updates streak, last_opened, total_read */ }
async function recordScenarioAnswer(cardId, optionId) { /* one-time */ }
async function toggleSaved(cardId) { /* */ }
async function getSavedCards() { /* */ }
async function getHistory({ limit, before }) { /* */ }
async function getStreak() { /* {current, best, at_risk} */ }
```

Логика стрика — портируется из `Qaizo/src/services/streakService.js` без изменений (универсальна).

---

## 10. Cross-Promotion Service — связи между приложениями линейки

**Цель:** превратить каждое приложение в воронку для остальных. Это первоклассная функция движка, не опциональная.

```js
// engine/core/crossPromoService.js

const STUDIO_APPS_REGISTRY = [
  // Конфиг загружается из shared/cross-promo.config.json
  // или из Firestore studio_meta/apps_registry для динамического обновления.
];

async function getOtherStudioApps(currentAppSlug, locale) { /* список других продуктов */ }
async function getDeepLink(appSlug, cardId) { /* ссылка для перехода между приложениями */ }
async function getRelatedCardInOtherApp(currentCard) { /* контекстный cross-promo */ }
```

**UI-точки cross-promotion:**
1. **SettingsScreen** — раздел "Другие приложения студии" с превью карточек
2. **CardStackScreen** — после закрытия карточки иногда показывается "Связанная модель в Senik" (если текущий продукт — Cognitive Biases или Thought Experiments)
3. **Onboarding** — на последнем слайде "Студия делает 5 приложений в этой нише — попробуй ещё"
4. **PaywallScreen** — для бесплатных приложений: "Хочешь больше? — Senik с Pro-подпиской открывает всё"

**Конфиг линейки (shared/cross-promo.config.json):**

```json
{
  "apps": [
    {
      "slug": "mental_models",
      "store_id_ios": "...",
      "store_id_android": "...",
      "i18n": {
        "ru": { "name": "Senik", "tagline": "Одна модель в день — для ясного мышления" },
        "en": { "name": "Senik", "tagline": "One model a day — for sharper thinking" }
      },
      "category_slug": "mental_models",
      "is_flagship": true
    },
    { "slug": "cognitive_biases", "is_flagship": false, "...": "..." }
  ],
  "related_cards_map": {
    "cognitive_biases:sunk_cost": "mental_models:first_principles",
    "thought_experiments:trolley": "mental_models:utilitarian_calculus"
  }
}
```

---

## 11. Auth / Paywall / Push — переиспользование Qaizo

| Сервис | Источник | Что меняется |
|---|---|---|
| `authService` | Qaizo `src/services/authService.js` | webClientId Google → новый, ошибки в `engine/i18n/engine_strings/` |
| `paywallService` | НЕТ в Qaizo | Пишем с нуля на RevenueCat. Конфиг плана продукта в `apps/<name>/config/paywall.config.js` |
| `pushService` | Qaizo `notificationService.js` + FCM | Добавляем remote push (FCM), Qaizo использует только локальные |
| `consentService` | Qaizo `consentService.js` | Без изменений |
| `analyticsEvents` | Qaizo `analyticsEvents.js` | Каждое приложение даёт свой список событий через registry |

**Push-расписание (общее для линейки):**
- Ежедневно в выбранное время — "Карточка дня готова"
- За день до streak break (вечером) — "Стрик в опасности"
- Еженедельный дайджест — "5 карточек, которые ты пропустил"

---

## 12. Что специфично продукту vs универсально

| Универсально (engine) | Специфично продукту (apps/<name>) |
|---|---|
| Block-based renderer + 11 базовых блоков | Свой контент, свои продуктовые блоки (modern_critique, riddle_reveal, fallacy_example, book_quote, historical_data) |
| Auth flow, paywall, push, share, consent, analytics | RevenueCat product IDs, цены |
| Theme architecture (категорийный акцент) | Основная палитра из 7 |
| Content service interface | `collectionName`, mapping коллекций |
| Voting (distributed counters + hardcoded stats) | `min_votes_to_show`, академические данные |
| Progress (streak, saved, history) | — |
| I18n инфраструктура | Строки UI приложения и контента |
| Generic screens (CardStack, Library, History, Profile, Auth, Paywall, Onboarding, Settings) | Тексты onboarding, иконка, splash |
| Navigation (tab + stack) | — |
| Cross-promotion service + конфиг линейки | Что показывать в `getRelatedCardInOtherApp` |

---

## 13. Roadmap MVP (3 недели для Senik)

### Неделя 1 — фундамент движка + Firebase
- Реорганизация папок → Expo-проект в `apps/senik/`
- Создать `engine/core/` сервисы: copy-paste-adapt из Qaizo
- Theme architecture + tokens + 7 категорийных палитр (используется только бирюза, остальные — для cross-promo)
- Firebase project setup (новый, europe-west1)
- Block renderer + 5 базовых блоков (hook, title, body_paragraphs, principle, action_today)
- CardStackScreen — горизонтальный FlatList цепочки + вертикальный для уровней
- Card schema + первый seed (Sunk Cost) в Firestore

### Неделя 2 — голосования + прогресс + paywall
- ScenarioBlock + DomainsBlock + TrapBlock + IllustrationBlock + остальные блоки
- VotingService с distributed counters + hardcoded_stats path
- ProgressService (streak, saved, history)
- LibraryScreen + HistoryScreen
- AuthScreen (Email + Google + Apple)
- PaywallService на RevenueCat + PaywallScreen
- Push: ежедневное напоминание + streak alert
- Share-as-image
- 15 моделей RU (Alex)

### Неделя 3 — финализация
- Локализация EN (Alex переводит, Sean проверяет)
- OnboardingScreen + SettingsScreen + блок "Другие приложения студии" (пустой пока)
- ASO-ассеты (icon, splash, screenshots)
- TestFlight + Internal Testing
- Финальный билд + submit

---

## 14. Открытые вопросы

- [ ] Apple Sign-In с MVP — **да** (требование Apple).
- [ ] Хранение SVG: bundle vs Cloud Storage — Bundle для MVP (≤30 карточек, ≤1.5MB), Cloud Storage позже.
- [ ] Cloud Functions для агрегации голосов — клиент достаточно для MVP.
- [ ] Firebase project: общий с Qaizo (разные коллекции) или отдельный — **отдельный**.
- [ ] Имя пакета Expo — решить после имени студии.
- [ ] `studio_meta/apps_registry` в Firestore vs static `cross-promo.config.json` в bundle — **static для MVP**, Firestore при 3-м продукте (для динамического показа новых апов без релиза).
- [ ] Триггер миграции на Yarn workspaces — старт работы над Cognitive Biases Daily.

---

## 15. Что НЕ делаем сейчас

- Cloud Functions. Только клиентская логика для MVP.
- TypeScript строгий по всему проекту. JS + JSDoc для скорости MVP, миграция позже.
- Web-версия. Только iOS/Android.
- Семейный план / B2B. v2.0+.
- A/B тесты onboarding. После 1000 установок.
- Dynamic feature flags. После релиза третьего продукта.
- Realtime sync между устройствами одного юзера. После 10K MAU.
