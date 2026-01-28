"use client";

import { api } from "@/service/api";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";

// Interface para imagens da empresa
interface ICompanyImage {
  id: string;
  key: string;
  url: string;
  original_name?: string;
  mime_type?: string;
  size?: number;
  uploaded_at?: Date;
  company_id: string;
}

// Interface para categorias da empresa
interface ICompanyCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Interface principal para empresa pública
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
  company_image?: ICompanyImage;
  company_category: ICompanyCategory[];
  lat: number;
  long: number;
}

// Interface para resposta paginada
export interface IPublicCompanyListResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: IPublicCompany[];
}

// Interface para filtros de listagem
export interface IListCompanyFilters {
  category?: string;
  search?: string;
  district?: string;
  portalReferer?: string;
}

// Interface para dados do formulário de contato
export interface IContactFormData {
  companyName: string;
  responsibleName: string;
  email: string;
  phone: string;
  companyMessage?: string;
  status?: "new_lead";
}

// Interface para criação de lead (backend)
interface ICreateNewLead {
  name: string;
  email: string;
  responsibleName: string;
  companyMessage: string;
  phone?: string;
  openingHours?: string;
}

// Interface do Contexto
interface IPublicCompanyContext {
  // Estados
  companies: IPublicCompanyListResponse | null;
  highlightedCompanies: IPublicCompanyListResponse | null;
  normalCompanies: IPublicCompanyListResponse | null;
  selectedCompany: IPublicCompany | null;
  loading: boolean;
  error: string | null;

  // Métodos de listagem
  listHighlightedCompanies(
    page?: number,
    limit?: number,
    filters?: IListCompanyFilters,
  ): Promise<IPublicCompanyListResponse>;

  listNormalCompanies(
    page?: number,
    limit?: number,
    filters?: IListCompanyFilters,
  ): Promise<IPublicCompanyListResponse>;

  listAllCompanies(
    page?: number,
    limit?: number,
    filters?: IListCompanyFilters,
  ): Promise<IPublicCompanyListResponse>;

  // Outros métodos
  getCompanyById(companyId: string): Promise<IPublicCompany>;
  clearSelectedCompany(): void;
  clearError(): void;
  createNewLead(data: IContactFormData): Promise<void>;
}

// ==================== PROVIDER ====================

export const PublicCompanyContext = createContext<IPublicCompanyContext>(
  {} as IPublicCompanyContext,
);

export const PublicCompanyProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Estados
  const [companies, setCompanies] = useState<IPublicCompanyListResponse | null>(
    null,
  );
  const [highlightedCompanies, setHighlightedCompanies] =
    useState<IPublicCompanyListResponse | null>(null);
  const [normalCompanies, setNormalCompanies] =
    useState<IPublicCompanyListResponse | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<IPublicCompany | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função auxiliar para construir parâmetros
  const buildParams = useCallback(
    (
      page: number,
      limit: number,
      filters: IListCompanyFilters,
      highlight?: boolean,
    ) => {
      return {
        page,
        limit,
        ...(filters.search && { name: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.district && { district: filters.district }),
        ...(highlight !== undefined && { highlight }),
        portalReferer: window.location.hostname,
      };
    },
    [],
  );

  // Função auxiliar para tratamento de erros
  const handleApiError = useCallback((err: any, defaultMessage: string) => {
    const errorMessage = err.response?.data?.message || defaultMessage;
    setError(errorMessage);
    console.error(errorMessage, err);
    throw new Error(errorMessage);
  }, []);

  // Listar apenas empresas em destaque (highlight: true)
  const listHighlightedCompanies = useCallback(
    async (
      page = 1,
      limit = 20,
      filters: IListCompanyFilters = {},
    ): Promise<IPublicCompanyListResponse> => {
      setLoading(true);
      setError(null);

      try {
        const params = buildParams(page, limit, filters, true);
        const response = await api.get("/company/site", { params });
        const formattedResponse: IPublicCompanyListResponse = response.data;

        setHighlightedCompanies(formattedResponse);
        return formattedResponse;
      } catch (err: any) {
        return handleApiError(err, "Erro ao carregar comércios em destaque");
      } finally {
        setLoading(false);
      }
    },
    [buildParams, handleApiError],
  );

  // Listar apenas empresas normais (highlight: false)
  const listNormalCompanies = useCallback(
    async (
      page = 1,
      limit = 20,
      filters: IListCompanyFilters = {},
    ): Promise<IPublicCompanyListResponse> => {
      setLoading(true);
      setError(null);

      try {
        const params = buildParams(page, limit, filters, false);
        const response = await api.get("/company/site", { params });
        const formattedResponse: IPublicCompanyListResponse = response.data;

        setNormalCompanies(formattedResponse);
        return formattedResponse;
      } catch (err: any) {
        return handleApiError(err, "Erro ao carregar comércios");
      } finally {
        setLoading(false);
      }
    },
    [buildParams, handleApiError],
  );

  // Listar todas as empresas (sem filtro de highlight)
  const listAllCompanies = useCallback(
    async (
      page = 1,
      limit = 20,
      filters: IListCompanyFilters = {},
    ): Promise<IPublicCompanyListResponse> => {
      setLoading(true);
      setError(null);

      try {
        const params = buildParams(page, limit, filters);
        const response = await api.get("/company/site", { params });
        const formattedResponse: IPublicCompanyListResponse = response.data;

        setCompanies(formattedResponse);
        return formattedResponse;
      } catch (err: any) {
        return handleApiError(err, "Erro ao carregar comércios");
      } finally {
        setLoading(false);
      }
    },
    [buildParams, handleApiError],
  );

  // Buscar empresa por ID
  const getCompanyById = useCallback(
    async (companyId: string): Promise<IPublicCompany> => {
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
        return handleApiError(err, "Erro ao carregar detalhes do comércio");
      } finally {
        setLoading(false);
      }
    },
    [handleApiError],
  );

  // Criar novo lead
  const createNewLead = useCallback(
    async (formData: IContactFormData): Promise<void> => {
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
          err.response?.data?.message ||
          "Erro ao enviar informações da empresa";
        setError(errorMessage);
        console.error("Erro ao criar lead:", err);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Funções auxiliares
  const clearSelectedCompany = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Valor do contexto memoizado
  const contextValue = useMemo(
    () => ({
      // Estados
      companies,
      highlightedCompanies,
      normalCompanies,
      selectedCompany,
      loading,
      error,
      // Métodos
      listHighlightedCompanies,
      listNormalCompanies,
      listAllCompanies,
      getCompanyById,
      clearSelectedCompany,
      clearError,
      createNewLead,
    }),
    [
      companies,
      highlightedCompanies,
      normalCompanies,
      selectedCompany,
      loading,
      error,
      listHighlightedCompanies,
      listNormalCompanies,
      listAllCompanies,
      getCompanyById,
      clearSelectedCompany,
      clearError,
      createNewLead,
    ],
  );

  return (
    <PublicCompanyContext.Provider value={contextValue}>
      {children}
    </PublicCompanyContext.Provider>
  );
};

// ==================== HOOK CUSTOMIZADO ====================

export const usePublicCompany = () => {
  const context = useContext(PublicCompanyContext);

  if (!context) {
    throw new Error(
      "usePublicCompany deve ser usado dentro de um PublicCompanyProvider",
    );
  }

  return context;
};
