"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isNative, setupPushNotifications } from '@/lib/capacitor';
import { createClient } from '@/lib/supabase/client';

interface NativeAppContextType {
  isNativePlatform: boolean;
}

const NativeAppContext = createContext<NativeAppContextType>({
  isNativePlatform: false,
});

export const useNativeApp = () => useContext(NativeAppContext);

export const NativeAppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isNativePlatform, setIsNativePlatform] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const initNativeApp = async () => {
      const native = isNative();
      setIsNativePlatform(native);
      
      if (native) {
        document.documentElement.classList.add('is-native');
        
        // APP GATE: Redirect unauthenticated app users to login
        // If they are on the marketing home "/" and in the app, we want them in the dashboard
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Setup notifications for authenticated user
          setupPushNotifications(session.user.id).catch(console.error);
          
          // If on home page, push to dashboard
          if (pathname === '/') {
            router.replace('/dashboard');
          }
        } else {
          // Force login if in app and not logged in
          if (pathname === '/') {
            router.replace('/login');
          }
        }
      } else {
        document.documentElement.classList.remove('is-native');
      }
    };

    initNativeApp();
  }, [pathname, router, supabase.auth]);

  return (
    <NativeAppContext.Provider value={{ isNativePlatform }}>
      {children}
    </NativeAppContext.Provider>
  );
};

