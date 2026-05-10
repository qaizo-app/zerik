# Cavil — Play Console launch checklist

Подготовлено вечером 2026-05-09. Все тексты копи-паст готовы, шаги по порядку. Ничего из этого не нажато — твоя ручная работа утром.

---

## Pre-flight (5 мин)

- [ ] **Production AAB.** Запусти билд в `apps/cavil/`:
  ```
  npx eas-cli build --profile production --platform android --non-interactive --no-wait
  ```
  Скажи мне «билд готов» — дам ссылку на AAB.

- [ ] **Скачай keystore backup.** Expo Console → cavil → Credentials → download → положи в защищённое место (`@qaizo__cavil.jks`). Без него обновления невозможны.

- [ ] **Скриншоты с устройства.** Когда prod-APK на телефоне, сделай 5-6 скриншотов (1080×2340, как все твои до этого):
  1. Today screen — карточка дня с Latin + body + IN THE WILD цитата
  2. Library — список fallacies с COLLECTED / TODAY / locked статусами
  3. Practice — большая цифра streak + 28-дневная сетка
  4. Settings — список с reminder time picker открыт (опц.)
  5. Today — другая карточка для разнообразия
  6. (опц.) Onboarding slide 1

---

## Шаг 1 — Создать app в Play Console

1. https://play.google.com/console — войди
2. **Create app**
   - **App name:** `Cavil — Rhetorical Fallacies`
   - **Default language:** English (US)
   - **App or game:** App
   - **Free or paid:** Free
3. Согласись с Developer Program Policies + US Export Laws → **Create app**

---

## Шаг 2 — Store listing (Main store listing)

### App name
```
Cavil — Rhetorical Fallacies
```

### Short description (max 80 chars)

**EN:**
```
Daily rhetorical fallacies. Spot the trick. Counter the trick.
```
(63 chars)

**RU:**
```
Одна риторическая уловка в день. С готовым контр-приёмом.
```
(57 chars)

### Full description (max 4000 chars)

**EN:**
```
Most arguments are won by the wrong side. Cavil shows you why — one rhetorical fallacy at a time, every day.

Two minutes in the morning. One bad argument, named, decoded, and countered.

WHAT'S INSIDE
• 30+ rhetorical fallacies and growing — Ad Hominem, Strawman, Red Herring, Slippery Slope, False Dichotomy, Tu Quoque, Appeal to Authority, Whataboutism, and more
• For each fallacy: the trick explained, a real-world example you've heard before, and a scripted comeback you can actually say out loud
• Latin name and editorial framing — calm, confident, never academic
• Daily ritual: one card per day, no overload
• Library/Index of all 100 fallacies in Vol. I (more arrive on schedule)
• Practice mode: track your streak, see the last 28 days, count what you've collected

WHO IT'S FOR
• Anyone who's lost an argument they should have won
• Journalists, debaters, students, professionals
• Readers of cognitive science / philosophy / rhetoric
• Anyone who reads news, watches political talk, or works in a meeting

HOW IT FEELS
Less app, more morning paper. Editorial typography (Source Serif). Calm lavender twilight palette. No streaks pressuring you. No gamification noise. Just one fallacy a day, with the comeback your opponent didn't see coming.

WHY CAVIL
Cavil — verb: to make trivial or unfair objections. The rhetorical art of bad faith. We name the move so you can recognize it next time it's used on you.

PRICING
Cavil is free. No ads. No tracking sold to anyone. Premium features arrive later.

PRIVACY
Email (only if you sign in), card progress, and crash reports if you opt in. Nothing else. Full policy: https://qaizo-app.github.io/zerik/legal/privacy.html

PART OF QAIZO STUDIO
Cavil joins Senik (mental models) and Biased (cognitive biases) — three angles on flawed reasoning, one studio, no overlap. The bug in your head, the trick in their mouth, the model in your toolkit.
```
(~1900 chars — well under 4000)

**RU:**
```
Большинство споров выигрывает не та сторона. Cavil показывает почему — одна риторическая уловка в день.

Две минуты утром. Один плохой аргумент — назван, разобран, и для него готов ответ.

ЧТО ВНУТРИ
• 30+ уловок и больше каждый день — Ad Hominem (атака на личность), Соломенное чучело, Отвлекающий манёвр, Скользкий склон, Ложная дилемма, Tu Quoque, Апелляция к авторитету, Whataboutism, и другие
• Для каждой: разбор приёма, узнаваемый пример из жизни и готовая фраза-ответ, которую можно произнести вслух
• Латинское название + editorial-подача: спокойно, без академизма
• Ежедневный ритуал: одна карточка в день, без перегрузки
• Библиотека всех 100 уловок Vol. I (новые приходят по расписанию)
• Practice: твой стрик, последние 28 дней, счётчики собранного

ДЛЯ КОГО
• Тех, кто проиграл спор, который должен был выиграть
• Журналистов, дебатчиков, студентов, переговорщиков
• Читателей когнитивной науки, философии, риторики
• Любого, кто смотрит новости, политические ток-шоу или сидит в совещаниях

КАК ОЩУЩАЕТСЯ
Меньше app — больше утренняя газета. Editorial-типографика (Source Serif). Спокойная палитра лавандовых сумерек. Без давящих стриков. Без gamification-шума. Просто одна уловка в день — и контрудар, которого собеседник не ожидал.

ПОЧЕМУ CAVIL
Cavil (английский глагол) — мелочно или недобросовестно возражать. Искусство спора в дурной вере. Мы называем приём, чтобы ты узнал его в следующий раз, когда его применят к тебе.

ЦЕНА
Cavil бесплатный. Без рекламы. Без продажи данных. Premium появится позже.

ПРИВАТНОСТЬ
Email (только если ты логинишься), прогресс по карточкам, отчёты о сбоях если ты их разрешил. Больше ничего. Полная политика: https://qaizo-app.github.io/zerik/legal/privacy.html

ЧАСТЬ СТУДИИ QAIZO
Cavil в линейке с Senik (ментальные модели) и Biased (когнитивные искажения) — три угла на плохое мышление, одна студия, без пересечений. Баг в голове, уловка в речи, модель в инструментарии.
```
(~2000 chars)

### App icon
- Файл: `apps/cavil/assets/icon-512.png` (512×512) — уже сгенерирован

### Feature graphic
- Файл: `apps/cavil/assets/feature-graphic.png` (1024×500) — уже есть, но в старой жёлтой палитре. Возможно стоит регенерировать под новую (lavender)? Скажи если да.

### Phone screenshots
- Минимум 2, максимум 8 (1080×1920+)
- См. список из Pre-flight

### Categorization
- **App category:** Education
- **Tags (3 max):** Education, Lifestyle, Books & Reference

### Contact details
- **Email:** qaizo.app@gmail.com
- **Phone:** (не обязательно)
- **Website:** https://qaizo-app.github.io/zerik/ (или просто оставь пустым)

### External marketing
☐ Не отмечаем (don't allow Google to promote)

---

## Шаг 3 — Privacy Policy

```
https://qaizo-app.github.io/zerik/legal/privacy.html
```

Уже доступна. Та же что у Senik / Biased — общая на студию.

---

## Шаг 4 — App content (вкладки слева в Play Console)

### Privacy policy
- URL: тот же выше

### App access
- All functionality is available without special access? **YES** (можно использовать без логина — есть «Skip for now»)
- Sign-in is optional — для синхронизации между устройствами и Firestore

### Ads
- **No, my app does not contain ads** ✓

### Content rating
Запусти вопросник. Ответы:

- **App category:** Reference, News, or Education → **Education**
- **Violence:** None
- **Sexual content:** None
- **Profanity:** None  
- **Controlled substances:** None
- **Gambling:** None
- **User-generated content:** None (юзеры не публикуют публично)
- **Real money gambling:** None
- **Web browsing:** Limited (только переходы на privacy/terms — internal Linking)
- **Personalized digital content:** No
- **Health-related content:** None
- **Public interest:** None (it's reference/educational, not news)

Должно дать рейтинг **Everyone** или **Everyone 10+**.

### Target audience and content
- **Target age:** 13-17 + 18+ (мин. 13)
- **Appeals to children?** No
- **Mixed audience?** No (only 13+)

### News app
- Is your app a news app? **No**

### Government app
- **No**

### Data safety
Ключевая форма. Ответы:

**Does your app collect or share any of the required user data types?** YES

**Is all of the user data collected by your app encrypted in transit?** YES

**Do you provide a way for users to request that their data is deleted?** YES (см. https://qaizo-app.github.io/zerik/legal/delete-account.html)

**Data types — что собираем:**
- ✓ Personal info → **Email address** (only if user signs in)
  - Collected: Yes
  - Shared: No
  - Required or optional: Optional
  - Why: Account functionality
- ✓ Personal info → **User IDs** (Firebase UID)
  - Same: collected, not shared, optional, account functionality
- ✓ App activity → **App interactions** (cards opened, saved, streak)
  - Collected: Yes
  - Shared: No
  - Required: Optional
  - Why: App functionality + Analytics (opt-in)
- ✓ App info & performance → **Crash logs**
  - Optional, opt-in only
  - Why: Analytics

**Что НЕ собираем (оставить unchecked):**
- Location, Personal info other than email/UID, Financial info, Health, Messages, Photos, Audio, Files, Calendar, Contacts, Web history, Device IDs (advertising ID не используем)

### News, COVID-19, etc.
- Skip (Not applicable)

### Government — confirmed No

---

## Шаг 5 — Closed Testing track

1. **Testing → Closed testing** в левом меню
2. **Create new track** → name: `Cavil_test1` (или `closed-testers-1`)
3. **Tester management:** Add testers
   - Email list или Google Group
   - Свой email + кому ещё дашь тестировать
4. **Save**

---

## Шаг 6 — Upload AAB + первый release

1. Внутри `Cavil_test1` track → **Create new release**
2. **Upload** → выбери AAB файл (получишь ссылку из EAS после билда)
3. **Release name:** `0.1.0 (1)` (Play Console подтянет автоматически)
4. **Release notes:**

**EN (max 500 chars):**
```
First release of Cavil.

• 30 rhetorical fallacies, en/ru
• Daily editorial card with Latin name and "in the wild" example
• Library/Index of Vol. I (locked future cards preserve daily surprise)
• Practice tab with streak grid
• Save your favourites; choose your reminder time
• Lavender twilight palette, Source Serif typography

More fallacies arriving daily. Per-fallacy illustrations and quiz mode coming next.
```

**RU (max 500 chars):**
```
Первый релиз Cavil.

• 30 риторических уловок (en/ru)
• Editorial-карточка дня с латинским названием и цитатой «в жизни»
• Указатель Vol. I (будущие закрыты — для эффекта сюрприза каждый день)
• Practice-таб со стриком и сеткой 28 дней
• Сохраняй любимые; выбирай время напоминания
• Палитра лавандовых сумерек, шрифт Source Serif

Новые уловки каждый день. Дальше — иллюстрации к каждой и quiz-режим.
```

5. **Save** → **Review release** → **Start rollout to Closed testing**
6. Play Store review (Closed Test обычно 5-30 мин для приложений-новичков, иногда до 24ч)

---

## Шаг 7 — После approval

- Получишь URL вида `https://play.google.com/store/apps/details?id=com.qaizo.cavil` (доступен только тестерам)
- Тестер должен:
  1. Принять приглашение через **Tester invitation link** (ты найдёшь в Closed Testing → tester management → opt-in URL)
  2. Открыть Play Store на телефоне (логин под тем же Google аккаунтом что в тестерах)
  3. Установить Cavil как обычно

### Опциональное приглашение тестерам (можно скопировать в Telegram/email)

**EN:**
```
You're invited to test Cavil — a daily rhetorical fallacies app from Qaizo Studio.

1. Open this link on your Android phone (signed into Google with [your email]): [opt-in URL from Play Console]
2. Tap "Become a tester"
3. Open Play Store, search for Cavil, install
4. Two minutes a day. Spot the trick. Counter the trick.

Feedback welcome. — Qaizo
```

**RU:**
```
Тебя пригласили тестировать Cavil — приложение про риторические уловки от студии Qaizo.

1. Открой ссылку на Android-телефоне (с тем же Google-аккаунтом что [твой email]): [opt-in URL из Play Console]
2. Нажми "Become a tester"
3. В Play Store найди Cavil → установи
4. Две минуты в день. Распознавай уловку. Отвечай на неё.

Фидбек приветствуется. — Qaizo
```

---

## Шаг 8 — После Closed Test работает

- App Check **Enforce mode** (Firebase Console → App Check → cavil-3ee9f → Apps → set Enforce)
  - Только когда метрики Monitor покажут >95% pass rate
- Расширение контента до 100 fallacies (сейчас 30)
- Per-fallacy SVG-иллюстрации (как у Biased)
- Custom Settings экран (последний engine-таб который не custom)
- iOS — RevenueCat key, Apple Developer аккаунт, App Store Connect

---

## Что я НЕ могу сделать сам

- Запустить production build (нужна твоя команда «билд» утром)
- Кликать в Play Console
- Снять скриншоты с устройства
- Подписать AAB (EAS делает это автоматически — keystore настроен)
- Отвечать на review reject если будет (если будет — пришлёшь email Google, разберём)

## Что ты делаешь утром

1. **«Запусти prod билд»** → жду готового AAB (~20 мин)
2. Открываешь Play Console, идёшь по этому документу шаг за шагом
3. Если что-то непонятно/где-то застряли — пишешь, помогаю в реальном времени
4. После Start Rollout — ждём review

Удачи. До завтра.
