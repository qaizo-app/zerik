# Dev Build для Mental Models

Гайд по сборке development-клиента, который запускает приложение **с настоящим Firebase** (не на bundled seed). После этого:

- Auth (Email/Google) реально работает — пользователь логинится в твой Firebase project
- Карточки приходят из Firestore коллекции `models`
- Голосования пишутся в `scenario_stats` с distributed counters
- Прогресс синхронизируется в `user_progress/{uid}`

В Expo Go нативные модули `@react-native-firebase/*` не работают — поэтому нужен **dev build** с нативной сборкой.

---

## Что нужно установить один раз

### 1. Expo account

Если ещё нет — зарегистрируйся бесплатно на [expo.dev](https://expo.dev). Понадобится email + пароль.

### 2. EAS CLI

```powershell
npm install -g eas-cli
eas login
```

Логин один раз, токен живёт долго. Проверь:
```powershell
eas whoami
```

### 3. Native модули в проекте

Сейчас `paywallService` и `authService` в коде имеют graceful fallback (`tryFirestore()` возвращает `null` если модуль недоступен). После добавления модулей — Firebase заработает автоматически.

```powershell
cd c:\Users\bestc_000\Desktop\Zerik\apps\mental-models

npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/auth
npx expo install @react-native-firebase/firestore
npx expo install @react-native-firebase/analytics
npx expo install @react-native-google-signin/google-signin
npx expo install react-native-purchases
```

`expo install` подбирает версии, совместимые с Expo SDK 54. Не используй обычный `npm install` — версии могут разойтись.

### 4. Расширить app.json для Firebase

Добавь в `apps/mental-models/app.json` секцию `plugins` и ссылку на google-services:

```json
"plugins": [
  "expo-font",
  "@react-native-firebase/app",
  "@react-native-firebase/auth"
],
"android": {
  "package": "com.zerik.mentalmodels",
  "googleServicesFile": "./google-services.json",
  "adaptiveIcon": {
    "backgroundColor": "#0E1014"
  }
}
```

`google-services.json` уже лежит в `apps/mental-models/` (ты скачал его раньше).

---

## Первый dev build (10-15 минут)

### 1. Инициализация EAS

```powershell
cd c:\Users\bestc_000\Desktop\Zerik\apps\mental-models
eas init
```

EAS спросит создать новый проект — соглашайся. Создаст `projectId` и положит его в `app.json`.

### 2. Настройка профилей сборки

```powershell
eas build:configure
```

Создаст `eas.json` с тремя профилями: `development`, `preview`, `production`. Тебе нужен **development**.

Проверь что в `eas.json` профиль `development` имеет `developmentClient: true`:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

### 3. Сборка APK

```powershell
eas build --profile development --platform android
```

EAS отправляет проект в облако и собирает APK ~10 минут. Получишь URL вида `https://expo.dev/.../builds/...`. Дождись `Build finished`.

### 4. Установка APK на телефон

В выводе EAS будет ссылка на `.apk`. Два пути:
- **Через QR** — открой ссылку в браузере телефона → Download → Install (нужно разрешение «Install from unknown sources»)
- **Через USB** — скачай `.apk` на компьютер, потом:
  ```powershell
  adb install путь\к\application-xxxx.apk
  ```

После установки на телефоне появится приложение **Mental Models** (рядом с другими, как настоящее).

---

## Запуск с dev build

### 1. Старт Metro

```powershell
cd c:\Users\bestc_000\Desktop\Zerik\apps\mental-models
npx expo start --dev-client
```

`--dev-client` = режим для собранного APK (вместо Expo Go).

### 2. Подключение телефона

Открой установленный **Mental Models** на телефоне. Он сам найдёт Metro и начнёт грузить bundle. Если не находит — встряхни телефон → введи URL вручную (`exp://10.x.x.x:8081`).

### 3. Что должно произойти

При первом запуске:
- Onboarding (3 слайда)
- Today таб с карточкой Sunk Cost
- При нажатии **Sign in** → реальная Google авторизация → создаётся юзер в Firebase Auth
- При голосовании в scenario → шард `scenario_stats/sunk_cost/shards/shard_X` создаётся в Firestore (открой Firebase Console → Firestore → `scenario_stats` → увидишь данные)
- При Save → `user_progress/{твой_uid}` обновляется

---

## Загрузка карточек в Firestore

Сейчас карточки приходят из bundled seed (12 штук в `apps/mental-models/src/seed.js`). Чтобы они работали с настоящего бэкенда:

### Создать сервисный аккаунт Firebase

1. Firebase Console → Project Settings → Service Accounts → **Generate new private key**
2. Скачается `.json` файл — переименуй в `serviceAccount.json`
3. Положи в `c:\Users\bestc_000\Desktop\Zerik\` (корень workspace)
4. **Не коммить!** В `.gitignore` уже есть `*.key`, добавь явно `serviceAccount.json`

### Скрипт загрузки

Создай `scripts/upload-seed.js`:

```js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(require('../serviceAccount.json'))
});

const db = admin.firestore();
const dir = path.join(__dirname, '..', 'content', 'seed');

(async () => {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const f of files) {
    const card = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    await db.collection('models').doc(card.id).set(card);
    console.log(`✓ ${card.id}`);
  }
  console.log(`\nUploaded ${files.length} cards.`);
  process.exit(0);
})();
```

```powershell
cd c:\Users\bestc_000\Desktop\Zerik
npm install firebase-admin
node scripts/upload-seed.js
```

В Firebase Console → Firestore → коллекция `models` появится 12 документов.

После этого `contentService.getCardChain()` будет возвращать карточки из Firestore (если в нём свежее, чем bundled seed).

---

## Troubleshooting

### `eas init` ошибка

Если `eas init` ругается на «no Expo account» — проверь `eas whoami`. Если пусто — `eas login`.

### `eas build` ошибка

В выводе будет конкретная ошибка. Частые:
- `keystore` нужно сгенерировать → `eas credentials` выберет `Generate new keystore`
- `google-services.json` не найден — проверь путь в `app.json`
- Версии модулей конфликтуют → `npx expo doctor` покажет несовместимости

### APK устанавливается, но падает при запуске

Открой логи через `adb`:
```powershell
adb logcat | findstr ReactNative
```

Часто это:
- Не подключён `googleServicesFile` в `app.json`
- Bundle id в Firebase не совпадает с `app.json`

### Слишком медленные сборки

- Первая сборка 10-15 минут, последующие ~5-7 минут (благодаря кэшу EAS)
- Бесплатный тариф EAS — 30 builds/месяц. Для разработки достаточно.

---

## Что НЕ нужно для первого dev build

- iOS app (отложен до Apple Developer)
- RevenueCat (paywall работает в demo-режиме)
- Apple Sign-In (только Google)
- Cloud Functions (агрегация шардов делается клиентом)
- Sentry (можно добавить позже)

Это всё подключим позже, по мере готовности линейки.

---

## После первого успешного dev build

1. Прислать скриншот того что в Firebase Console после первого голосования и логина
2. Загрузить 12 карточек в Firestore через `upload-seed.js`
3. Проверить что в `Today` табе карточки приходят из Firestore (сравнить timestamps в Firebase vs в seed.js)
4. Сделать первый production-ready build через `eas build --profile preview` для тестировщиков
