# Zerik

Monorepo студии. Универсальный движок для линейки приложений жанра «ежедневная редакторская карточка» + первое приложение **Mental Models**.

> **Имена рабочие, не финальные.** `Zerik` — рабочее имя студии и движка. `Mental Models` — рабочее имя первого приложения. Финальные имена — перед релизом в стор. См. [docs/studio_name_prompt.md](docs/studio_name_prompt.md).

`Qaizo` — отдельный финансовый продукт студии вне этого монорепо (см. `C:\Users\bestc_000\Desktop\Qaizo`).

## Структура

```
Zerik/
├── docs/                       Архитектура, brief, roadmap линейки, ASO copy
├── mockups/                    Pixel-perfect HTML-макеты карточки
├── content/
│   ├── card_schema.json        JSON Schema валидации
│   ├── master_prompt.md        Мастер-промпт для AI-генерации карточек
│   └── seed/                   29 карточек + 2 deep уровня
├── design/
│   ├── design_tokens.json      Типографика, spacing, shared
│   └── category_palettes.json  7 категорийных палитр
├── engine/                     @engine/* — движок
│   ├── theme/                  ThemeContext + per-card hue shift
│   ├── blocks/                 16 типов блоков (11 engine + 5 product-specific)
│   ├── screens/                CardScreen, CardStackScreen, CardLevelStack, etc.
│   ├── components/             CardBottomBar, etc.
│   ├── core/                   12 сервисов (content/voting/progress/auth/paywall/push/...)
│   ├── i18n/                   Локализация
│   └── index.js                Public surface
├── apps/
│   └── mental-models/          Первое приложение (Expo SDK 54, RN 0.81)
│       ├── App.js
│       ├── config/             brand + theme + push + paywall + studio lineup
│       ├── src/seed.js         Bundled seed (используется как fallback)
│       ├── illustrations/      12 SVG + 22 алиаса (покрывает все 29 карточек)
│       ├── blocks/             5 продуктовых блоков
│       ├── google-services.json   Android Firebase config (публичный)
│       └── assets/             Шрифты, иконки, splash, feature graphic
├── scripts/                    Валидация, аудит, деплой, генерация ассетов
├── firestore.rules             Production Firestore Rules
├── firebase.json               Firebase CLI config
└── serviceAccount.json         Firebase Admin (gitignored)
```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run validate:seed`   | Валидирует все JSON в `content/seed/` против `card_schema.json` |
| `npm run audit:content`   | Проверяет illustration ref'ы, категории, локали, release_date sanity |
| `npm run syntax:check`    | Парсит JS engine + apps через @babel/parser |
| `npm run seed:upload`     | Заливает `content/seed/*.json` в Firestore коллекцию `models` |
| `npm run rules:deploy`    | Деплоит `firestore.rules` через Admin SDK |
| `npm run icons:generate`  | Перегенерирует PNG-иконки из `apps/mental-models/assets/icon.svg` |
| `npm run fonts:download`  | Скачивает Prata, Spectral, JetBrains Mono с Google Fonts |
| `npm run mental-models`   | `expo start` |

## Архитектура

См. [`docs/ENGINE_DESIGN.md`](docs/ENGINE_DESIGN.md). Ключевые принципы:

- **Block-based renderer.** Карточка = JSON-массив блоков. 16 типов блоков (11 engine + 5 product-specific: modern_critique, riddle_reveal, fallacy_example, book_quote, historical_data).
- **Категорийный акцент + per-card hue shift.** `ThemeContext` меняет палитру при смене карточки; `CardThemeScope` сдвигает HUE ±30° по hash(card.id) — карточки одной категории отличаются по оттенку.
- **Inline-маркеры.** `{{accent:слово}}` / `{{em:слово}}` / `{{votes_count}}` / `{{user_name}}` парсятся через `engine/blocks/utils/inlineMarkers.js`.
- **Pluggable content.** `ContentService` берёт из Firestore (если доступен) или из bundled seed. Без auth — guest mode (AsyncStorage).
- **Vertical swipe для уровней.** `CardLevelStack` через `resolveLevels(card)` → level 1 (root) + опц. level 2 (deep).
- **Block-level illustrations с категорийным fallback.** Алиасы в `apps/<app>/illustrations/index.js` покрывают все ref'ы из seeds.
- **App Check ready.** `appCheckService.activate()` на старте — debug provider в dev, Play Integrity в production.

## Линейка студии

Mental Models — первый из ~7 продуктов на этом движке. См. [`docs/studio_lineup_roadmap.md`](docs/studio_lineup_roadmap.md).

## Mental Models — текущее состояние

- 29 карточек + 2 deep уровня в Firestore (project `mental-models-mvp`, location `europe-west1`)
- Production Firestore Rules задеплоены (public read для `models`, admin-only write)
- App Check код активируется на старте (UI-настройка в Firebase Console — перед public-релизом)
- 5 PNG-ассетов для Play Store сгенерированы из `assets/icon.svg`
- Onboarding push consent → реальный OS prompt + scheduleDailyReminder
- Dev APK через EAS, Google Sign-In OAuth client настроен

См. [`docs/DEV_BUILD.md`](docs/DEV_BUILD.md) для шагов rebuild + install + run.

## Apple/iOS

Отложен до Apple Developer Program ($99/год). iOS-секция в `app.json` под ключом `_ios_disabled_until_apple_developer` (Expo её игнорирует).
