"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

// Hook simplificado especificamente para artigos (versão otimizada)
export const useArticleViewTracking = (
  articleId: string,
  trackingData: Record<string, any>,
  TrackArticleView: (articleId: string, data: Record<string, any>) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasInitialView, setHasInitialView] = useState(false);
  const hasLeftRef = useRef(false);
  const isTrackingRef = useRef(false); // Previne múltiplas chamadas simultâneas

  // Registrar view inicial
  const registerInitialView = useCallback(() => {
    if (!hasInitialView && articleId && !isTrackingRef.current) {
      isTrackingRef.current = true;
      TrackArticleView(articleId, {
        ...trackingData,
        viewType: 'initial',
        timestamp: new Date().toISOString()
      });
      setHasInitialView(true);
      setTimeout(() => {
        isTrackingRef.current = false;
      }, 100); // Debounce
    }
  }, [hasInitialView, articleId, TrackArticleView, trackingData]);

  // Setup do observer
  useEffect(() => {
    const element = ref.current;
    if (!element || !articleId || !hasInitialView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Só registra se artigo já saiu e não está trackando no momento
            if (hasLeftRef.current && !isTrackingRef.current) {
              isTrackingRef.current = true;
              TrackArticleView(articleId, {
                ...trackingData,
                viewType: 'reappear',
                intersectionRatio: entry.intersectionRatio,
                timestamp: new Date().toISOString()
              });
              hasLeftRef.current = false;
              setTimeout(() => {
                isTrackingRef.current = false;
              }, 100); // Debounce
            }
          } else {
            hasLeftRef.current = true;
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [articleId, hasInitialView]); // Dependências mínimas

  return {
    ref,
    registerInitialView,
    hasInitialView
  };
};

// Hook específico para tracking de tempo de leitura
export const useArticleReadingTime = (
  articleId: string,
  trackingData: Record<string, any>,
  TrackArticleView: (articleId: string, data: Record<string, any>) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isReading, setIsReading] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const totalReadingTimeRef = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || !articleId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Artigo começou a ser lido
            if (!isReading) {
              setIsReading(true);
              startTimeRef.current = Date.now();
            }
          } else {
            // Artigo saiu da tela
            if (isReading && startTimeRef.current) {
              const sessionTime = Date.now() - startTimeRef.current;
              totalReadingTimeRef.current += sessionTime;
              setReadingTime(totalReadingTimeRef.current);
              
              // Registra evento de tempo de leitura
              TrackArticleView(articleId, {
                ...trackingData,
                viewType: 'reading_time',
                sessionTime: Math.round(sessionTime / 1000), // em segundos
                totalReadingTime: Math.round(totalReadingTimeRef.current / 1000),
                timestamp: new Date().toISOString()
              });
              
              setIsReading(false);
              startTimeRef.current = null;
            }
          }
        });
      },
      {
        threshold: 0.3, // 30% do artigo visível para começar a contar
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Registra tempo final se estiver lendo
      if (isReading && startTimeRef.current) {
        const sessionTime = Date.now() - startTimeRef.current;
        totalReadingTimeRef.current += sessionTime;
        
        TrackArticleView(articleId, {
          ...trackingData,
          viewType: 'reading_time_final',
          sessionTime: Math.round(sessionTime / 1000),
          totalReadingTime: Math.round(totalReadingTimeRef.current / 1000),
          timestamp: new Date().toISOString()
        });
      }
    };
  }, [articleId, isReading, TrackArticleView, trackingData]);

  return {
    ref,
    isReading,
    readingTime: Math.round(readingTime / 1000), // em segundos
    totalReadingTime: Math.round(totalReadingTimeRef.current / 1000)
  };
};