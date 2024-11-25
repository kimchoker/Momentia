'use client';

import { useEffect, useRef } from 'react';

const InfiniteScrollObserver = ({ onIntersect, disabled }) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect, disabled]);

  return <div ref={observerRef} className="h-1" />;
};

export default InfiniteScrollObserver;
