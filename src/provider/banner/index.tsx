"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { PortalContext } from "../portal";

interface Company {
  id: string;
  name: string;
}

interface Portal {
  id: string;
  name: string;
  link_referer: string;
  status: boolean;
  created_at: string;
  updated_at: string;
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
  portal: Portal;
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
  linkReferer?: string;
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
  const { portal } = useContext(PortalContext);
  const [bannersWelcome, setBannersWelcome] = useState<IBanner>({} as IBanner);
  const ListBannersWelcome = async ({
    page,
    limit,
    onlyActive = true,
    bannerStyle = "destaque",
    linkReferer,
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
        linkReferer: linkReferer || portal?.link_referer,
      },
    };
    const response = await api
      .get("/banner", config)
      .then((res) => {
        const referer = linkReferer || portal?.link_referer;
        const responseData = res.data.response;
        
        // Filtrar banners pelo link_referer do portal
        if (referer && responseData?.data) {
          const filteredData = responseData.data.filter(
            (banner: BannerItem) => banner.portal?.link_referer === referer
          );
          setBannersWelcome({
            ...responseData,
            data: filteredData,
            total: filteredData.length,
          });
        } else {
          setBannersWelcome(responseData);
        }
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
    linkReferer,
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
        linkReferer: linkReferer || portal?.link_referer,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        const referer = linkReferer || portal?.link_referer;
        const responseData = res.data.response;
        
        // Filtrar banners pelo link_referer do portal
        if (referer && responseData?.data) {
          const filteredData = responseData.data.filter(
            (banner: BannerItem) => banner.portal?.link_referer === referer
          );
          setBannersTop({
            ...responseData,
            data: filteredData,
            total: filteredData.length,
          });
        } else {
          setBannersTop(responseData);
        }
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
    linkReferer,
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
        linkReferer: linkReferer || portal?.link_referer,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        const referer = linkReferer || portal?.link_referer;
        const responseData = res.data.response;
        
        // Filtrar banners pelo link_referer do portal
        if (referer && responseData?.data) {
          const filteredData = responseData.data.filter(
            (banner: BannerItem) => banner.portal?.link_referer === referer
          );
          setBannersNews({
            ...responseData,
            data: filteredData,
            total: filteredData.length,
          });
        } else {
          setBannersNews(responseData);
        }
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
    linkReferer,
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
        linkReferer: linkReferer || portal?.link_referer,
      },
    };

    const response = await api
      .get("/banner", config)
      .then((res) => {
        const referer = linkReferer || portal?.link_referer;
        const responseData = res.data.response;
        
        // Filtrar banners pelo link_referer do portal
        if (referer && responseData?.data) {
          const filteredData = responseData.data.filter(
            (banner: BannerItem) => banner.portal?.link_referer === referer
          );
          setBannersSidebar({
            ...responseData,
            data: filteredData,
            total: filteredData.length,
          });
        } else {
          setBannersSidebar(responseData);
        }
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
