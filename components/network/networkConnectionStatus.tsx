import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export function useNetworkStatus(onReconnect?: () => void) {
  const [actualStatus, setActualStatus] = useState<boolean | null>(null); // trusted final state
  const [tempStatus, setTempStatus] = useState<boolean | null>(null);     // temporary/raw

  useEffect(() => {
    let previous: boolean | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const checkConnection = async () => {
      const status = await Network.getNetworkStateAsync();
      const isOnline = status.isInternetReachable ?? false;
      setTempStatus(isOnline);

      // If currently offline, delay before updating actualStatus
      if (!isOnline) {
        timer = setTimeout(() => {
          setActualStatus(false);
        }, 3000); // wait 3 seconds before showing offline
      } else {
        clearTimeout(timer);
        setActualStatus(true);

        if (previous === false && isOnline === true && onReconnect) {
          onReconnect(); // 🔁 sync if needed
        }
      }

      previous = isOnline;
    };

    const interval = setInterval(checkConnection, 5000); // check every 5s
    checkConnection(); // check once immediately

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return actualStatus;
}
