"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState } from "react";

export interface ColumnistArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  resume_content: string;
  thumbnail?: {
    id: string;
    url: string;
    key: string;
    description: string;
  };
  category: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Columnist {
  id: string;
  name: string;
  email: string;
  topic: string;
  user_image?: {
    id: string;
    url: string;
  };
  articles: ColumnistArticle[];
}

export interface ColumnistArticlesResponse {
  message: string;
  data: ColumnistArticle[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface IColumnistData {
  GetColumnists: (limit?: number) => Promise<void>;
  columnists: Columnist[] | null;
  GetColumnistArticles: (
    columnistId: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  columnistArticles: ColumnistArticlesResponse | null;
  loading: boolean;
}

export const ColumnistContext = createContext({} as IColumnistData);

export const ColumnistProvider = ({ children }: { children: ReactNode }) => {
  const [columnists, setColumnists] = useState<Columnist[] | null>(null);
  const [columnistArticles, setColumnistArticles] =
    useState<ColumnistArticlesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const GetColumnists = async (limit: number = 4) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/columnists-with-articles?columnistLimit=${limit}&articlesPerColumnist=1`,
      );
      const columnistsData = response.data.response || [];

      // Ordenar colunistas pela data do artigo mais recente (mais recente primeiro)
      const sortedColumnists = columnistsData
        .filter(
          (columnist: Columnist) =>
            columnist.articles && columnist.articles.length > 0,
        )
        .sort((a: Columnist, b: Columnist) => {
          const dateA = new Date(a.articles[0].created_at).getTime();
          const dateB = new Date(b.articles[0].created_at).getTime();
          return dateB - dateA; // Ordem decrescente (mais recente primeiro)
        })
        .slice(0, limit); // Garantir que retorna apenas o limite especificado

      setColumnists(sortedColumnists);
    } catch (error) {
      console.error("Erro ao buscar colunistas:", error);
      setColumnists(null);
    } finally {
      setLoading(false);
    }
  };

  const GetColumnistArticles = async (
    columnistId: string,
    page: number = 1,
    limit: number = 20,
  ) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/article-author/${columnistId}?page=${page}&limit=${limit}&status=PUBLISHED`,
      );
      console.log("Response artigos do colunista:", response.data);
      setColumnistArticles(response.data);
    } catch (error) {
      console.error("Erro ao buscar artigos do colunista:", error);
      setColumnistArticles(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ColumnistContext.Provider
      value={{
        GetColumnists,
        columnists,
        GetColumnistArticles,
        columnistArticles,
        loading,
      }}
    >
      {children}
    </ColumnistContext.Provider>
  );
};
