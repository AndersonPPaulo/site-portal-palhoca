import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/posts/sections/hero-section";
import ListArticlesByCategory from "@/components/posts/sections/list-news-by-category";
import PostGridSection from "@/components/posts/sections/post-grid-section";
import PostGridWwithColumnistSection from "@/components/posts/sections/post-grid-with-columnist-section";

import type { Metadata } from "next";
import group from "@/assets/Group.png";
import default_image from "@/assets/default image.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; slug: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  const faviconUrl = "https://novo.portalpalhoca.com.br/favicon.ico";

  return {
    title: `Notícias sobre ${name.toLocaleUpperCase()} | Portal Palhoça`,
    description:
      "Portal palhoça é um site de notícias que traz as últimas informações sobre a cidade de Palhoça, SC.",
    openGraph: {
      type: "website",
      siteName: "Portal Palhoça",
      title: `Notícias sobre ${name.toLocaleUpperCase()} | Portal Palhoça`,
      description:
        "Portal palhoça é um site de notícias que traz as últimas informações sobre a cidade de Palhoça, SC.",
      images: [
        {
          url: faviconUrl,
          width: 32,
          height: 32,
          alt: "Portal Palhoça",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `Notícias sobre ${name.toLocaleUpperCase()} | Portal Palhoça`,
      description:
        "Portal palhoça é um site de notícias que traz as últimas informações sobre a cidade de Palhoça, SC.",
      images: [
        {
          url: faviconUrl,
          width: 32,
          height: 32,
          alt: "Portal Palhoça",
        },
      ],
    },
  };
}

export default function NewsPage() {
  return (
    <DefaultPage>
      <Header />
      <main>
        <HeroSection />
        <PostGridSection />
        <PostGridWwithColumnistSection />

        <ListArticlesByCategory />
      </main>
      <footer>
        <Footer />
      </footer>
    </DefaultPage>
  );
}
