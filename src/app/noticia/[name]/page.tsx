import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/posts/sections/hero-section";
import ListArticlesByCategory from "@/components/posts/sections/list-news-by-category";
import PostGridSection from "@/components/posts/sections/post-grid-section";
import PostGridWwithColumnistSection from "@/components/posts/sections/post-grid-with-columnist-section";

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
