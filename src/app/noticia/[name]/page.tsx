import TopBanner from "@/components/banner/top";
import { CompanyGridSection } from "@/components/companys/company-grid-section";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import HeroSection from "@/components/posts/sections/hero-section";
import PostGridSection from "@/components/posts/sections/post-grid-section";
import PostGridWwithColumnistSection from "@/components/posts/sections/post-grid-with-columnist-section";
import PostTopGridSection from "@/components/posts/sections/post-top-grid-section";

export default function NewsPage() {
  return (
    <DefaultPage>
      <Header />
      <main>
        <HeroSection />
        <PostGridSection />
        <PostGridWwithColumnistSection />
        <CompanyGridSection />
        <TopBanner />
        <PostTopGridSection />
      </main>
    </DefaultPage>
  );
}
