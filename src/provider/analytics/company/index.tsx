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
export interface CompanyEvent {
  event_type: EventType;
  virtual_count: number;
}

export interface TotalCompanyEvent {
  event_type: EventType;
  total: number;
}

// Interfaces das respostas da API
interface IEventsByCompanyResponse {
  message: string;
  events: CompanyEvent[];
}

interface ITotalEventsResponse {
  message: string;
  events: TotalCompanyEvent[];
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
  companyId: string;
  eventType: EventType;
  extra_data?: Record<string, any>;
  virtualIncrement?: number;
}

interface IUpdateVirtualEventProps {
  company_id: string;
  eventType: EventType;
  newVirtualCount?: number;
}

// Interface principal do contexto
interface ICompanyAnalyticsData {
  RegisterCompanyEvent(data: IRegisterEventProps): Promise<void>;
  TrackCompanyView(
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackCompanyClick(
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackCompanyWhatsappClick(
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackCompanyMapClick(
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void>;
  TrackCompanyProfileView(
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void>;

  GetEventsByCompany(companyId: string): Promise<void>;
  GetTotalEvents(): Promise<void>;
  UpdateVirtualEvent(data: IUpdateVirtualEventProps): Promise<void>;

  companyEvents: Record<string, CompanyEvent[]>;
  totalEvents: TotalCompanyEvent[];
  loading: boolean;
  error: string | null;

  ClearError(): void;
}

interface IChildrenReact {
  children: ReactNode;
}

export const CompanyAnalyticsContext = createContext<ICompanyAnalyticsData>(
  {} as ICompanyAnalyticsData
);

export const CompanyAnalyticsProvider = ({ children }: IChildrenReact) => {
  const [companyEvents, setCompanyEvents] = useState<
    Record<string, CompanyEvent[]>
  >({});
  const [totalEvents, setTotalEvents] = useState<TotalCompanyEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Função para registrar evento (pública - sem auth)
  const RegisterCompanyEvent = async ({
    companyId,
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
      companyId,
      eventType,
      extra_data,
      virtualIncrement,
    };

    const response = await api
      .post("/analytics/event-company", requestData, config)
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

  // Função para buscar eventos por company (privada - com auth)
  const GetEventsByCompany = async (companyId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    const response = await api
      .get(`/analytics/event-company/${companyId}/company`, config)
      .then((res) => {
        const responseData: IEventsByCompanyResponse = res.data.response;
        setCompanyEvents((prev) => ({
          ...prev,
          [companyId]: responseData.events || [],
        }));
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Erro ao buscar eventos do comércio"
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
      .get("/analytics/event-company", config)
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
    company_id,
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
        `/analytics/event-company/${company_id}/company`,
        requestData,
        config
      )
      .then((res) => {
        GetEventsByCompany(company_id);
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
  const TrackCompanyView = async (
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterCompanyEvent({
        companyId,
        eventType: EventType.VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar visualização do comércio:", error);
    }
  };

  // Função utilitária para track de clique
  const TrackCompanyClick = async (
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterCompanyEvent({
        companyId,
        eventType: EventType.CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique do comércio:", error);
    }
  };

  // Função utilitária para track de clique no WhatsApp
  const TrackCompanyWhatsappClick = async (
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterCompanyEvent({
        companyId,
        eventType: EventType.WHATSAPP_CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique WhatsApp do comércio:", error);
    }
  };

  // Função utilitária para track de clique no mapa
  const TrackCompanyMapClick = async (
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterCompanyEvent({
        companyId,
        eventType: EventType.MAP_CLICK,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn("Erro ao registrar clique no mapa do comércio:", error);
    }
  };

  // Função utilitária para track de visualização de perfil
  const TrackCompanyProfileView = async (
    companyId: string,
    extraData?: Record<string, any>
  ): Promise<void> => {
    try {
      await RegisterCompanyEvent({
        companyId,
        eventType: EventType.PROFILE_VIEW,
        extra_data: extraData,
      });
    } catch (error) {
      console.warn(
        "Erro ao registrar visualização de perfil do comércio:",
        error
      );
    }
  };

  // Função para limpar erros
  const ClearError = (): void => {
    setError(null);
  };

  return (
    <CompanyAnalyticsContext.Provider
      value={{
        RegisterCompanyEvent,
        TrackCompanyView,
        TrackCompanyClick,
        TrackCompanyWhatsappClick,
        TrackCompanyMapClick,
        TrackCompanyProfileView,
        GetEventsByCompany,
        GetTotalEvents,
        UpdateVirtualEvent,
        companyEvents,
        totalEvents,
        loading,
        error,
        ClearError,
      }}
    >
      {children}
    </CompanyAnalyticsContext.Provider>
  );
};
