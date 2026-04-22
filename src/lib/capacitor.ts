import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

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
 * Gets device information for analytics or platform-specific logic
 */
export const getDeviceInfo = async () => {
  if (isNative()) {
    return await Device.getInfo();
  }
  return null;
};
