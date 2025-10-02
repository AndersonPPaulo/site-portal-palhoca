"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState, useContext } from "react";

// Interfaces para o site público
export interface IPublicCompany {
  id: string;
  name: string;
  phone?: string;
  openingHours: string;
  description?: string;
  linkInstagram?: string;
  linkWhatsapp?: string;
  linkLocationMaps: string;
  linkLocationWaze: string;
  highlight: boolean;
  address: string;
  city?: string;
  district?: string;
  status: "active" | "inactive" | "blocked";
  created_at: Date;
  update_at: Date;
  company_image?: {
    id: string;
    key: string;
    url: string;
    original_name?: string;
    mime_type?: string;
    size?: number;
    uploaded_at?: Date;
    company_id: string;
  };
  company_category?: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }[];
}

// Interface para dados do formulário público
export interface IContactFormData {
  companyName: string;
  responsibleName: string;
  email: string;
  phone: string;
  companyMessage?: string;
  status?: "new_lead";
}

// Interface para dados do backend
export interface ICreateNewLead {
  name: string;
  email: string;
  responsibleName: string;
  companyMessage: string;
  phone?: string;
  openingHours?: string;
}

export interface PublicCompanyListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: IPublicCompany[];
}

interface ListCompanyFilters {
  category?: string;
  search?: string;
  district?: string;
  portalReferer?: string;
}

interface IPublicCompanyContext {
  // Estados
  companies: PublicCompanyListResponse | null;
  selectedCompany: IPublicCompany | null;
  loading: boolean;
  error: string | null;

  // Métodos
  listCompanies(
    page?: number,
    limit?: number,
    filters?: ListCompanyFilters
  ): Promise<PublicCompanyListResponse>;
  getCompanyById(companyId: string): Promise<IPublicCompany>;
  clearSelectedCompany(): void;
  clearError(): void;
  createNewLead(data: IContactFormData): Promise<void>;
}

interface IChildrenReact {
  children: ReactNode;
}

export const PublicCompanyContext = createContext<IPublicCompanyContext>(
  {} as IPublicCompanyContext
);

export const PublicCompanyProvider = ({ children }: IChildrenReact) => {
  const [companies, setCompanies] = useState<PublicCompanyListResponse | null>(
    null
  );
  const [selectedCompany, setSelectedCompany] = useState<IPublicCompany | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listCompanies = async (
    page = 1,
    limit = 20,
    filters: ListCompanyFilters = {}
  ): Promise<PublicCompanyListResponse> => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
        ...(filters.search && { name: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.district && { district: filters.district }),
        ...{ portalReferer: window.location.hostname },
      };

      const response = await api.get("/company/site", { params });

      const formattedResponse: PublicCompanyListResponse = response.data;

      setCompanies(formattedResponse);
      return formattedResponse;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar comércios";
      setError(errorMessage);
      console.error("Erro ao listar empresas:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCompanyById = async (companyId: string): Promise<IPublicCompany> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/company/${companyId}`);
      const company: IPublicCompany = response.data.response;

      // Verificar se a empresa está ativa
      if (company.status !== "active") {
        throw new Error("Comércio não encontrado ou indisponível");
      }

      setSelectedCompany(company);
      return company;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao carregar detalhes do comércio";
      setError(errorMessage);
      console.error("Erro ao buscar empresa:", err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearSelectedCompany = () => {
    setSelectedCompany(null);
  };

  const clearError = () => {
    setError(null);
  };

  const createNewLead = async (formData: IContactFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const leadData: ICreateNewLead = {
        name: formData.companyName,
        email: formData.email,
        responsibleName: formData.responsibleName,
        companyMessage: formData.companyMessage || "",
        phone: formData.phone,
      };

      const response = await api.post("/company", leadData);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao enviar informações da empresa";
      setError(errorMessage);
      console.error("Erro ao criar lead:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicCompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        loading,
        error,
        listCompanies,
        getCompanyById,
        clearSelectedCompany,
        clearError,
        createNewLead,
      }}
    >
      {children}
    </PublicCompanyContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const usePublicCompany = () => {
  const context = useContext(PublicCompanyContext);

  if (!context) {
    throw new Error(
      "usePublicCompany deve ser usado dentro de um PublicCompanyProvider"
    );
  }

  return context;
};
