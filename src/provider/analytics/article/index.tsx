"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState } from "react";

// Enums
export enum EventType {
  VIEW = "view",
  VIEW_END = "view_end",
  CLICK = "click",
  WHATSAPP_CLICK = "whatsapp_click",
  MAP_CLICK = "map_click",
  PROFILE_VIEW = "profile_view",
}

// Interfaces dos dados
export interface ArticleEvent {
  event_type: EventType;
  virtual_count: number;
}

export interface TotalArticleEvent {
  event_type: EventType;
  total: number;
}

interface IEventsByArticleResponse {
  message: string;
  events: ArticleEvent[];
}

interface ITotalEventsResponse {
  message: string;
  events: TotalArticleEvent[];
}

interface IRegisterEventResponse {
  message: string;
  event: any;
}

interface IUpdateVirtualEventResponse {
  message: string;
  updated: any;
}

interface IRegisterEventProps {
  articleId: string;
  eventType: EventType;
  extra_data?: Record<string, any>;
  virtualIncrement?: number;
}

interface IUpdateVirtualEventProps {
  article_id: string;
  eventType: EventType;
  newVirtualCount?: number;
}

// Interface principal do contexto
interface IArticleAnalyticsData {
  RegisterArticleEvent(data: IRegisterEventProps): Promise<void>;
  TrackArticleView(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackArticleViewEnd(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackArticleClick(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackArticleWhatsappClick(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackArticleMapClick(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackArticleProfileView(
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void>;

  GetEventsByArticle(articleId: string): Promise<void>;
  GetTotalEvents(): Promise<void>;
  UpdateVirtualEvent(data: IUpdateVirtualEventProps): Promise<void>;

  articleEvents: Record<string, ArticleEvent[]>;
  totalEvents: TotalArticleEvent[];
  loading: boolean;
  error: string | null;

  ClearError(): void;
}

interface IChildrenReact {
  children: ReactNode;
}

export const ArticleAnalyticsContext = createContext<IArticleAnalyticsData>(
  {} as IArticleAnalyticsData
);

export const ArticleAnalyticsProvider = ({ children }: IChildrenReact) => {
  const [articleEvents, setArticleEvents] = useState<
    Record<string, ArticleEvent[]>
  >({});
  const [totalEvents, setTotalEvents] = useState<TotalArticleEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para registrar evento (pública - sem auth)
  const RegisterArticleEvent = async ({
    articleId,
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
      articleId,
      eventType,
      extra_data,
      virtualIncrement,
    };

    const response = await api
      .post("/analytics/event-article", requestData, config)
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

  // Função para buscar eventos por artigo (privada - com auth)
  const GetEventsByArticle = async (articleId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const response = await api
      .get(`/analytics/event-article/${articleId}/article`, config)
      .then((res) => {
        const responseData: IEventsByArticleResponse = res.data.response;
        setArticleEvents((prev) => ({
          ...prev,
          [articleId]: responseData.events || [],
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Erro ao buscar eventos do artigo"
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
      .get("/analytics/event-article", config)
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
    article_id,
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
      .patch(
        `/analytics/event-article/${article_id}/article`,
        requestData,
        config
      )
      .then((res) => {
        GetEventsByArticle(article_id);
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
  const TrackArticleView = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar visualização do artigo:", error);
    }
  };

  // Função utilitária para track de clique
  const TrackArticleClick = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique do artigo:", error);
    }
  };

  const TrackArticleViewEnd = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.VIEW_END,
        extra_data: {
          trigger: "scroll_to_whatsapp_button",
          timestamp: new Date().toISOString(),
          url: window.location.href,
          ...extraData,
        },
      });
    } catch (error) {
      console.warn("Erro ao registrar view_end do artigo:", error);
    }
  };

  // Função utilitária para track de clique no WhatsApp
  const TrackArticleWhatsappClick = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.WHATSAPP_CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique WhatsApp do artigo:", error);
    }
  };

  // Função utilitária para track de clique no mapa
  const TrackArticleMapClick = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.MAP_CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique no mapa do artigo:", error);
    }
  };

  // Função utilitária para track de visualização de perfil
  const TrackArticleProfileView = async (
    articleId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterArticleEvent({
        articleId,
        eventType: EventType.PROFILE_VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn(
        "Erro ao registrar visualização de perfil do artigo:",
        error
      );
    }
  };

  // Função para limpar erros
  const ClearError = (): void => {
    setError(null);
  };

  return (
    <ArticleAnalyticsContext.Provider
      value={{
        RegisterArticleEvent,
        TrackArticleView,
        TrackArticleClick,
        TrackArticleWhatsappClick,
        TrackArticleMapClick,
        TrackArticleProfileView,
        TrackArticleViewEnd,
        GetEventsByArticle,
        GetTotalEvents,
        UpdateVirtualEvent,
        articleEvents,
        totalEvents,
        loading,
        error,
        ClearError,
      }}
    >
      {children}
    </ArticleAnalyticsContext.Provider>
  );
};
