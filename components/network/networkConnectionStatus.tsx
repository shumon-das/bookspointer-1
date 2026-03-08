// import * as Network from 'expo-network';
// import { useCallback, useEffect, useState } from 'react';

// export function useNetworkStatus(onReconnect?: () => void) {
//   const [isOnline, setIsOnline] = useState<boolean | null>(null);
//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     // This internal function handles the "Ping" logic
//     async function checkRealInternet() {
//       try {
//         // 1. Get the OS state first (Fast)
//         const state = await Network.getNetworkStateAsync();
        
//         // 2. If OS says 'No', we stop here.
//         if (!state.isConnected) {
//           if (isMounted) {
//             setIsOnline(false);
//             setIsInitializing(false);
//           }
//           return;
//         }

//         // 3. If OS says 'Yes', we verify by pinging a tiny 1-byte file
//         const response = await fetch('https://connectivitycheck.gstatic.com/generate_204', {
//           method: 'HEAD',
//         });

//         if (isMounted) {
//           const wasOffline = isOnline === false;
//           const nowOnline = response.ok || response.status === 204;

//           setIsOnline(nowOnline);
//           setIsInitializing(false);

//           // If we just transitioned from Offline -> Online, trigger the sync
//           if (wasOffline && nowOnline && onReconnect) {
//             onReconnect();
//           }
//         }
//       } catch (error) {
//         // If the fetch fails, the user has "fake" internet (No Megabytes)
//         if (isMounted) {
//           setIsOnline(false);
//           setIsInitializing(false);
//         }
//       }
//     }

//     // Initial check
//     checkRealInternet();

//     // Listen for signal changes (like switching from 4G to Wi-Fi)
//     const subscription = Network.addNetworkStateListener(() => {
//       checkRealInternet();
//     });

//     return () => {
//       isMounted = false;
//       subscription.remove();
//     };
//   }, []); // We watch isOnline to know when it changes from false to true

//   return { isOnline, isInitializing };
// }
import { useEffect, useRef, useState } from "react";
import * as Network from "expo-network";

export function useNetworkStatus(onReconnect?: () => void) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const previousOnline = useRef<boolean | null>(null);
  const checking = useRef(false);

  async function checkInternet() {
    if (checking.current) return; // prevent duplicate calls
    checking.current = true;

    try {
      const state = await Network.getNetworkStateAsync();

      if (!state.isConnected) {
        updateState(false);
        return;
      }

      // verify real internet
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(
        "https://connectivitycheck.gstatic.com/generate_204",
        { method: "HEAD", signal: controller.signal }
      );

      clearTimeout(timeout);

      const online = res.status === 204 || res.ok;
      updateState(online);

    } catch {
      updateState(false);
    } finally {
      checking.current = false;
    }
  }

  function updateState(online: boolean) {
    const prev = previousOnline.current;

    setIsOnline(online);
    setIsInitializing(false);

    if (prev === false && online && onReconnect) {
      onReconnect();
    }

    previousOnline.current = online;
  }

  useEffect(() => {
    checkInternet();

    const subscription = Network.addNetworkStateListener(() => {
      checkInternet();
    });

    return () => subscription.remove();
  }, []);

  return { isOnline, isInitializing, refreshNetwork: checkInternet };
}
