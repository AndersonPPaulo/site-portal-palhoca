"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState } from "react";

interface Company {
  id: string;
  name: string;
}

export interface BannerItem {
  id: string;
  url: string; // era url_image no seu tipo, mas a API retorna "url"
  key: string;
  name: string;
  link_direction: string;
  banner_style: string;
  date_active: string; // vem como string ISO
  date_expiration: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  company: Company;
  banner?: File;
}

interface IBanner {
  total: number;
  page: number;
  limit: number;
  data: BannerItem[];
}

interface IBannerMetadataProps {
  page?: number;
  limit?: number;
  onlyActive?: boolean;
  bannerStyle?: string;
}

interface IBannerData {
  ListBannersWelcome({
    page,
    limit,
    onlyActive,
    bannerStyle,
  }: IBannerMetadataProps): Promise<void>;

  ListBannersTop({
    page,
    limit,
    onlyActive,
    bannerStyle,
  }: IBannerMetadataProps): Promise<void>;

  ListBannersNews({
    page,
    limit,
    onlyActive,
    bannerStyle,
  }: IBannerMetadataProps): Promise<void>;

  ListBannersSidebar({
    page,
    limit,
    onlyActive,
    bannerStyle,
  }: IBannerMetadataProps): Promise<void>;

  bannersSidebar: IBanner;
  bannersNews: IBanner;
  bannersTop: IBanner;
  bannersWelcome: IBanner;
  GetBanner(id: string): Promise<void>;
  banner: BannerItem;
}

interface ICihldrenReact {
  children: ReactNode;
}

export const BannerContext = createContext<IBannerData>({} as IBannerData);

export const BannerProvider = ({ children }: ICihldrenReact) => {
  const [bannersWelcome, setBannersWelcome] = useState<IBanner>({} as IBanner);
  const ListBannersWelcome = async ({
    page,
    limit,
    onlyActive = true,
    bannerStyle = "destaque",
  }: IBannerMetadataProps): Promise<void> => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit,
        onlyActive,
        bannerStyle,
      },
    };
    const response = await api
      .get("/banner", config)
      .then((res) => {
        setBannersWelcome(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const [bannersTop, setBannersTop] = useState<IBanner>({} as IBanner);
  const ListBannersTop = async ({
    page,
    limit,
    onlyActive = true,
    bannerStyle = "topo",
  }: IBannerMetadataProps): Promise<void> => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit,
        onlyActive,
        bannerStyle,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        setBannersTop(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const [bannersNews, setBannersNews] = useState<IBanner>({} as IBanner);
  const ListBannersNews = async ({
    page,
    limit,
    onlyActive = true,
    bannerStyle = "noticia",
  }: IBannerMetadataProps): Promise<void> => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit,
        onlyActive,
        bannerStyle,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        setBannersNews(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const [bannersSidebar, setBannersSidebar] = useState<IBanner>({} as IBanner);
  const ListBannersSidebar = async ({
    page,
    limit,
    onlyActive = true,
    bannerStyle = "sidebar",
  }: IBannerMetadataProps): Promise<void> => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit,
        onlyActive,
        bannerStyle,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        setBannersSidebar(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  const [banner, setBanner] = useState<BannerItem>({} as BannerItem);
  const GetBanner = async (id: string): Promise<void> => {
    const response = await api
      .get(`/banner/${id}`)
      .then((res) => {
        setBanner(res.data.response);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  return (
    <BannerContext.Provider
      value={{
        ListBannersWelcome,
        ListBannersTop,
        ListBannersNews,
        ListBannersSidebar,
        bannersSidebar,
        bannersNews,
        bannersTop,
        bannersWelcome,
        banner,
        GetBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};
