// RevenueCat config для Cavil. Заполнить после создания products в RC.
// Ключи RevenueCat — публичные (по дизайну SDK), безопасно коммитить.

export const paywall = {
  iosApiKey:     null,
  androidApiKey: null,                // TODO: получить после привязки в app.revenuecat.com
  entitlementId: 'pro',
  offeringId:    'default',
  products: {
    monthly: 'cavil_pro_monthly_299',  // $2.99/mo (как Biased — ниже-ценовой сегмент)
    yearly:  'cavil_pro_yearly_1999'   // $19.99/yr
  }
};
