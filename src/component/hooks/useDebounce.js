import { useState, useEffect } from 'react';

export default function useDebounce(value, delay) {
  const [valueDebounced, setValueDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValueDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return valueDebounced;
}
