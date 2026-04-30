// RevenueCat config для Senik. API keys получишь после создания
// проекта в app.revenuecat.com и привязки к App Store Connect / Play Console.
//
// Ключи RevenueCat — публичные (по дизайну SDK), безопасно коммитить.
// Подменим заглушки на настоящие после создания products в RC.

export const paywall = {
  // Пока RC не настроен — null. paywallService увидит null и не вызовет configure.
  // После создания products в RC заменить на полученные ключи (они публичные, ок коммитить).
  iosApiKey:     null,
  androidApiKey: null,
  entitlementId: 'pro',
  offeringId:    'default',
  products: {
    monthly: 'mm_pro_monthly_499',  // $4.99/mo
    yearly:  'mm_pro_yearly_2999'   // $29.99/yr
  }
};
