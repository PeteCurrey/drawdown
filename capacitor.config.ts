import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.drawdown.app',
  appName: 'Drawdown',
  webDir: 'out',
  server: {
    // IMPORTANT: Point this to your production URL once deployed
    // For local development, you can use your machine's IP (e.g., http://192.168.1.XX:3000)
    url: 'https://drawdown.trading', 
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#c8a96e'
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
