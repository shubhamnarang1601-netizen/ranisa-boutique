# Ranisa Boutique Android
Native Android shopping app, with white/wine/gold styling and five bottom tabs.
Uses the shared product catalogue and website product images; no demo products.

Implemented: category/search/sort, product gallery, available size selection,
persistent wishlist and bag, quantities, Google OAuth PKCE, Android Keystore encrypted
session/address storage, delivery form, Razorpay SDK callbacks, order history,
payment recovery UI, shipment tracking UI, custom measurements to boutique WhatsApp,
policies, and administrator-only sizing controls.

Checkout/recovery/live tracking require activation of the reviewed mobile commerce
service. The existing website backend is unchanged. The APK is not an assertion
that production payment and shipment operations have been activated or tested.

Build: JDK 17, Android SDK 36, Gradle 9.6.0.
gradle :app:assembleDebug :app:lintDebug
Device checks: gradle :app:assembleDebugAndroidTest, then install both APKs
and run the SmokeInstrumentation runner.
