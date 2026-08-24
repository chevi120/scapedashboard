import { useEffect, useState } from 'react';

// Tracks whether the viewport is narrow enough that horizontal bar charts
// need a smaller axis gutter and a lower inside/outside label threshold -
// on a full-width desktop chart a bar needs ~46px before a label fits inside
// it, but that same 46px eats most of a mobile-width plot.
export function useIsNarrow(breakpoint = 480) {
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isNarrow;
}
