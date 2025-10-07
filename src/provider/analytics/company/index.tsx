"use client";

import { api } from "@/service/api";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";

// ==================== ENUMS ====================
export enum EventType {
  VIEW = "view",
  VIEW_END = "view_end",
  CLICK = "click",
  WHATSAPP_CLICK = "whatsapp_click",
  MAP_CLICK = "map_click",
  PROFILE_VIEW = "profile_view",
  INSTAGRAM_CLICK = "instagram_click",
  PHONE_CLICK = "phone_click",
  SHARE = "share",
}

// ==================== INTERFACES DE DADOS ====================
export interface ICompanyEvent {
  event_type: EventType;
  virtual_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ITotalCompanyEvent {
  event_type: EventType;
  total: number;
}

export interface IEventMetrics {
  views: number;
  clicks: number;
  whatsappClicks: number;
  mapClicks: number;
  profileViews: number;
  totalEngagement: number;
  conversionRate: number;
}

// ==================== INTERFACES DE API ====================
interface IEventsByCompanyResponse {
  message: string;
  events: ICompanyEvent[];
}

interface ITotalEventsResponse {
  message: string;
  events: ITotalCompanyEvent[];
}

interface IRegisterEventResponse {
  message: string;
  event: any;
}

interface IUpdateVirtualEventResponse {
  message: string;
  updated: any;
}

// ==================== INTERFACES DE PARÂMETROS ====================
export interface IRegisterEventProps {
  companyId: string;
  eventType: EventType;
  extra_data?: Record<string, any>;
  virtualIncrement?: number;
}

export interface IUpdateVirtualEventProps {
  company_id: string;
  eventType: EventType;
  newVirtualCount?: number;
}

export interface ITrackingOptions {
  debounce?: boolean;
  debounceTime?: number;
  offline?: boolean;
  batch?: boolean;
}

// ==================== INTERFACE DO CONTEXTO ====================
interface ICompanyAnalyticsContext {
  // Funções de tracking
  RegisterCompanyEvent(data: IRegisterEventProps): Promise<void>;
  TrackCompanyView(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyClick(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyWhatsappClick(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyMapClick(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyProfileView(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyInstagramClick(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyPhoneClick(companyId: string, extraData?: Record<string, any>): Promise<void>;
  TrackCompanyShare(companyId: string, extraData?: Record<string, any>): Promise<void>;

  // Funções de dados
  GetEventsByCompany(companyId: string): Promise<void>;
  GetTotalEvents(): Promise<void>;
  UpdateVirtualEvent(data: IUpdateVirtualEventProps): Promise<void>;
  GetCompanyMetrics(companyId: string): IEventMetrics | null;

  // Batch operations
  BatchTrackEvents(events: IRegisterEventProps[]): Promise<void>;
  FlushPendingEvents(): Promise<void>;

  // Estados
  companyEvents: Record<string, ICompanyEvent[]>;
  totalEvents: ITotalCompanyEvent[];
  companyMetrics: Record<string, IEventMetrics>;
  loading: boolean;
  error: string | null;
  pendingEvents: IRegisterEventProps[];

  // Utilidades
  ClearError(): void;
  ClearCache(companyId?: string): void;
  SetTrackingOptions(options: ITrackingOptions): void;
}

// ==================== HOOK PERSONALIZADO ====================
export const useCompanyAnalytics = () => {
  const context = useContext(CompanyAnalyticsContext);
  
  if (!context) {
    // Retornar um objeto mock em desenvolvimento se o provider não estiver configurado
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "CompanyAnalyticsContext não encontrado. Retornando funções mock."
      );
      return createMockAnalytics();
    }
    
    throw new Error(
      "useCompanyAnalytics deve ser usado dentro de CompanyAnalyticsProvider"
    );
  }
  
  return context;
};

// ==================== MOCK PARA DESENVOLVIMENTO ====================
const createMockAnalytics = (): Partial<ICompanyAnalyticsContext> => ({
  TrackCompanyClick: async () => console.log("Mock: TrackCompanyClick"),
  TrackCompanyView: async () => console.log("Mock: TrackCompanyView"),
  TrackCompanyWhatsappClick: async () => console.log("Mock: TrackCompanyWhatsappClick"),
  TrackCompanyMapClick: async () => console.log("Mock: TrackCompanyMapClick"),
  TrackCompanyProfileView: async () => console.log("Mock: TrackCompanyProfileView"),
  loading: false,
  error: null,
});

// ==================== CONTEXTO ====================
export const CompanyAnalyticsContext = createContext<ICompanyAnalyticsContext>(
  {} as ICompanyAnalyticsContext
);

// ==================== PROVIDER ====================
export const CompanyAnalyticsProvider = ({ children }: { children: ReactNode }) => {
  // Estados principais
  const [companyEvents, setCompanyEvents] = useState<Record<string, ICompanyEvent[]>>({});
  const [totalEvents, setTotalEvents] = useState<ITotalCompanyEvent[]>([]);
  const [companyMetrics, setCompanyMetrics] = useState<Record<string, IEventMetrics>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingEvents, setPendingEvents] = useState<IRegisterEventProps[]>([]);

  // Refs para debounce e batch
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const batchTimer = useRef<NodeJS.Timeout | null>(null);
  const trackingOptions = useRef<ITrackingOptions>({
    debounce: true,
    debounceTime: 1000,
    offline: true,
    batch: true,
  });

  // Função para calcular métricas
  const calculateMetrics = useCallback((events: ICompanyEvent[]): IEventMetrics => {
    const metrics: IEventMetrics = {
      views: 0,
      clicks: 0,
      whatsappClicks: 0,
      mapClicks: 0,
      profileViews: 0,
      totalEngagement: 0,
      conversionRate: 0,
    };

    events.forEach((event) => {
      const count = event.virtual_count || 0;
      metrics.totalEngagement += count;

      switch (event.event_type) {
        case EventType.VIEW:
          metrics.views += count;
          break;
        case EventType.CLICK:
          metrics.clicks += count;
          break;
        case EventType.WHATSAPP_CLICK:
          metrics.whatsappClicks += count;
          break;
        case EventType.MAP_CLICK:
          metrics.mapClicks += count;
          break;
        case EventType.PROFILE_VIEW:
          metrics.profileViews += count;
          break;
      }
    });

    // Calcular taxa de conversão (cliques / visualizações)
    if (metrics.views > 0) {
      metrics.conversionRate = (metrics.clicks / metrics.views) * 100;
    }

    return metrics;
  }, []);

  // Função base para registrar evento com retry e offline support
  const RegisterCompanyEvent = useCallback(
    async ({
      companyId,
      eventType,
      extra_data = {},
      virtualIncrement = 1,
    }: IRegisterEventProps): Promise<void> => {
      // Se estiver offline e configurado para suportar, adicionar à fila
      if (!navigator.onLine && trackingOptions.current.offline) {
        setPendingEvents((prev) => [
          ...prev,
          { companyId, eventType, extra_data, virtualIncrement },
        ]);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const requestData = {
        companyId,
        eventType,
        extra_data: {
          ...extra_data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        virtualIncrement,
      };

      try {
        await api.post("/analytics/event-company", requestData, config);
      } catch (err: any) {
        console.warn("Erro ao registrar evento:", err);
        
        // Se falhar, adicionar à fila para retry
        if (trackingOptions.current.offline) {
          setPendingEvents((prev) => [
            ...prev,
            { companyId, eventType, extra_data, virtualIncrement },
          ]);
        }
      }
    },
    []
  );

  // Batch tracking de eventos
  const BatchTrackEvents = useCallback(
    async (events: IRegisterEventProps[]): Promise<void> => {
      if (events.length === 0) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      try {
        await api.post("/analytics/event-company/batch", { events }, config);
        
        // Limpar eventos pendentes que foram enviados
        setPendingEvents([]);
      } catch (err: any) {
        console.warn("Erro ao enviar eventos em batch:", err);
      }
    },
    []
  );

  // Flush de eventos pendentes
  const FlushPendingEvents = useCallback(async (): Promise<void> => {
    if (pendingEvents.length > 0) {
      await BatchTrackEvents(pendingEvents);
    }
  }, [pendingEvents, BatchTrackEvents]);

  // Auto-flush quando voltar online
  useEffect(() => {
    const handleOnline = () => {
      FlushPendingEvents();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [FlushPendingEvents]);

  // Auto-batch de eventos
  useEffect(() => {
    if (trackingOptions.current.batch && pendingEvents.length > 0) {
      if (batchTimer.current) {
        clearTimeout(batchTimer.current);
      }

      batchTimer.current = setTimeout(() => {
        FlushPendingEvents();
      }, 5000); // Flush a cada 5 segundos

      // Ou flush quando atingir 10 eventos
      if (pendingEvents.length >= 10) {
        FlushPendingEvents();
      }
    }

    return () => {
      if (batchTimer.current) {
        clearTimeout(batchTimer.current);
      }
    };
  }, [pendingEvents, FlushPendingEvents]);

  // Funções de tracking com debounce
  const createTrackFunction = useCallback(
    (eventType: EventType) => {
      return async (
        companyId: string,
        extraData?: Record<string, any>
      ): Promise<void> => {
        const key = `${companyId}-${eventType}`;

        if (trackingOptions.current.debounce) {
          // Cancelar timer anterior se existir
          if (debounceTimers.current[key]) {
            clearTimeout(debounceTimers.current[key]);
          }

          // Criar novo timer
          debounceTimers.current[key] = setTimeout(() => {
            RegisterCompanyEvent({
              companyId,
              eventType,
              extra_data: extraData,
            });
            delete debounceTimers.current[key];
          }, trackingOptions.current.debounceTime);
        } else {
          // Sem debounce, registrar imediatamente
          await RegisterCompanyEvent({
            companyId,
            eventType,
            extra_data: extraData,
          });
        }
      };
    },
    [RegisterCompanyEvent]
  );

  // Funções de tracking específicas
  const TrackCompanyView = useMemo(() => createTrackFunction(EventType.VIEW), [createTrackFunction]);
  const TrackCompanyClick = useMemo(() => createTrackFunction(EventType.CLICK), [createTrackFunction]);
  const TrackCompanyWhatsappClick = useMemo(() => createTrackFunction(EventType.WHATSAPP_CLICK), [createTrackFunction]);
  const TrackCompanyMapClick = useMemo(() => createTrackFunction(EventType.MAP_CLICK), [createTrackFunction]);
  const TrackCompanyProfileView = useMemo(() => createTrackFunction(EventType.PROFILE_VIEW), [createTrackFunction]);
  const TrackCompanyInstagramClick = useMemo(() => createTrackFunction(EventType.INSTAGRAM_CLICK), [createTrackFunction]);
  const TrackCompanyPhoneClick = useMemo(() => createTrackFunction(EventType.PHONE_CLICK), [createTrackFunction]);
  const TrackCompanyShare = useMemo(() => createTrackFunction(EventType.SHARE), [createTrackFunction]);

  // Buscar eventos por empresa (com cache)
  const GetEventsByCompany = useCallback(async (companyId: string): Promise<void> => {
    // Se já tem cache e não está muito antigo (5 minutos), usar cache
    if (companyEvents[companyId] && Date.now() - 300000 < Date.now()) {
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token de autenticação não encontrado");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await api.get(
        `/analytics/event-company/${companyId}/company`,
        config
      );
      const responseData: IEventsByCompanyResponse = response.data.response;
      const events = responseData.events || [];

      setCompanyEvents((prev) => ({
        ...prev,
        [companyId]: events,
      }));

      // Calcular e armazenar métricas
      const metrics = calculateMetrics(events);
      setCompanyMetrics((prev) => ({
        ...prev,
        [companyId]: metrics,
      }));
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao buscar eventos do comércio");
    } finally {
      setLoading(false);
    }
  }, [companyEvents, calculateMetrics]);

  // Buscar totais de eventos
  const GetTotalEvents = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token de autenticação não encontrado");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await api.get("/analytics/event-company", config);
      const responseData: ITotalEventsResponse = response.data.response;
      setTotalEvents(responseData.events || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao buscar totais de eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar evento virtual
  const UpdateVirtualEvent = useCallback(
    async ({
      company_id,
      eventType,
      newVirtualCount,
    }: IUpdateVirtualEventProps): Promise<void> => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Token de autenticação não encontrado");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const requestData = {
        eventType,
        newVirtualCount,
      };

      try {
        await api.patch(
          `/analytics/event-company/${company_id}/company`,
          requestData,
          config
        );
        
        // Atualizar cache local
        await GetEventsByCompany(company_id);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao atualizar evento virtual");
      } finally {
        setLoading(false);
      }
    },
    [GetEventsByCompany]
  );

  // Obter métricas calculadas
  const GetCompanyMetrics = useCallback(
    (companyId: string): IEventMetrics | null => {
      return companyMetrics[companyId] || null;
    },
    [companyMetrics]
  );

  // Limpar erro
  const ClearError = useCallback((): void => {
    setError(null);
  }, []);

  // Limpar cache
  const ClearCache = useCallback((companyId?: string): void => {
    if (companyId) {
      setCompanyEvents((prev) => {
        const updated = { ...prev };
        delete updated[companyId];
        return updated;
      });
      setCompanyMetrics((prev) => {
        const updated = { ...prev };
        delete updated[companyId];
        return updated;
      });
    } else {
      setCompanyEvents({});
      setCompanyMetrics({});
      setTotalEvents([]);
    }
  }, []);

  // Configurar opções de tracking
  const SetTrackingOptions = useCallback((options: ITrackingOptions): void => {
    trackingOptions.current = {
      ...trackingOptions.current,
      ...options,
    };
  }, []);

  // Valor do contexto memoizado
  const contextValue = useMemo(
    () => ({
      // Funções de tracking
      RegisterCompanyEvent,
      TrackCompanyView,
      TrackCompanyClick,
      TrackCompanyWhatsappClick,
      TrackCompanyMapClick,
      TrackCompanyProfileView,
      TrackCompanyInstagramClick,
      TrackCompanyPhoneClick,
      TrackCompanyShare,
      
      // Funções de dados
      GetEventsByCompany,
      GetTotalEvents,
      UpdateVirtualEvent,
      GetCompanyMetrics,
      
      // Batch operations
      BatchTrackEvents,
      FlushPendingEvents,
      
      // Estados
      companyEvents,
      totalEvents,
      companyMetrics,
      loading,
      error,
      pendingEvents,
      
      // Utilidades
      ClearError,
      ClearCache,
      SetTrackingOptions,
    }),
    [
      RegisterCompanyEvent,
      TrackCompanyView,
      TrackCompanyClick,
      TrackCompanyWhatsappClick,
      TrackCompanyMapClick,
      TrackCompanyProfileView,
      TrackCompanyInstagramClick,
      TrackCompanyPhoneClick,
      TrackCompanyShare,
      GetEventsByCompany,
      GetTotalEvents,
      UpdateVirtualEvent,
      GetCompanyMetrics,
      BatchTrackEvents,
      FlushPendingEvents,
      companyEvents,
      totalEvents,
      companyMetrics,
      loading,
      error,
      pendingEvents,
      ClearError,
      ClearCache,
      SetTrackingOptions,
    ]
  );

  return (
    <CompanyAnalyticsContext.Provider value={contextValue}>
      {children}
    </CompanyAnalyticsContext.Provider>
  );
};

// Export default
export default CompanyAnalyticsProvider;