"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState } from "react";

// Enums corretos do projeto
export enum EventType {
  VIEW = "view",
  VIEW_END = "view_end",
  CLICK = "click",
  WHATSAPP_CLICK = "whatsapp_click",
  MAP_CLICK = "map_click",
  PROFILE_VIEW = "profile_view",
}

// Interfaces dos dados
export interface BannerEvent {
  event_type: EventType;
  virtual_count: number;
}

export interface TotalBannerEvent {
  event_type: EventType;
  total: number;
}

// Interfaces das respostas da API
interface IEventsByBannerResponse {
  message: string;
  events: BannerEvent[];
}

interface ITotalEventsResponse {
  message: string;
  events: TotalBannerEvent[];
}

interface IRegisterEventResponse {
  message: string;
  event: any;
}

interface IUpdateVirtualEventResponse {
  message: string;
  updated: any;
}

// Interfaces para parâmetros das funções
interface IRegisterEventProps {
  bannerId: string;
  eventType: EventType;
  extra_data?: Record<string, any>;
  virtualIncrement?: number;
}

interface IUpdateVirtualEventProps {
  banner_id: string;
  eventType: EventType;
  newVirtualCount?: number;
}

// Interface principal do contexto
interface IBannerAnalyticsData {
  RegisterBannerEvent(data: IRegisterEventProps): Promise<void>;
  TrackBannerView(
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackBannerClick(
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackBannerProfileView(
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void>;

  GetEventsByBanner(bannerId: string): Promise<void>;
  GetTotalEvents(): Promise<void>;
  UpdateVirtualEvent(data: IUpdateVirtualEventProps): Promise<void>;

  bannerEvents: Record<string, BannerEvent[]>;
  totalEvents: TotalBannerEvent[];
  loading: boolean;
  error: string | null;

  ClearError(): void;
}

interface IChildrenReact {
  children: ReactNode;
}

export const BannerAnalyticsContext = createContext<IBannerAnalyticsData>(
  {} as IBannerAnalyticsData
);

export const BannerAnalyticsProvider = ({ children }: IChildrenReact) => {
  const [bannerEvents, setBannerEvents] = useState<
    Record<string, BannerEvent[]>
  >({});
  const [totalEvents, setTotalEvents] = useState<TotalBannerEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para registrar evento (pública - sem auth)
  const RegisterBannerEvent = async ({
    bannerId,
    eventType,
    extra_data = {},
    virtualIncrement = 1,
  }: IRegisterEventProps): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const requestData = {
      bannerId,
      eventType,
      extra_data,
      virtualIncrement,
    };

    const response = await api
      .post("/analytics/event-banner", requestData, config)
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Erro ao registrar evento");
        setLoading(false);
        return err;
      });

    return response;
  };

  // Função para buscar eventos por banner (privada - com auth)
  const GetEventsByBanner = async (bannerId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const response = await api
      .get(`/analytics/event-banner/${bannerId}/banner`, config)
      .then((res) => {
        const responseData: IEventsByBannerResponse = res.data.response;
        setBannerEvents((prev) => ({
          ...prev,
          [bannerId]: responseData.events || [],
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Erro ao buscar eventos do banner"
        );
        setLoading(false);
        return err;
      });

    return response;
  };

  // Função para buscar totais de eventos (privada - com auth)
  const GetTotalEvents = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const response = await api
      .get("/analytics/event-banner", config)
      .then((res) => {
        const responseData: ITotalEventsResponse = res.data.response;
        setTotalEvents(responseData.events || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Erro ao buscar totais de eventos"
        );
        setLoading(false);
        return err;
      });

    return response;
  };

  // Função para atualizar evento virtual (privada - com auth)
  const UpdateVirtualEvent = async ({
    banner_id,
    eventType,
    newVirtualCount,
  }: IUpdateVirtualEventProps): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const requestData = {
      eventType,
      newVirtualCount,
    };

    const response = await api
      .patch(`/analytics/event-banner/${banner_id}/banner`, requestData, config)
      .then((res) => {
        GetEventsByBanner(banner_id);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Erro ao atualizar evento virtual"
        );
        setLoading(false);
        return err;
      });

    return response;
  };

  // Função utilitária para track de visualização
  const TrackBannerView = async (
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterBannerEvent({
        bannerId,
        eventType: EventType.VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar visualização do banner:", error);
    }
  };

  // Função utilitária para track de clique
  const TrackBannerClick = async (
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterBannerEvent({
        bannerId,
        eventType: EventType.CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique do banner:", error);
    }
  };

  // Função utilitária para track de visualização de perfil
  const TrackBannerProfileView = async (
    bannerId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterBannerEvent({
        bannerId,
        eventType: EventType.PROFILE_VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn(
        "Erro ao registrar visualização de perfil do banner:",
        error
      );
    }
  };

  // Função para limpar erros
  const ClearError = (): void => {
    setError(null);
  };

  return (
    <BannerAnalyticsContext.Provider
      value={{
        RegisterBannerEvent,
        TrackBannerView,
        TrackBannerClick,
        TrackBannerProfileView,
        GetEventsByBanner,
        GetTotalEvents,
        UpdateVirtualEvent,
        bannerEvents,
        totalEvents,
        loading,
        error,
        ClearError,
      }}
    >
      {children}
    </BannerAnalyticsContext.Provider>
  );
};
