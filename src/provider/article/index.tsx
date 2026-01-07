"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState } from "react";

interface ArticleFilters {
  category_name?: string;
  page?: number;
  limit?: number;
  highlight?: boolean;
  highlightPosition?: number;
  highlightSlot?: number;
  creatorId?: string;
  chiefEditorId?: string;
  startDate?: string; // formato ISO: "2024-01-01"
  endDate?: string;
  status?: string;
  portalReferer?: string;
  title?: string;
}

export interface ArticleProps {
  title: string;
  slug: string;
  creator: string;
  reading_time: number;
  resume_content: string;
  content: string;
  initialStatus: string;
  highlight: boolean;
  thumbnail: string;
  categoryId: string;
  tagIds: string[];
  chiefEditorId: string;
}

export interface ArticleResponse {
  message: string;
  data: Article[];
  meta: Meta;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  reading_time: number;
  thumbnail: {
    id: string;
    url: string;
    key: string;
    description: string;
  };
  resume_content: string;
  content: string;
  gallery?: string;
  clicks_view: string;
  highlight: boolean;
  created_at: string;
  updated_at: string;
  creator: User;
  chiefEditor: User;
  category: Category;
  tags: Tag[];
  status_history: StatusHistory[];
  status: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  status:
    | "CHANGES_REQUESTED"
    | "PENDING_REVIEW"
    | "PUBLISHED"
    | "DRAFT"
    | "REJECTED";
  change_request_description: string;
  reason_reject: string;
  changed_at: string;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  status?: string;
  chiefEditorId?: string;
}

export interface UserImage {
  id: string;
  key: string;
  mime_type: string;
  original_name: string;
  size: number;
  uploaded_at: string; // ou `Date` se você for converter para objeto Date
  url: string;
}

export type ArticleWithColumnist = {
  id: string;
  title: string;
  slug: string;
  reading_time: number;
  resume_content: string;
  content: string;
  clicks_view: string;
  highlight: boolean;
  highlight_position: number | null;
  highlight_slot: number | null;
  category: Category;

  created_at: string;
  updated_at: string;
  thumbnail: {
    id: string;
    url: string;
    key: string;
    description: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
    topic: string | null;
    isActive: boolean;
    role: {
      id: string;
      name: string;
    };
    user_image: UserImage;
  };
};

export type ArticleWithColumnistResponse = ArticleWithColumnist[];

interface IArticleData {
  SelfArticle(articleId: string): Promise<Article>;
  article: Article | null;
  ListAuthorArticles(
    creatorId?: string,
    params?: ArticleListParams
  ): Promise<ArticleResponse>;
  listArticles: ArticleResponse | null;

  GetPublishedArticles(filters: ArticleFilters): Promise<ArticleResponse>;
  publishedArticles: ArticleResponse | null;

  GetPublishedArticlesBySearch(
    filters: ArticleFilters
  ): Promise<ArticleResponse>;
  publishedArticlesBySearch: ArticleResponse | null;

  GetArticlesByPortalHighlightPositionOne(
    filters: ArticleFilters
  ): Promise<ArticleResponse>;
  articlesByPortalHighlightPositionOne: ArticleResponse | null;

  GetArticlesByPortalHighlightPositionTwo(
    filters: ArticleFilters
  ): Promise<ArticleResponse>;
  articlesByPortalHighlightPositionTwo: ArticleResponse | null;

  GetArticlesByPortalHighlightPositionThree(
    filters: ArticleFilters
  ): Promise<ArticleResponse>;
  articlesByPortalHighlightPositionThree: ArticleResponse | null;

  GetArticlesByPortalHighlightPositionFour(
    filters: ArticleFilters
  ): Promise<ArticleResponse>;
  articlesByPortalHighlightPositionFour: ArticleResponse | null;

  ListArticlesColumnists(
    name_columnist?: string
  ): Promise<ArticleWithColumnistResponse>;
  listArticlesColumnists: ArticleWithColumnistResponse | null;

  GetArticleBySlug(slug: string): Promise<Article>;
  articleBySlug: Article | null;
}

interface ICihldrenReact {
  children: ReactNode;
}

export const ArticleContext = createContext<IArticleData>({} as IArticleData);

export const ArticleProvider = ({ children }: ICihldrenReact) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [listArticles, setListArticles] = useState<ArticleResponse | null>(
    null
  );

  const SelfArticle = async (articleId: string): Promise<Article> => {
    const response = await api
      .get(`/article/${articleId}`)
      .then((res) => {
        setArticle(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const [articleBySlug, setArticleBySlug] = useState<Article | null>(null);
  const GetArticleBySlug = async (slug: string): Promise<Article> => {
    const response = await api
      .get(`/article/${slug}/slug`)
      .then((res) => {
        setArticleBySlug(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const ListAuthorArticles = async (
    creatorId?: string,
    params: ArticleListParams = {}
  ): Promise<ArticleResponse> => {
    const { page = 1, limit = 10, status, chiefEditorId } = params;
    const config = {
      params: { page, limit, status, chiefEditorId },
    };

    let url = "/article-author";
    if (creatorId) {
      url = `${url}/${creatorId}`;
    }

    try {
      const response = await api.get(url, config);
      setListArticles(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [publishedArticles, setPublishedArticles] =
    useState<ArticleResponse | null>(null);
  const GetPublishedArticles = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    const {
      page = 1,
      limit = 10,
      portalReferer,
      title,
      ...otherFilters
    } = filters;

    try {
      const response = await api.get("/article-portal", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          title,
          ...otherFilters, // todos os filtros extras
        },
      });
      setPublishedArticles(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [publishedArticlesBySearch, setPublishedArticlesBySearch] =
    useState<ArticleResponse | null>(null);
  const GetPublishedArticlesBySearch = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    const {
      page = 1,
      limit = 10,
      portalReferer,
      title,
      ...otherFilters
    } = filters;

    try {
      const response = await api.get("/article-published", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          title,
          ...otherFilters, // todos os filtros extras
        },
      });
      setPublishedArticlesBySearch(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [
    articlesByPortalHighlightPositionOne,
    setArticlesByPortalHighlightPositionOne,
  ] = useState<ArticleResponse | null>(null);
  const GetArticlesByPortalHighlightPositionOne = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    try {
      const { page = 1, limit = 10, portalReferer, ...otherFilters } = filters;

      const response = await api.get("/article-portal", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          ...otherFilters, // todos os filtros extras
        },
      });

      setArticlesByPortalHighlightPositionOne(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [
    articlesByPortalHighlightPositionTwo,
    setArticlesByPortalHighlightPositionTwo,
  ] = useState<ArticleResponse | null>(null);
  const GetArticlesByPortalHighlightPositionTwo = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    try {
      const { page = 1, limit = 10, portalReferer, ...otherFilters } = filters;

      const response = await api.get("/article-portal", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          ...otherFilters, // todos os filtros extras
        },
      });

      setArticlesByPortalHighlightPositionTwo(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [
    articlesByPortalHighlightPositionThree,
    setArticlesByPortalHighlightPositionThree,
  ] = useState<ArticleResponse | null>(null);
  const GetArticlesByPortalHighlightPositionThree = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    try {
      const { page = 1, limit = 10, portalReferer, ...otherFilters } = filters;

      const response = await api.get("/article-portal", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          ...otherFilters, // todos os filtros extras
        },
      });

      setArticlesByPortalHighlightPositionThree(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [
    articlesByPortalHighlightPositionFour,
    setArticlesByPortalHighlightPositionFour,
  ] = useState<ArticleResponse | null>(null);
  const GetArticlesByPortalHighlightPositionFour = async (
    filters: ArticleFilters = {}
  ): Promise<ArticleResponse> => {
    try {
      const { page = 1, limit = 10, portalReferer, ...otherFilters } = filters;

      const response = await api.get("/article-portal", {
        params: {
          page,
          limit,
          portalReferer: window.location.hostname,
          ...otherFilters, // todos os filtros extras
        },
      });

      setArticlesByPortalHighlightPositionFour(response.data);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  };

  const [listArticlesColumnists, setListArticlesColumnists] =
    useState<ArticleWithColumnistResponse | null>(null);
  const ListArticlesColumnists = async (
    name_columnist?: string
  ): Promise<ArticleWithColumnistResponse> => {
    const config = {
      params: { name_columnist },
    };

    const response = await api
      .get("/list-columnist", config)
      .then((res) => {
        setListArticlesColumnists(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  return (
    <ArticleContext.Provider
      value={{
        article,
        SelfArticle,
        listArticles,
        ListAuthorArticles,

        GetPublishedArticles,
        publishedArticles,

        GetPublishedArticlesBySearch,
        publishedArticlesBySearch,

        GetArticlesByPortalHighlightPositionOne,
        articlesByPortalHighlightPositionOne,

        GetArticlesByPortalHighlightPositionTwo,
        articlesByPortalHighlightPositionTwo,

        GetArticlesByPortalHighlightPositionThree,
        articlesByPortalHighlightPositionThree,

        GetArticlesByPortalHighlightPositionFour,
        articlesByPortalHighlightPositionFour,

        ListArticlesColumnists,
        listArticlesColumnists,

        GetArticleBySlug,
        articleBySlug,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};
