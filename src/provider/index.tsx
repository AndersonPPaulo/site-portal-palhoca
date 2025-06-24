"use client";

import { BannerAnalyticsProvider } from "./analitcs/banner";
import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";
import { PublicCompanyProvider } from "./company";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ArticleProvider>
      <PublicCompanyProvider>
        <BannerProvider>
          <BannerAnalyticsProvider>{children}</BannerAnalyticsProvider>
        </BannerProvider>
      </PublicCompanyProvider>
    </ArticleProvider>
  );
}
