import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import PostPage from "@/components/posts/post-page";
import { getArticleBySlug } from "@/lib/getArticleBySlug";
import default_image from "@/assets/no-img.png";

import type { Metadata } from "next";
import { Article } from "@/provider/article";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; slug: string }>;
}): Promise<Metadata> {
  // Agora você precisa aguardar os params
  const { slug } = await params;

  const article: Article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Noticias Portal Palhoça",
      description:
        "Essa notícia foi encontrada, porem pode ter ocorrido algum erro ao carregar.",
    };
  }

  return {
    title: `${article.title} | Portal Palhoça`,
    description: article.resume_content,
    openGraph: {
      type: "article",
      siteName: "Portal Palhoça",
      title: `${article.title} | Portal Palhoça`,
      description: article.resume_content,
      images: [
        {
          url:
            article && article?.thumbnail && article?.thumbnail?.url
              ? article?.thumbnail?.url
              : default_image.src,
          width: 1200,
          height: 630,
          alt:
            article && article?.thumbnail && article?.thumbnail?.description
              ? article?.thumbnail?.description
              : "Descrição do conteudo não encontrado ou não carregado corretamente",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | Portal Palhoça`,
      description:
        article && article.resume_content
          ? article.resume_content
          : "Resumo do conteudo não encontrado ou não carregado corretamente",
      images: [
        article && article?.thumbnail && article?.thumbnail?.url
          ? article?.thumbnail?.url
          : default_image.src,
      ],
    },
  };
}
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
