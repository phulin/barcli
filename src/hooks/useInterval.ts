import { useEffect } from 'react';

const useInterval = (callback: () => void, periodMs: number, clear: boolean) => {
  useEffect(() => {
    if (clear) return;
    const interval = setInterval(callback, periodMs);
    return () => clearInterval(interval);
  }, [callback, periodMs, clear]);
};

export default useInterval;
