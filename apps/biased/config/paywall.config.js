// RevenueCat config для Biased.
// Ключи RevenueCat — публичные (по дизайну SDK), безопасно коммитить.
// Подменим заглушки на настоящие после создания products в RC.

export const paywall = {
  iosApiKey:     null,
  androidApiKey: null,
  entitlementId: 'pro',
  offeringId:    'default',
  products: {
    monthly: 'biased_pro_monthly_299',  // $2.99/mo
    yearly:  'biased_pro_yearly_1999'   // $19.99/yr
  }
};
