// PaywallService — обёртка над RevenueCat. Управление подписками и
// entitlement-проверками. Один entitlement `pro` с двумя продуктами:
// monthly и yearly.
//
// API ключи RevenueCat — публичные (по дизайну SDK), кладутся в paywall.config.js
// приложения, не секреты.

import { Platform } from 'react-native';

let _Purchases = null;
try {
  _Purchases = require('react-native-purchases').default;
} catch (e) {}

export class PaywallService {
  /**
   * @param {object} config
   * @param {string} config.iosApiKey      RevenueCat iOS API key
   * @param {string} config.androidApiKey  RevenueCat Android API key
   * @param {string} config.entitlementId  Например 'pro'
   * @param {string} config.offeringId     Например 'default'
   */
  constructor(config) {
    this.iosApiKey      = config.iosApiKey;
    this.androidApiKey  = config.androidApiKey;
    this.entitlementId  = config.entitlementId  || 'pro';
    this.offeringId     = config.offeringId     || 'default';
    this._configured    = false;
  }

  isAvailable() { return !!_Purchases; }

  async configure(uid) {
    if (!_Purchases) return false;
    if (this._configured) {
      if (uid) try { await _Purchases.logIn(uid); } catch (e) {}
      return true;
    }

    const apiKey = Platform.OS === 'ios' ? this.iosApiKey : this.androidApiKey;
    if (!apiKey) {
      if (__DEV__) console.warn('[PaywallService.configure] missing API key for', Platform.OS);
      return false;
    }

    try {
      _Purchases.configure({ apiKey, appUserID: uid || null });
      this._configured = true;
      return true;
    } catch (e) {
      if (__DEV__) console.warn('[PaywallService.configure]', e?.message);
      return false;
    }
  }

  async logIn(uid) {
    if (!_Purchases) return;
    try { await _Purchases.logIn(uid); } catch (e) {}
  }

  async logOut() {
    if (!_Purchases) return;
    try { await _Purchases.logOut(); } catch (e) {}
  }

  // ─── plans ──────────────────────────────────────────────────────────────

  async getOfferings() {
    if (!_Purchases) return null;
    try {
      const offerings = await _Purchases.getOfferings();
      return offerings.all?.[this.offeringId] || offerings.current || null;
    } catch (e) {
      if (__DEV__) console.warn('[PaywallService.getOfferings]', e?.message);
      return null;
    }
  }

  async getCustomerInfo() {
    if (!_Purchases) return null;
    try {
      return await _Purchases.getCustomerInfo();
    } catch (e) {
      return null;
    }
  }

  async hasActiveSubscription() {
    const info = await this.getCustomerInfo();
    if (!info) return false;
    return !!info.entitlements?.active?.[this.entitlementId];
  }

  async getSubscriptionDetails() {
    const info = await this.getCustomerInfo();
    const ent  = info?.entitlements?.active?.[this.entitlementId];
    if (!ent) return { active: false, plan: null, renews_at: null, expires_at: null };
    return {
      active: true,
      plan: ent.productIdentifier,
      renews_at: ent.expirationDate,
      expires_at: ent.expirationDate,
      will_renew: ent.willRenew
    };
  }

  // ─── purchase ───────────────────────────────────────────────────────────

  async purchasePackage(rcPackage) {
    if (!_Purchases) return { success: false, error: 'purchases_unavailable' };
    try {
      const { customerInfo } = await _Purchases.purchasePackage(rcPackage);
      const active = !!customerInfo.entitlements?.active?.[this.entitlementId];
      return { success: active, customerInfo };
    } catch (e) {
      if (e.userCancelled) return { success: false, error: 'cancelled' };
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }

  async restorePurchases() {
    if (!_Purchases) return { success: false, error: 'purchases_unavailable' };
    try {
      const customerInfo = await _Purchases.restorePurchases();
      return { success: true, customerInfo };
    } catch (e) {
      return { success: false, error: e.code || 'unknown', message: e.message };
    }
  }
}

export default PaywallService;
