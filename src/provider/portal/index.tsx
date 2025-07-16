"use client";

import { api } from "@/service/api";
import { createContext, ReactNode, useState, useContext } from "react";

interface Portal {
  id: string;
  name: string;
  link_referer: string;
  created_at: string;
  updated_at: string;
  whatsapp_groups: {
    id: string;
    link: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }[];
}

interface IPortalContext {
  SelfPortalByReferer: (link_referer: string) => Promise<Portal>;
  portal: Portal | null;
}

interface IChildrenReact {
  children: ReactNode;
}

export const PortalContext = createContext<IPortalContext>(
  {} as IPortalContext
);

export const PortalProvider = ({ children }: IChildrenReact) => {
  const [portal, setPortal] = useState<Portal | null>(null);

  const SelfPortalByReferer = async (link_referer: string): Promise<Portal> => {
    const response = await api
      .get("/portal/by-referer", {
        params: { linkReferer: link_referer },
      })
      .then((res) => {
        setPortal(res.data);
      })
      .catch((err) => {
        return err;
      });

    return response;
  };

  return (
    <PortalContext.Provider value={{ portal, SelfPortalByReferer }}>
      {children}
    </PortalContext.Provider>
  );
};
