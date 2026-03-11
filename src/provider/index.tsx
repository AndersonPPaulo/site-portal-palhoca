"use client";

import { ArticleAnalyticsProvider } from "./analytics/article";
import { BannerAnalyticsProvider } from "./analytics/banner";
import { CompanyAnalyticsProvider } from "./analytics/company";
import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";
import { PublicCompanyProvider } from "./company";
import { PortalProvider } from "./portal";
import { ColumnistProvider } from "./columnist";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <ArticleProvider>
        <ColumnistProvider>
          <PublicCompanyProvider>
            <CompanyAnalyticsProvider>
              <BannerProvider>
                <ArticleAnalyticsProvider>
                  <BannerAnalyticsProvider>
                    {children}
                  </BannerAnalyticsProvider>
                </ArticleAnalyticsProvider>
              </BannerProvider>
            </CompanyAnalyticsProvider>
          </PublicCompanyProvider>
        </ColumnistProvider>
      </ArticleProvider>
    </PortalProvider>
  );
}
