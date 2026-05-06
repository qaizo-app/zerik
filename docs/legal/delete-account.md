# Account & Data Deletion

_Last updated: 2026-05-06_

This page explains how to delete your account and the data associated with it. It applies to all Qaizo Studio apps, including **Senik** and **Biased**.

## How to delete your account from inside the App

1. Open the App on your device.
2. Tap the **Settings** icon (top right of the main screen).
3. Scroll down to the **Account** section.
4. Tap **Delete account**.
5. Confirm the action when prompted.

Your account will be deleted immediately. You may be asked to sign in again if your last login was more than a few minutes ago — this is a security requirement from Firebase Authentication.

## How to delete your account by email request

If you cannot access the App (e.g. you signed in on a device you no longer have), email us at **qaizo.app@gmail.com** from the email address associated with your account, with the subject line **"Delete my account"**.

We will process your request within **30 days** and reply to confirm completion.

## What data is deleted

When you delete your account, the following is deleted **immediately and permanently**:

- Your **email address** stored by Firebase Authentication
- Your **unique user ID** (Firebase UID)
- Your **personal progress document** in Firestore — daily streak, opened cards, swipe history, scenario votes, saved cards, settings (notifications, language, analytics opt-in)

## What data is retained

The following data is **retained in anonymized form** and cannot be associated back to you:

- **Aggregate voting statistics.** When you voted on an interactive scenario, your vote was added to a global counter (e.g. "63% of readers chose option A"). These counters store only totals — never your individual choice or any identifier. Removing your account does not remove these aggregate counts (and there is no way to do so, as the data was never personally identifiable).
- **Anonymous crash logs**, if you had opted in to crash reporting in Settings. Crash logs contain a stack trace, OS version, and device model — no email, no UID. They are retained for up to **90 days** for debugging purposes and then automatically purged.

## What data is never collected

Qaizo apps do **not** collect or store: location, contacts, photos, files, microphone, camera, advertising ID, payment information, content of messages, or browsing history.

## Subscription handling

If you have an active premium subscription:

- Account deletion does **not** automatically cancel your Google Play or App Store subscription.
- To cancel on Android: **Google Play Store → Profile → Payments & subscriptions → Subscriptions → cancel**.
- To cancel on iOS: **Settings → [your name] → Subscriptions → cancel**.
- Refunds for unused subscription periods are subject to the respective store's refund policy.

## Contact

If you have questions about deletion, data retention, or this page in general:

**Email:** qaizo.app@gmail.com
**Privacy Policy:** [Privacy](privacy.html)
**Terms of Service:** [Terms](terms.html)
