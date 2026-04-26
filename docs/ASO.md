# ASO — App Store Optimization для Mental Models

Заготовки описаний и тексты для Google Play / App Store. Финальная адаптация под лимиты сторов делается перед submit.

## Lockup

| Параметр | RU | EN |
|---|---|---|
| **App name** (max 30 chars) | Mental Models · Модели дня | Mental Models · One a Day |
| **Short description** (Play, max 80 chars) | Одна ментальная модель в день. Тренировка ясного мышления. | One mental model a day. A short editorial for clearer thinking. |
| **Subtitle** (App Store, max 30 chars) | Одна модель мышления в день | One thinking model a day |

## Категории

- **Primary:** Education
- **Secondary:** Lifestyle (Books в App Store)
- **Content rating:** 12+ (есть упоминание этики, философии, но без graphic content)

## Keywords (App Store, max 100 chars total)

```
mental models, thinking, decision, bias, cognitive, philosophy, paradox, reasoning, daily, kahneman
```

## Long description (full, RU)

```
Ментальные модели — это маленькие линзы, через которые опытные люди смотрят на мир. Эффект невозвратных затрат. Бритва Оккама. Парадокс Симпсона. Каждая — это короткое объяснение реальности, которое работает тогда, когда обычная интуиция даёт сбой.

Mental Models — приложение с одной такой моделью в день. Не справочник, а редакторская колонка: конкретная сцена из жизни, объяснение принципа, интерактивный сценарий с голосованием, и одно действие на сегодня.

ЧТО ВНУТРИ
• 30+ моделей мышления — когнитивные искажения, ментальные модели, парадоксы, мысленные эксперименты
• Каждая карточка занимает 2-3 минуты чтения
• Интерактивные сценарии с глобальной статистикой ответов (Moral Machine от MIT, Harvard surveys и др.)
• Уровни глубины — свайп вверх раскрывает биохимию, теорию информации, философский разбор
• Стрик-механика — простой ритуал каждый день
• Сохранения, история, поиск
• Двуязычно: русский / английский

ДЛЯ КОГО
• Предпринимателям и founders — для решений с высокой ценой ошибки
• Продакт-менеджерам и консультантам — для проверки гипотез
• Студентам и преподавателям MBA — для системного мышления
• Всем кто читает Канемана, Талеба, Мангера, Поппера

ОТЛИЧИЕ ОТ ДРУГИХ ПРИЛОЖЕНИЙ
В отличие от справочников по биасам, Mental Models — это редакторские колонки в формате одной карточки в день. В отличие от книжных саммари (Blinkist, Headway), у нас оригинальный авторский контент, не пересказ.

Приложение работает офлайн. Подписка $4.99/мес или $29.99/год открывает все уровни глубины, сохранения, историю. Без подписки — одна карточка в день бесплатно навсегда.

Студия [Zerik] делает серию приложений в этой нише. Если Mental Models понравится — следующие будут о когнитивных искажениях, парадоксах, мысленных экспериментах.
```

## Long description (full, EN)

```
Mental models are small lenses through which experienced people see the world. The sunk cost fallacy. Occam's razor. Simpson's paradox. Each one is a short explanation of reality that works exactly when ordinary intuition fails.

Mental Models is an app with one such model a day. Not a reference — an editorial column: a concrete real-life scene, the underlying principle, an interactive scenario with voting, and one small action for today.

INSIDE
• 30+ thinking models — cognitive biases, mental models, paradoxes, thought experiments
• Each card is a 2-3 minute read
• Interactive scenarios with global voting stats (MIT Moral Machine, Harvard surveys, and more)
• Depth levels — swipe up to unlock biochemistry, information theory, philosophical commentary
• Streak mechanic — a simple daily ritual
• Save, history, search
• Bilingual: Russian / English

WHO IT'S FOR
• Founders and entrepreneurs — for decisions with high cost of being wrong
• Product managers and consultants — for hypothesis testing
• MBA students and educators — for systems thinking
• Anyone reading Kahneman, Taleb, Munger, Popper

WHAT MAKES IT DIFFERENT
Unlike reference apps for biases, Mental Models is editorial — one card a day, original copy. Unlike book summaries (Blinkist, Headway), this is original content, not rehashed chapters.

Works offline. $4.99/mo or $29.99/yr unlocks all depth levels, saves, history. Without subscription — one card a day free forever.

[Zerik] Studio is building a series of apps in this niche. If you enjoy Mental Models, look for upcoming apps on cognitive biases, paradoxes, and thought experiments.
```

## What's New (release notes template)

**v0.1.0 — Initial Release** (RU)
```
Первый релиз. 30 ментальных моделей, мысленных экспериментов и парадоксов.
Стрики, библиотека сохранённых, поиск.
```

**v0.1.0 — Initial Release** (EN)
```
First release. 30 mental models, thought experiments, and paradoxes.
Streaks, saved library, search.
```

## Screenshots

5 шт нужны для Play Store, 6.5" экран (1242×2208 минимум). Снимки делаются с реального устройства после `npx expo start --dev-client`. Лучшие кадры:

1. **Today** таб с открытой карточкой Sunk Cost — ярко-янтарная палитра, drop-cap, body, principle
2. **Сценарий** на Sunk Cost после голосования — видны проценты ответов, big-stat
3. **Trolley Problem** с historical_data блоком (MIT 40M responses, regional split)
4. **Library** — список сохранённых карточек с разными палитрами категорий
5. **Settings** — переключатель языка, daily reminder toggle, раздел "Other studio apps"

Опционально 6-я: **Onboarding слайд** — для дисплея в галерее Play Store.

## Иконка

SVG-source: [`apps/mental-models/assets/AppIconSvg.js`](../apps/mental-models/assets/AppIconSvg.js).

Для Play Store нужен PNG 1024×1024. Конвертация из SVG:
- Через online SVG→PNG converter (cloudconvert, Inkscape headless)
- Или Figma/Sketch — импорт SVG → export как PNG @ 1024
- Положить в `apps/mental-models/assets/icon.png`
- В `app.json` указать `"icon": "./assets/icon.png"`

Adaptive icon Android (foreground 1024×1024 без фона):
- Тот же SVG, убрать `<Rect>` фон
- Export PNG → `apps/mental-models/assets/adaptive-icon.png`
- В `app.json` под `android.adaptiveIcon`:
  ```json
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#0E1014"
  }
  ```

## Splash screen

Пока используется backgroundColor `#0E1014` без image. Если нужна графика:
- 1242×2436 PNG, центральный символ из иконки на тёмном фоне
- В `app.json`:
  ```json
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "cover",
    "backgroundColor": "#0E1014"
  }
  ```

## Pre-launch checklist

- [ ] icon.png 1024×1024 в `assets/`
- [ ] adaptive-icon.png 1024×1024 (foreground) в `assets/`
- [ ] splash.png 1242×2436 (опц.)
- [ ] 5 screenshots на устройстве 6.5"+
- [ ] Длинное описание RU + EN скопировано в Play Console
- [ ] Privacy Policy URL — нужен (используем шаблон Qaizo)
- [ ] Content rating анкета в Play Console
- [ ] Закрытое тестирование (Internal Testing track) с 5+ тестировщиками
- [ ] EAS production build (`eas build --profile production --platform android`)
- [ ] Загрузить .aab в Play Console
- [ ] Submit к ревью

## Privacy Policy

Используем тот же шаблон что Qaizo, адаптировано под Mental Models. Хостится на zerik.app/privacy/mental-models. Минимальный набор пунктов:
- Какие данные собираем (Firebase Auth — email, Firestore — прогресс, голосования)
- Зачем (синхронизация прогресса между устройствами, статистика голосований)
- Кому передаём (Google Firebase, RevenueCat — после подключения)
- Как удалить аккаунт (in-app + email на support@)

Эти пункты — обязательные для Play Store с 2024 года.
