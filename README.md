# Qaizo Studio — Senik

Monorepo студии **Qaizo**. Универсальный движок для линейки приложений жанра «ежедневная редакторская карточка» + первое приложение **Senik** (ментальные модели).

> Папка репозитория исторически называется `Zerik` (раннее рабочее имя). Финальные имена бренда: студия — **Qaizo**, приложение — **Senik**.

`Qaizo` (одноимённое финансовое приложение) живёт отдельно вне этого монорепо (см. `C:\Users\bestc_000\Desktop\Qaizo`).

## Структура

```
Zerik/                              ← название папки, оставлено как есть
├── docs/                       Архитектура, brief, roadmap линейки, ASO copy
├── mockups/                    Pixel-perfect HTML-макеты карточки
├── content/
│   ├── card_schema.json        JSON Schema валидации
│   ├── master_prompt.md        Мастер-промпт для AI-генерации карточек
│   └── seed/                   29 карточек + 2 deep уровня
├── design/
│   ├── design_tokens.json      Типографика, spacing, shared
│   └── category_palettes.json  7 категорийных палитр
├── engine/                     @engine/* — движок (общий для линейки Qaizo)
│   ├── theme/                  ThemeContext + per-card hue shift
│   ├── blocks/                 16 типов блоков (11 engine + 5 product-specific)
│   ├── screens/                CardScreen, CardStackScreen, CardLevelStack, etc.
│   ├── components/             CardBottomBar, etc.
│   ├── core/                   12 сервисов (content/voting/progress/auth/paywall/push/...)
│   ├── i18n/                   Локализация
│   └── index.js                Public surface
├── apps/
│   └── mental-models/          Senik (Expo SDK 54, RN 0.81). Папка пока с историческим именем.
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
| `npm run senik`           | `expo start` |
| `npm run senik:android`   | `expo start --android` |
| `npm run senik:ios`       | `expo start --ios` |

## Архитектура

См. [`docs/ENGINE_DESIGN.md`](docs/ENGINE_DESIGN.md). Ключевые принципы:

- **Block-based renderer.** Карточка = JSON-массив блоков. 16 типов блоков (11 engine + 5 product-specific: modern_critique, riddle_reveal, fallacy_example, book_quote, historical_data).
- **Категорийный акцент + per-card hue shift.** `ThemeContext` меняет палитру при смене карточки; `CardThemeScope` сдвигает HUE ±30° по hash(card.id) — карточки одной категории отличаются по оттенку.
- **Inline-маркеры.** `{{accent:слово}}` / `{{em:слово}}` / `{{votes_count}}` / `{{user_name}}` парсятся через `engine/blocks/utils/inlineMarkers.js`.
- **Pluggable content.** `ContentService` берёт из Firestore (если доступен) или из bundled seed. Без auth — guest mode (AsyncStorage).
- **Vertical swipe для уровней.** `CardLevelStack` через `resolveLevels(card)` → level 1 (root) + опц. level 2 (deep).
- **Block-level illustrations с категорийным fallback.** Алиасы в `apps/<app>/illustrations/index.js` покрывают все ref'ы из seeds.
- **App Check ready.** `appCheckService.activate()` на старте — debug provider в dev, Play Integrity в production.

## Линейка студии Qaizo

Senik — первый из ~7 продуктов на этом движке. См. [`docs/studio_lineup_roadmap.md`](docs/studio_lineup_roadmap.md).

## Senik — текущее состояние

- 29 карточек + 2 deep уровня в Firestore (project `mental-models-mvp`, location `europe-west1`)
- Production Firestore Rules задеплоены (public read для `models`, admin-only write)
- App Check код активируется на старте (UI-настройка в Firebase Console — перед public-релизом)
- 5 PNG-ассетов для Play Store сгенерированы из `assets/icon.svg`
- Onboarding push consent → реальный OS prompt + scheduleDailyReminder
- Dev APK через EAS, Google Sign-In OAuth client настроен
- Android package `com.qaizo.senik`, EAS slug `senik`

См. [`docs/DEV_BUILD.md`](docs/DEV_BUILD.md) для шагов rebuild + install + run.

## Apple/iOS

Отложен до Apple Developer Program ($99/год). iOS-секция в `app.json` будет добавлена при подключении.
