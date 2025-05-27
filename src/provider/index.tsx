"use client";

import { ArticleProvider } from "./article";
import { BannerProvider } from "./banner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ArticleProvider>
      <BannerProvider>{children}</BannerProvider>
    </ArticleProvider>
  );
}
