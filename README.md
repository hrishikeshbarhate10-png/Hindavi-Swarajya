# Hindavi Swarajya

Explore the invincible forts of the Maratha Empire. Discover the legacy of Chhatrapati Shivaji Maharaj.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Drizzle ORM
- **Database**: Supabase (PostgreSQL)
- **PWA**: vite-plugin-pwa + Workbox
- **Mobile**: Capacitor (iOS + Android)

---

## Development

Start dev server, build for production, or start production server using the npm scripts in package.json.

---

## Mobile App Setup (Capacitor)

This app is configured with Capacitor to package as a native iOS and Android app.

### Prerequisites

| Platform | Requirements |
|---|---|
| Android | Android Studio (any OS) |
| iOS | Xcode + CocoaPods (Mac only) |

### Workflow every time you update the app

1. Build the web app: npx vite build
2. Sync to native: npx cap sync

### Run on Android

Run: npx cap open android

In Android Studio:
1. Wait for Gradle sync to complete
2. Select a device or emulator
3. Click Run

### Run on iOS (Mac only)

Install CocoaPods once: sudo gem install cocoapods

Then run: npx cap open ios

In Xcode:
1. Select your target device or simulator
2. Click Run
3. For physical device: set Apple Developer Team under Signing & Capabilities

### App Configuration

| Setting | Value |
|---|---|
| App ID | com.hindavi.swarajya |
| App Name | Hindavi Swarajya |
| Web output dir | dist/public |
| Config file | capacitor.config.ts |

### Publish to App Stores

- Google Play Store: Build > Generate Signed Bundle in Android Studio. Requires Google Play Developer account (25 USD one-time).
- Apple App Store: Product > Archive > Distribute in Xcode. Requires Apple Developer account (99 USD/year).

---

## AdMob Configuration

The app uses `@capacitor-community/admob` to show banner ads on the Forts list and Fort detail screens.

### Development (current)

Google's official test IDs are used so no real ads are loaded during development. Test mode is automatically enabled when running `npm run dev` (`import.meta.env.DEV = true`).

### Production — required steps before publishing

**1. Create your AdMob account and ad units**

Sign in at https://admob.google.com and create:
- One Android app → note the App ID and create a Banner ad unit
- One iOS app → note the App ID and create a Banner ad unit

**2. Set environment variables (Replit Secrets panel)**

| Variable | Description |
|---|---|
| `VITE_ADMOB_ANDROID_APP_ID` | Your Android AdMob App ID (ca-app-pub-…~…) |
| `VITE_ADMOB_IOS_APP_ID` | Your iOS AdMob App ID (ca-app-pub-…~…) |
| `VITE_ADMOB_ANDROID_BANNER_ID` | Your Android banner ad unit ID |
| `VITE_ADMOB_IOS_BANNER_ID` | Your iOS banner ad unit ID |

**3. Update native manifest files**

Replace the test app IDs with your real ones in:

- `android/app/src/main/AndroidManifest.xml` — the `com.google.android.gms.ads.APPLICATION_ID` meta-data value
- `ios/App/App/Info.plist` — the `GADApplicationIdentifier` string value

**4. Sync and rebuild**

```
npx vite build
npx cap sync
```

Then open Android Studio / Xcode and build a release. Test mode is off automatically in production builds.

---

## Database

Supabase (PostgreSQL) is used. Set SUPABASE_DATABASE_URL in Replit environment secrets.

To switch databases: set DB_ADAPTER environment variable (default: postgres).
To add a new database: create server/adapters/<db>.ts implementing IStorage, register in server/storage.ts.

---

## PWA

On production builds, Workbox generates a service worker that:
- Precaches all JS/CSS/HTML assets at install time
- NetworkFirst for API calls (10s timeout, 24h cache)
- CacheFirst for images and fonts
- Offline navigation fallback to index.html

Install via Add to Home Screen in Chrome (Android) or Safari (iOS).
