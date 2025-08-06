import { Suspense } from "react";
import { Metadata } from "next";
import ClientListArticlesByCategory from "./client-side";
import SlugToText from "@/utils/slugToText";

const capitalize = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  // Aguarda a resolução dos params e searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Tenta pegar a categoria dos params primeiro, depois dos searchParams
  const categoria =
    resolvedParams?.categoria ||
    (Array.isArray(resolvedSearchParams?.categoria)
      ? resolvedSearchParams.categoria[0]
      : resolvedSearchParams?.categoria);

  const categoriaNome = categoria
    ? capitalize(SlugToText(categoria))
    : "Comércios";
  console.log("categoriaNome", categoriaNome);

  const title = `${categoriaNome} em Palhoça | Portal Palhoça`;
  const description = `Explore os melhores ${categoriaNome.toLowerCase()} em Palhoça. Descubra serviços locais, empresas e muito mais na sua região.`;
  const keywords = [
    categoriaNome,
    "comércio local",
    "serviços",
    "empresas",
    "melhores comércios",
  ].join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientListArticlesByCategory />
    </Suspense>
  );
}
