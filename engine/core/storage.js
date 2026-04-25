// Тонкая обёртка вокруг AsyncStorage с safe-parse и опциональным TTL.
// Используется всеми сервисами движка для локального кэша.

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem(key, defaultValue = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    if (__DEV__) console.warn(`[storage.getItem] ${key}:`, e);
    return defaultValue;
  }
}

export async function setItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (__DEV__) console.warn(`[storage.setItem] ${key}:`, e);
    return false;
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

// TTL-обёртка: значение хранится с timestamp, читается только если не протухло.

export async function getCached(key, ttlMs) {
  const wrapper = await getItem(key, null);
  if (!wrapper || !wrapper._ts) return null;
  if (Date.now() - wrapper._ts > ttlMs) return null;
  return wrapper.value;
}

export async function setCached(key, value) {
  return setItem(key, { _ts: Date.now(), value });
}
