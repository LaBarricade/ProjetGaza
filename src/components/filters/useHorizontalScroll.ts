import { useEffect, useRef } from 'react';

export function useHorizontalScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;

    isDragging.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseLeave = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;

    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = x - startX.current;

    ref.current.scrollLeft = scrollLeft.current - walk;
  };

  // Wheel → horizontal scroll (non-passive)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  return {
    ref,
    handlers: {
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      onMouseMove,
    },
  };
}
