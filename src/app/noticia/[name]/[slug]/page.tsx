import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import PostPage from "@/components/posts/post-page";

export default function News() {
  return (
    <DefaultPage>
      <Header />
      <main>
        <PostPage />
      </main>
      <footer>
        <Footer />
      </footer>
    </DefaultPage>
  );
}
