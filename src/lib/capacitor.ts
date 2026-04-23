import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Checks if the app is running in a native platform (iOS/Android)
 */
export const isNative = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Provides haptic feedback if running on a native platform
 */
export const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
  if (isNative()) {
    try {
      await Haptics.impact({ style });
    } catch (e) {
      console.warn('Haptics not available', e);
    }
  }
};

/**
 * Setup Push Notifications
 */
export const setupPushNotifications = async (userId: string) => {
  if (!isNative()) return;

  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();

  // On success, we should save the token to Supabase associated with the user
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push registration success, token: ' + token.value);
    
    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();
    
    const { error } = await (supabase as any)
      .from('push_tokens')
      .upsert({
        user_id: userId,
        token: token.value,
        platform: Capacitor.getPlatform(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'token' });

    if (error) {
      console.error('Error saving push token to database:', error);
    }
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.error('Error on registration: ' + JSON.stringify(error));
  });

  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ' + JSON.stringify(notification));
  });
};

/**
 * Gets device information for analytics or platform-specific logic
 */
export const getDeviceInfo = async () => {
  if (isNative()) {
    return await Device.getInfo();
  }
  return null;
};

