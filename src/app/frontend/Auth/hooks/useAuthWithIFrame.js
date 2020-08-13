import { useCallback, useEffect, useState, useRef } from 'react';

export function useAuthWithIFrame() {
  const iframeRef = useRef(null);
  const [result, setResult] = useState(null);

  const handleMessage = useCallback(
    event => {
      // checking event source is equal to iframe
      if (
        iframeRef.current === null ||
        iframeRef.current.contentWindow !== event.source
      ) {
        // do nothing
        return;
      }

      if (event.data.type === 'authDone') {
        event.source.postMessage('', event.origin);
      }

      if (event.data.type === 'authCode') {
        const { code, state } = event.data;
        setResult({ code, state });
      }
    },
    [setResult]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return function cleanup() {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return { result, iframeRef };
}
