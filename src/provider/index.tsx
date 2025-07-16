"use client";

import { ArticleAnalyticsProvider } from "./analytics/article";
import { BannerAnalyticsProvider } from "./analytics/banner";
import { CompanyAnalyticsProvider } from "./analytics/company";
import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";
import { PublicCompanyProvider } from "./company";
import { PortalProvider } from "./portal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ArticleProvider>
      <PublicCompanyProvider>
        <CompanyAnalyticsProvider>
          <BannerProvider>
            <ArticleAnalyticsProvider>
              <BannerAnalyticsProvider>
                <PortalProvider>{children}</PortalProvider>
              </BannerAnalyticsProvider>
            </ArticleAnalyticsProvider>
          </BannerProvider>
        </CompanyAnalyticsProvider>
      </PublicCompanyProvider>
    </ArticleProvider>
  );
}
