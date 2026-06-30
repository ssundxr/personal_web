"use client";

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export function SmoothScroller({ children }: { children: React.ReactNode }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices — Lenis fights iOS/Android native momentum
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // On touch devices, pass children through without Lenis wrapper
  // iOS/Android have excellent native momentum scrolling that Lenis disrupts
  if (isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
