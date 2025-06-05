"use client";

import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";
import { PublicCompanyProvider } from "./company";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ArticleProvider>
      <PublicCompanyProvider>
      <BannerProvider>{children}</BannerProvider>
      </PublicCompanyProvider>
    </ArticleProvider>
  );
}
