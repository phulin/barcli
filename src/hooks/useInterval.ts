import { useEffect } from 'react';

const useInterval = (callback: () => void, periodMs: number) => {
  useEffect(() => {
    const interval = setInterval(callback, periodMs);
    return () => clearInterval(interval);
  }, []);
};

export default useInterval;
