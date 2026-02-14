import * as Network from 'expo-network';
import { useCallback, useEffect, useState } from 'react';

// export function useNetworkStatus(onReconnect?: () => void) {
  // const [actualStatus, setActualStatus] = useState<boolean | null>(null); // trusted final state
  // const [tempStatus, setTempStatus] = useState<boolean | null>(null);     // temporary/raw

  // useEffect(() => {
  //   let previous: boolean | null = null;
  //   let timer: ReturnType<typeof setTimeout>;

  //   const checkConnection = async () => {
  //     const status = await Network.getNetworkStateAsync();
  //     const isOnline = status.isInternetReachable ?? false;
  //     setTempStatus(isOnline);

  //     // If currently offline, delay before updating actualStatus
  //     if (!isOnline) {
  //       timer = setTimeout(() => {
  //         setActualStatus(false);
  //       }, 3000); // wait 3 seconds before showing offline
  //     } else {
  //       clearTimeout(timer);
  //       setActualStatus(true);

  //       if (previous === false && isOnline === true && onReconnect) {
  //         onReconnect(); // 🔁 sync if needed
  //       }
  //     }

  //     previous = isOnline;
  //   };

  //   const interval = setInterval(checkConnection, 5000); // check every 5s
  //   checkConnection(); // check once immediately

  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timer);
  //   };
  // }, []);

  // return { 
  //   isOnline: actualStatus, 
  //   isInitializing: actualStatus === null 
  // };
  // 1. Initialize with null to track the 'loading' state accurately
  
  
  
  // const [isOnline, setIsOnline] = useState<boolean | null>(null);
  // const [isInitializing, setIsInitializing] = useState(true);

  // useEffect(() => {
  //   let isMounted = true;
  //   let previousStatus: boolean | null = null;

  //   const updateStatus = async () => {
  //     const state = await Network.getNetworkStateAsync();
  //     const currentOnline = !!state.isInternetReachable;

  //     if (isMounted) {
  //       // Trigger onReconnect only if we were previously offline
  //       if (previousStatus === false && currentOnline === true && onReconnect) {
  //         onReconnect();
  //       }
        
  //       setIsOnline(currentOnline);
  //       setIsInitializing(false);
  //       previousStatus = currentOnline;
  //     }
  //   };

  //   // 2. Immediate check on mount
  //   updateStatus();

  //   // 3. Event Listener (High Performance)
  //   // If using Expo, use Network.addNetworkStateListener
  //   const subscription = Network.addNetworkStateListener(() => {
  //     updateStatus();
  //   });

  //   return () => {
  //     isMounted = false;
  //     subscription.remove(); // Clean up listener
  //   };
  // }, []);

  // return { isOnline, isInitializing };
  // }

export function useNetworkStatus(onReconnect?: () => void) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // This internal function handles the "Ping" logic
    async function checkRealInternet() {
      try {
        // 1. Get the OS state first (Fast)
        const state = await Network.getNetworkStateAsync();
        
        // 2. If OS says 'No', we stop here.
        if (!state.isConnected) {
          if (isMounted) {
            setIsOnline(false);
            setIsInitializing(false);
          }
          return;
        }

        // 3. If OS says 'Yes', we verify by pinging a tiny 1-byte file
        const response = await fetch('https://connectivitycheck.gstatic.com/generate_204', {
          method: 'HEAD',
        });

        if (isMounted) {
          const wasOffline = isOnline === false;
          const nowOnline = response.ok || response.status === 204;

          setIsOnline(nowOnline);
          setIsInitializing(false);

          // If we just transitioned from Offline -> Online, trigger the sync
          if (wasOffline && nowOnline && onReconnect) {
            onReconnect();
          }
        }
      } catch (error) {
        // If the fetch fails, the user has "fake" internet (No Megabytes)
        if (isMounted) {
          setIsOnline(false);
          setIsInitializing(false);
        }
      }
    }

    // Initial check
    checkRealInternet();

    // Listen for signal changes (like switching from 4G to Wi-Fi)
    const subscription = Network.addNetworkStateListener(() => {
      checkRealInternet();
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, [isOnline]); // We watch isOnline to know when it changes from false to true

  return { isOnline, isInitializing };
}
