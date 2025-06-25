"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  hasBeenVisible: boolean;
  intersectionCount: number;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const { threshold = 0.5, rootMargin = "0px", triggerOnce = false } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [intersectionCount, setIntersectionCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isCurrentlyIntersecting = entry.isIntersecting;

          setIsIntersecting(isCurrentlyIntersecting);

          if (isCurrentlyIntersecting) {
            setHasBeenVisible(true);
            setIntersectionCount((prev) => prev + 1);
          }

          if (triggerOnce && isCurrentlyIntersecting) {
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return {
    ref,
    isIntersecting,
    hasBeenVisible,
    intersectionCount,
  };
};

// Hook específico para tracking de banners
interface UseBannerIntersectionTrackingReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  registerInitialView: () => void;
  hasInitialView: boolean;
  intersectionCount: number;
}

export const useBannerIntersectionTracking = (
  bannerId: string,
  trackingData: Record<string, any>,
  trackingFunction: (bannerId: string, data: Record<string, any>) => void
): UseBannerIntersectionTrackingReturn => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasInitialView, setHasInitialView] = useState(false);
  const [intersectionCount, setIntersectionCount] = useState(0);
  const hasLeftRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoizar função de tracking para evitar re-criação
  const trackReappearView = useCallback(
    (intersectionRatio: number) => {
      if (bannerId && hasInitialView) {
        trackingFunction(bannerId, {
          ...trackingData,
          viewType: "reappear",
          intersectionRatio,
          intersectionCount: intersectionCount + 1,
          timestamp: new Date().toISOString(),
        });
        setIntersectionCount((prev) => prev + 1);
      }
    },
    [bannerId, hasInitialView, trackingFunction, intersectionCount]
  );

  // Função para registrar view inicial
  const registerInitialView = useCallback(() => {
    if (!hasInitialView && bannerId) {
      trackingFunction(bannerId, {
        ...trackingData,
        viewType: "initial",
        timestamp: new Date().toISOString(),
      });
      setHasInitialView(true);
      setIntersectionCount(1);
    }
  }, [hasInitialView, bannerId, trackingFunction, trackingData]);

  // Setup do Intersection Observer
  useEffect(() => {
    const element = ref.current;
    if (!element || !bannerId || !hasInitialView) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (hasLeftRef.current) {
              trackReappearView(entry.intersectionRatio);
              hasLeftRef.current = false;
            }
          } else {
            hasLeftRef.current = true;
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [bannerId, hasInitialView]);

  // Cleanup geral quando componente desmonta
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ref,
    registerInitialView,
    hasInitialView,
    intersectionCount,
  };
};

export const useBannerViewTracking = (
  bannerId: string,
  trackingData: Record<string, any>,
  TrackBannerView: (bannerId: string, data: Record<string, any>) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasInitialView, setHasInitialView] = useState(false);
  const hasLeftRef = useRef(false);
  const isTrackingRef = useRef(false);

  // Registrar view inicial
  const registerInitialView = useCallback(() => {
    if (!hasInitialView && bannerId && !isTrackingRef.current) {
      isTrackingRef.current = true;
      TrackBannerView(bannerId, {
        ...trackingData,
        viewType: "initial",
        timestamp: new Date().toISOString(),
      });
      setHasInitialView(true);
      setTimeout(() => {
        isTrackingRef.current = false;
      }, 100);
    }
  }, [hasInitialView, bannerId, TrackBannerView, trackingData]);

  // Setup do observer
  useEffect(() => {
    const element = ref.current;
    if (!element || !bannerId || !hasInitialView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (hasLeftRef.current && !isTrackingRef.current) {
              isTrackingRef.current = true;
              TrackBannerView(bannerId, {
                ...trackingData,
                viewType: "reappear",
                intersectionRatio: entry.intersectionRatio,
                timestamp: new Date().toISOString(),
              });
              hasLeftRef.current = false;
              setTimeout(() => {
                isTrackingRef.current = false;
              }, 100);
            }
          } else {
            hasLeftRef.current = true;
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [bannerId, hasInitialView]);

  return {
    ref,
    registerInitialView,
    hasInitialView,
  };
};
