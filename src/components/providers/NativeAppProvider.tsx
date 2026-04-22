"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isNative } from '@/lib/capacitor';

interface NativeAppContextType {
  isNativePlatform: boolean;
}

const NativeAppContext = createContext<NativeAppContextType>({
  isNativePlatform: false,
});

export const useNativeApp = () => useContext(NativeAppContext);

export const NativeAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);

  useEffect(() => {
    const checkPlatform = () => {
      const native = isNative();
      setIsNativePlatform(native);
      
      if (native) {
        document.documentElement.classList.add('is-native');
      } else {
        document.documentElement.classList.remove('is-native');
      }
    };

    checkPlatform();
  }, []);

  return (
    <NativeAppContext.Provider value={{ isNativePlatform }}>
      {children}
    </NativeAppContext.Provider>
  );
};
