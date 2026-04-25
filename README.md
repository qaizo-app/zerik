# Zerik

Monorepo студии. Универсальный движок для линейки приложений жанра «ежедневная редакторская карточка» + первое приложение **Mental Models**.

> **Важно про имена.** `Zerik` — рабочее имя студии и движка, может измениться. `Mental Models` — рабочее имя первого приложения, тоже изменится перед релизом. См. [docs/studio_name_prompt.md](docs/studio_name_prompt.md).

## Структура

```
Zerik/
├── docs/                       Архитектура, brief, roadmap линейки
├── mockups/                    Pixel-perfect HTML-макеты карточки
├── content/
│   ├── card_schema.json        JSON Schema валидации
│   ├── master_prompt.md        Мастер-промпт для AI-генерации карточек
│   └── seed/                   Примеры карточек (Sunk Cost, Occam Razor)
├── design/
│   ├── design_tokens.json      Типографика, spacing, shared
│   └── category_palettes.json  7 палитр под линейку
├── engine/                     @zerik/engine — движок
│   ├── theme/                  ThemeContext, tokens, usePalette
│   ├── blocks/                 Block registry + 11 базовых блоков
│   ├── screens/                CardScreen, etc.
│   ├── core/                   (TODO) auth/content/voting/progress/paywall/push
│   └── index.js                Public surface
├── apps/
│   └── mental-models/          Первое приложение на движке
│       ├── App.js              Точка входа
│       ├── config/             brand + theme + content + paywall + push
│       ├── src/seed.js         Локальный seed на время разработки
│       └── assets/fonts/       Prata, Spectral, JetBrains Mono
└── scripts/
    ├── validate-card.js        Валидация карточек по schema
    ├── download-fonts.js       Скачивание шрифтов с Google Fonts
    └── syntax-check.js         Быстрая проверка JS на parse-errors
```

`Qaizo` — отдельный продукт студии вне этого монорепо (см. `C:\Users\bestc_000\Desktop\Qaizo`).

## Первый запуск (Mental Models)

```bash
# Из корня Zerik/
npm install                                # ставит ajv для валидации, ставит workspace-link для @zerik/engine

cd apps/mental-models
npm install                                # ставит зависимости приложения (Expo SDK 54, RN 0.81)

cd ../..
npm run fonts:download                     # скачивает Prata, Spectral, JetBrains Mono в assets/fonts/

cd apps/mental-models
npx expo start                             # запускает Metro bundler
# Сканируй QR-код через Expo Go на телефоне (Android/iOS)
```

В первом запуске движок отрендерит **Sunk Cost** (категория `cognitive_biases` — warm amber). Чтобы переключиться на Occam Razor (категория `mental_models` — cool teal), отредактируй `apps/mental-models/App.js`:

```js
<CardScreen card={seedCards[1]} locale="ru" />
```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run validate:seed` | Валидирует все JSON в `content/seed/` против `card_schema.json` + 6 семантических проверок |
| `npm run fonts:download` | Скачивает шрифты с Google Fonts |
| `npm run syntax:check` | Парсит все .js в `engine/` и `apps/` через @babel/parser |
| `npm run mental-models` | Запускает Expo dev server для Mental Models |

## Архитектура

См. [`docs/ENGINE_DESIGN.md`](docs/ENGINE_DESIGN.md) — полная спецификация движка. Ключевые принципы:

- **Block-based renderer.** Карточка = JSON-массив блоков. 11 базовых блоков в движке, 5 продуктовых блоков (modern_critique, riddle_reveal, fallacy_example, book_quote, historical_data) регистрируются приложениями.
- **Категорийный акцент.** `ThemeContext` меняет палитру при смене карточки. 7 палитр под линейку.
- **Inline-маркеры.** `{{accent:слово}}` `{{em:слово}}` `{{votes_count}}` `{{user_name}}` парсятся через `engine/blocks/utils/inlineMarkers.js`.
- **Pluggable content.** Источник карточек подменяется через `ContentService` (TODO) — Firestore в проде, локальный seed в дев.
- **Гибрид Firestore + AsyncStorage.** Гость = local. Login = Firestore. Паттерн Qaizo.

## Линейка

Mental Models — первый из ~7 продуктов на этом движке. См. [`docs/studio_lineup_roadmap.md`](docs/studio_lineup_roadmap.md).

## Что готово сегодня

- [x] Архитектура движка (`docs/ENGINE_DESIGN.md` v0.2)
- [x] Card Schema + 16 типов блоков (11 engine + 5 product-specific)
- [x] Master Prompt для AI-генерации карточек
- [x] Дизайн-токены + 7 категорийных палитр
- [x] 2 seed-карточки RU/EN, обе валидируются
- [x] `engine/theme` + `engine/blocks` + `engine/screens/CardScreen`
- [x] 11 базовых блоков в JSX (RN-совместимые)
- [x] `apps/mental-models` Expo-проект с babel/metro алиасами

## Что в следующем подходе

- [ ] `engine/core/contentService.js` (Firestore + offline-кэш)
- [ ] `engine/core/votingService.js` (distributed counters + hardcoded_stats)
- [ ] `engine/core/progressService.js` (streak, saved, history)
- [ ] `engine/core/authService.js` (порт из Qaizo)
- [ ] `engine/core/pushService.js`
- [ ] `engine/core/paywallService.js` (RevenueCat)
- [ ] `CardStackScreen` — горизонтальный FlatList цепочки + вертикальный для уровней
- [ ] LibraryScreen, HistoryScreen, AuthScreen, PaywallScreen, OnboardingScreen, SettingsScreen
- [ ] SVG-рендер иллюстраций через react-native-svg (вместо placeholder)
- [ ] Drop-cap layout (HTML float-left → RN-эквивалент)
- [ ] i18n инфраструктура движка
