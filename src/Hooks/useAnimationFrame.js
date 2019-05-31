import {useLayoutEffect, useRef} from 'react'

// todo how do I cancel this
export const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  // todo: understand how this works
  // also there was useMutationEffect here
  // and I removed it because it's no longer present in React
  callbackRef.current = callback;

  const loop = () => {
    frameRef.current = requestAnimationFrame(
      loop
    );
    const cb = callbackRef.current;
    cb();
  };

  const frameRef = useRef();
  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(
      loop
    );
    return () =>
      cancelAnimationFrame(frameRef.current);
  }, []);
};
