"use client";

import { ArticleAnalyticsProvider } from "./analitcs/article";
import { BannerAnalyticsProvider } from "./analitcs/banner";
import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";
import { PublicCompanyProvider } from "./company";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ArticleProvider>
      <PublicCompanyProvider>
        <BannerProvider>
          <ArticleAnalyticsProvider>
            <BannerAnalyticsProvider>{children}</BannerAnalyticsProvider>
          </ArticleAnalyticsProvider>
        </BannerProvider>
      </PublicCompanyProvider>
    </ArticleProvider>
  );
}
