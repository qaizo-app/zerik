import {
  ContentService, ProgressService,
  AuthService, PaywallService,
  analyticsEvents
} from '@engine/core';

import { firebase }   from '../config/firebase.config';
import { paywall }    from '../config/paywall.config';
import { seedCards }  from './seed';

export const contentService = new ContentService({
  collectionName:         firebase.collections.cards,
  userProgressCollection: firebase.collections.userProgress,
  bundledSeed:            seedCards
});

export const progressService = new ProgressService({
  userProgressCollection: firebase.collections.userProgress
});

export const authService = new AuthService({
  googleWebClientId: firebase.googleWebClientId,
  onAnalyticsEvent:  (name, payload) => analyticsEvents.logEvent(name, payload)
});

export const paywallService = new PaywallService({
  iosApiKey:     paywall.iosApiKey,
  androidApiKey: paywall.androidApiKey,
  entitlementId: paywall.entitlementId,
  offeringId:    paywall.offeringId
});
