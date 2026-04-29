# TODO — Senik (Mental Models)

Список накопленных правок для следующей итерации билда. Когда наберётся достаточно
пунктов или появится критичный — сделать один коммит-серию + один EAS build +
upload в Play Console (Closed testing).

---

## 🐛 Bugs

### History показывает все опубликованные карточки новому юзеру
**Severity:** medium (UX-путаница для свежих установок)
**Discovered:** 2026-04-28, build #2 в Play Closed testing.

**Симптом:** Новый пользователь, ни разу не открывший карточку, видит в табе History 7 карточек (всё что seed-нул в Firestore по `release_date <= today`).

**Корень:** `apps/mental-models/App.js:215`
```js
getHistory={async () => contentService.getCardChain({ limit: 50 })}
```
`getCardChain` — это **архив контента**, а не **история юзера**. В `engine/core/progressService.js` нет поля `opened_card_ids` — `recordCardOpened()` хранит только counter и `last_opened_date`.

**Fix:**
1. `progressService.js` → `DEFAULT_PROGRESS` добавить `opened_card_ids: []`
2. `recordCardOpened(cardId)` пушит id в массив (с дедупом)
3. Добавить `async getOpenedIds()`
4. В `App.js` route History:
   ```js
   getHistory={async () => {
     const ids = await progressService.getOpenedIds();
     if (ids.length === 0) return [];
     const all = await contentService.getCardChain({ limit: 50 });
     return all.filter(c => ids.includes(c.id));
   }}
   ```
5. Убедиться что `recordCardOpened(card.id)` реально вызывается из CardScreen с `card.id`.
6. `migrateGuestToCloud()` — добавить union для `opened_card_ids`.

---

## ⚙️ Build / Tooling

### Expo Doctor — 4 устаревших пакета
**Discovered:** 2026-04-28, EAS build #2 (id `26944d46-a3ed-4042-af47-fc79c963ea02`).

`expo doctor` падает с warning `4 packages out of date`:
- `expo-dev-client`
- `expo-notifications`
- `expo-updates` (29.0.16 → ~29.0.17)
- (4-й пакет — посмотреть в логах билда)

**Fix:**
```bash
cd apps/mental-models
npx expo install --check
```
Закоммитить отдельно: `chore(deps): expo install --check`.

---

### Android — отключить R8/Proguard для тестовых билдов
**Discovered:** 2026-04-28, Play Console warning «С типом App Bundle не связан ни один файл деобфускации».

**Корень:** В `apps/mental-models/app.json` plugin `expo-build-properties` не задаёт `enableProguardInReleaseBuilds`, дефолт SDK 54 → R8 включён, mapping.txt не загружается → крэши в Play Console будут нечитаемые stack-trace'ы (`a.b.c: NullPointerException`).

**Fix:** В `app.json` → plugin `expo-build-properties` → `android`:
```json
"enableProguardInReleaseBuilds": false,
"enableShrinkResourcesInReleaseBuilds": false
```
Коммит: `chore(android): disable R8 for testing builds`.

Для prod-релиза (когда выйдем в production) можно вернуть R8 + настроить EAS на загрузку `mapping.txt` в Play Console через `submit`.

---

## 📋 Play Console — обязательные разделы для production

Не блокирует Closed testing, но без них не пустят в Open testing / Production:

- [ ] Data safety (анкета о сборе данных)
- [ ] Content rating (квиз IARC)
- [ ] Target audience (возраст; скорее всего 13+)
- [ ] App access (тестовый аккаунт для ревью Google, если логин обязателен)
- [ ] Privacy policy URL — есть на GitHub Pages, проверить что прописан
- [ ] Магазинная карточка: название, краткое и полное описание, скриншоты (мин. 2), иконка 512×512, feature graphic 1024×500

---

## 🔒 Security (из старых TODO)

- [ ] Firestore Rules — закрыть default open rules до 2026-05-25 (см. memory/firestore_security_todo.md)
- [ ] App Check Play Integrity — включить enforcement в Firebase Console после первого успешного клиентского App Check ack

---

_Обновлено: 2026-04-28_
