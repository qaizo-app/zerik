// Singleton-фабрика сервисов движка для Senik.
// Импортируется компонентами через useServices() (см. ниже) или напрямую.

import {
  ContentService, VotingService, ProgressService,
  AuthService, PaywallService,
  analyticsEvents
} from '@engine/core';

import { firebase } from '../config/firebase.config';
import { paywall }  from '../config/paywall.config';
import { seedCards } from './seed';

export const contentService = new ContentService({
  collectionName:        firebase.collections.cards,
  statsCollectionName:   firebase.collections.scenarioStats,
  userProgressCollection:firebase.collections.userProgress,
  bundledSeed:           seedCards
});

export const votingService = new VotingService({
  statsCollectionName: firebase.collections.scenarioStats,
  minVotesToShow:      1000
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
