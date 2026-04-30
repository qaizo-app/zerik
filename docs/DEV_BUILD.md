# Dev Build для Senik

Гайд по запуску локального development-клиента после первого `eas build`.
Используй `git log` для актуальной истории коммитов — этот файл описывает только текущее устойчивое состояние.

В Expo Go нативные модули `@react-native-firebase/*` не работают — поэтому нужен **dev build** с нативной сборкой через EAS Build.

---

## Текущее состояние (что уже сделано)

Если ты вернулся в проект после паузы — этим уже не нужно заниматься, оно сделано:

- ✅ Expo project: `@qaizo/senik`, projectId `fef49184-7cf2-45f8-a6d1-5ff878c08d3d`
- ✅ EAS init выполнен, `eas.json` сконфигурирован (development / preview / production профили)
- ✅ Firebase project `mental-models-mvp` (location `europe-west1`)
- ✅ Native deps установлены: firebase/app + auth + firestore + analytics + messaging + app-check, google-signin, react-native-purchases
- ✅ `google-services.json` закоммичен (Android Firebase config — публичный, защищён SHA-1 + package name)
- ✅ EAS keystore сгенерирован, SHA-1 `C9:D0:48:85:DF:A2:87:96:8C:BB:99:59:48:59:97:D7:F1:51:98:3E` зарегистрирован в Firebase → OAuth client создан
- ✅ Production Firestore Rules задеплоены (`npm run rules:deploy`, ruleset `41e662cf`)
- ✅ 31 карточка загружена в Firestore (`npm run seed:upload`)
- ✅ App Check код активируется на старте app (`appCheckService.activate()`), debug provider в dev / Play Integrity в production
- ✅ Иконки PNG сгенерированы из `assets/icon.svg` (`npm run icons:generate`)

---

## Build → Install → Run

### 1. Запустить EAS build (когда нужен новый APK)

```powershell
cd c:\Users\bestc_000\Desktop\Zerik\apps\senik
eas build --profile development --platform android
```

Облачная сборка ~10-15 мин. На выходе URL вида `https://expo.dev/accounts/qaizo/projects/senik/builds/<id>`.

Free план EAS — 30 builds/мес. Не пересобирай зря: чисто JS-изменения подхватываются Metro hot-reload без rebuild. Rebuild нужен только при:

- Изменении `app.json` (permissions, plugins, package, version)
- Добавлении нового native package (`expo install <name>`)
- Изменении `google-services.json` или керамических Firebase-конфигов
- Изменении нативного кода (редко)

### 2. Установить APK на телефон

После `Build finished` открой ссылку → Install. На Android разреши «Install from unknown sources» для своего браузера.

Альтернатива через USB:
```powershell
adb install <путь>\application-<id>.apk
```

### 3. Запустить Metro

```powershell
cd c:\Users\bestc_000\Desktop\Zerik\apps\senik
npx expo start --dev-client
```

Открой установленный **Senik** на телефоне → автоматически найдёт Metro по локальной сети.

Если **«There was a problem loading the project» / SocketTimeoutException**:
- Самый надёжный вариант — **USB ADB reverse**: подключи телефон USB-кабелем с включённым USB Debugging → выполни `adb reverse tcp:8081 tcp:8081` → перезапусти app
- Альтернатива — **tunnel-режим**: `npx expo start --dev-client --tunnel` (медленнее, но работает через любой Wi-Fi)

---

## Скрипты в `package.json` (root)

| Команда | Что делает |
|---|---|
| `npm run validate:seed` | Валидирует все JSON в `content/seed/` против `card_schema.json` |
| `npm run syntax:check` | `node -c` проверка JS-файлов engine + apps |
| `npm run seed:upload` | Загружает `content/seed/*.json` в Firestore коллекцию `models` (нужен `serviceAccount.json` в корне) |
| `npm run rules:deploy` | Деплоит `firestore.rules` через Admin SDK (нужен `serviceAccount.json`) |
| `npm run icons:generate` | Перегенерирует PNG-иконки из `apps/senik/assets/icon.svg` |
| `npm run senik` | `expo start` |
| `npm run senik:android` | `expo start --android` (запускает на эмулятор) |

---

## Перед public-релизом в Play Store

1. **App Check** — Firebase Console → App Check → Apps → Android → провайдер **Play Integrity**. Запусти dev APK, скопируй debug-token из logcat → "Manage debug tokens" в Firebase Console. Включи Monitor mode на неделю → потом Enforce. Подробнее в memory `firestore_security_todo.md`.

2. **Production-keystore** — EAS-managed default (тот же что у dev) или Play App Signing. SHA-1 production-сборки зарегистрировать в Firebase отдельно, иначе Google Sign-In упадёт.

3. **EAS Submit** — `eas submit --profile production --platform android --track internal`. Нужен Play Console аккаунт ($25 один раз) + загруженный билд preview profile.

4. **Screenshots** — Play Store требует минимум 2 (рекомендация 5-8) скриншотов 1080×1920+. Снять руками с тестового телефона.

5. **Listing copy** — заголовок, описание, изменения. Готовая копия — `docs/ASO.md`.
