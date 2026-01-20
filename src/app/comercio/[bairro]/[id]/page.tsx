import { Metadata } from "next";
import ComercioDetails from "./content";
import { getCompanyByIdServer } from "./get-company";

const capitalize = (text?: string) => {
  if (!text) return "";
  return text
    .split("-") // divide por hífen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "); // junta com espaço
};

export async function generateMetadata({
  params,
}: {
  params: Promise<any>;
}): Promise<Metadata> {
  const { id, bairro } = await params;
  console.log("bairro", bairro);

  const comercio = await getCompanyByIdServer(id);

  if (!comercio) {
    return {
      title: "Comércio não encontrado - Portal Palhoça",
      description: "O comércio informado não foi localizado.",
    };
  }

  const imageUrl =
    comercio.company_image?.url ||
    "https://portalpalhoca.com.br/images/default-og-image.jpg";

  return {
    title: `${comercio.name} - ${capitalize(bairro)} - ${capitalize(
      comercio.city,
    )} | Portal Palhoça`,
    description:
      comercio.description ||
      "Informações detalhadas sobre este comércio em Palhoça você vê aqui!.",
    openGraph: {
      title: `${capitalize(comercio.name)}, ${capitalize(
        bairro,
      )} - ${capitalize(comercio.city)} | Portal Palhoça`,
      description:
        comercio.description || "Descubra mais sobre este comércio em Palhoça.",
      url: `https://portalpalhoca.com.br/comercio/${bairro}/${id}`,
      siteName: "Portal Palhoça",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Imagem do comércio ${comercio.name}`,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${comercio.name} - ${bairro}`,
      description:
        comercio.description ||
        "Informações detalhadas sobre este comércio em Palhoça.",
      images: [imageUrl],
    },
  };
}

export default async function ComercioPage() {
  return (
    <div className="p-4">
      <ComercioDetails />
    </div>
  );
}
