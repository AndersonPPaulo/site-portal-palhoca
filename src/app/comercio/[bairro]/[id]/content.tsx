"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { usePublicCompany } from "@/provider/company";
import { CompanyAnalyticsContext } from "@/provider/analytics/company";
import DefaultImage from "../../../../assets/no-img.png";

// Função para extrair coordenadas do link do Google Maps
function extractCoordinatesFromMapsLink(
  mapsLink: string
): { lat: number; lng: number } | null {
  if (!mapsLink) return null;

  try {
    // Padrão: https://www.google.com/maps?q=LAT,LNG
    const url = new URL(mapsLink);
    const qParam = url.searchParams.get("q");

    if (qParam && qParam.includes(",")) {
      const [lat, lng] = qParam.split(",");
      const latitude = parseFloat(lat.trim());
      const longitude = parseFloat(lng.trim());

      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { lat: latitude, lng: longitude };
      }
    }
  } catch (error) {
    console.error("Erro ao extrair coordenadas do link:", error);
  }

  return null;
}

// Função para gerar URL do iframe do Google Maps com marcador
function generateMapsEmbedUrl(
  lat: number,
  lng: number,
  businessName?: string
): string {
  // Usando o formato que garante um pin/marcador nas coordenadas exatas
  const encodedName = businessName ? encodeURIComponent(businessName) : "";
  return `https://maps.google.com/maps?width=100%25&height=300&hl=pt&q=${lat},${lng}+(${encodedName})&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
}

// Função para normalizar texto para comparação de slugs
function normalizeText(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export default function ComercioDetails() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { loading, error, getCompanyById } = usePublicCompany();

  // Analytics Context
  const companyAnalytics = useContext(CompanyAnalyticsContext);
  const { TrackCompanyView, TrackCompanyMapClick, TrackCompanyWhatsappClick } =
    companyAnalytics || {};

  const [company, setCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTrackedInitialView, setHasTrackedInitialView] = useState(false);

  useEffect(() => {
    const loadCompanyDetails = async () => {
      setIsLoading(true);

      const companyName = params.id as string;

      const companyNameReplace = companyName.replace(/-/g, " ");

      if (companyNameReplace) {
        try {
          const apiCompany = await getCompanyById(companyNameReplace);

          // Extrair coordenadas do link do Google Maps
          const coordinates = extractCoordinatesFromMapsLink(
            apiCompany.linkLocationMaps
          );

          // Adaptar dados da API para o formato esperado pelo componente
          const adaptedCompany = {
            id: apiCompany.id,
            name: apiCompany.name,
            category: apiCompany.company_category?.[0]?.name || "Comércio",
            categories: apiCompany.company_category || [],
            image: apiCompany.company_image?.url || DefaultImage,
            phone: apiCompany.phone || "Não informado",
            description: apiCompany.description || "Descrição não disponível",
            hours: apiCompany.openingHours || "Horário não informado",
            address: apiCompany.address || "Endereço não informado",
            linkWhatsapp: apiCompany.linkWhatsapp,
            linkLocationMaps: apiCompany.linkLocationMaps,
            linkLocationWaze: apiCompany.linkLocationWaze,
            location: coordinates || {
              lat: -27.64662,
              lng: -48.667361,
            },
          };

          setCompany(adaptedCompany);
        } catch (error) {
          console.error("Erro ao carregar detalhes:", error);
          setCompany(null);
        }
      }

      setIsLoading(false);
    };

    loadCompanyDetails();
  }, [params.id]);

  // Analytics: Track view inicial da página de detalhes
  useEffect(() => {
    if (company && !hasTrackedInitialView && TrackCompanyView) {
      TrackCompanyView(company.id, {
        page: pathname,
        section: "company-details",
        position: "detail-page",
        companyName: company.name,
        categories: company.categories?.map((cat: any) => cat.name) || [
          company.category,
        ],
        primaryCategory: company.category,
        address: company.address,
        phone: company.phone,
        hasWhatsapp: !!company.linkWhatsapp,
        hasMapsLink: !!company.linkLocationMaps,
        hasWazeLink: !!company.linkLocationWaze,
        viewType: "detail_view",
        timestamp: new Date().toISOString(),
      });

      setHasTrackedInitialView(true);
    }
  }, [company, hasTrackedInitialView, TrackCompanyView, pathname]);

  // Analytics: Função para tracking de clique no WhatsApp
  const handleWhatsAppClick = () => {
    if (company?.id && TrackCompanyWhatsappClick) {
      TrackCompanyWhatsappClick(company.id, {
        page: pathname,
        section: "company-details",
        position: "whatsapp-button",
        companyName: company.name,
        primaryCategory: company.category,
        whatsappLink: company.linkWhatsapp,
        clickSource: "detail_page_button",
        timestamp: new Date().toISOString(),
      });
    }

    // Pequeno delay para garantir envio do evento antes de abrir link
    setTimeout(() => {
      if (company?.linkWhatsapp) {
        window.open(company.linkWhatsapp, "_blank");
      }
    }, 100);
  };

  // Analytics: Função para tracking de clique no Maps
  const handleMapsClick = () => {
    if (company?.id && TrackCompanyMapClick) {
      TrackCompanyMapClick(company.id, {
        page: pathname,
        section: "company-details",
        position: "maps-button",
        companyName: company.name,
        primaryCategory: company.category,
        mapService: "google_maps",
        mapsLink: company.linkLocationMaps,
        coordinates: company.location,
        clickSource: "detail_page_button",
        timestamp: new Date().toISOString(),
      });
    }

    // Pequeno delay para garantir envio do evento antes de abrir link
    setTimeout(() => {
      if (company?.linkLocationMaps) {
        window.open(company.linkLocationMaps, "_blank");
      }
    }, 100);
  };

  // Analytics: Função para tracking de clique no Waze
  const handleWazeClick = () => {
    if (company?.id && TrackCompanyMapClick) {
      TrackCompanyMapClick(company.id, {
        page: pathname,
        section: "company-details",
        position: "waze-button",
        companyName: company.name,
        primaryCategory: company.category,
        mapService: "waze",
        wazeLink: company.linkLocationWaze,
        coordinates: company.location,
        clickSource: "detail_page_button",
        timestamp: new Date().toISOString(),
      });
    }

    // Pequeno delay para garantir envio do evento antes de abrir link
    setTimeout(() => {
      if (company?.linkLocationWaze) {
        window.open(company.linkLocationWaze, "_blank");
      }
    }, 100);
  };

  if (isLoading || loading) {
    return (
      <DefaultPage>
        <Header />
        <div className="max-w-[1272px] mx-auto px-7 py-5">
          <div className="w-full py-20 text-center">
            <div
              className="animate-spin inline-block w-10 h-10 border-4 border-current border-t-transparent text-red-600 rounded-full"
              role="status"
            >
              <span className="sr-only">Carregando...</span>
            </div>
            <p className="mt-4 text-gray-500 text-lg">
              Carregando detalhes do comércio...
            </p>
          </div>
        </div>
      </DefaultPage>
    );
  }

  if (!company || error) {
    return (
      <DefaultPage>
        <Header />
        <div className="max-w-[1272px] mx-auto px-7 py-5">
          <div className="w-full py-12 text-center bg-red-50 rounded-lg border border-red-200 px-4">
            <h3 className="text-xl font-semibold text-red-600 mb-2">
              Comércio não encontrado
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              {error || "Não foi possível encontrar o comércio solicitado."}
            </p>
            <Button
              variant="default"
              className="bg-red-600 hover:bg-red-700 rounded-full"
              onClick={() => router.push("/comercio")}
            >
              Voltar para a lista
            </Button>
          </div>
        </div>
      </DefaultPage>
    );
  }

  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto py-5">
        {/* Trilha de navegação */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-red-600 transition-colors">
            Início
          </Link>
          <span className="text-gray-400">›</span>
          <Link
            href="/comercio"
            className="hover:text-red-600 transition-colors"
          >
            Comércios de Palhoça
          </Link>
          <span className="text-gray-400">›</span>
          <Link
            href={`/comercio?categoria=${normalizeText(company.category)}`}
            className="hover:text-red-600 transition-colors"
          >
            {company.category}
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-red-600 font-medium">{company.name}</span>
        </div>

        {/* Conteúdo principal com borda */}
        <div className="rounded-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Coluna da esquerda com imagem e indicadores */}
            {/* Imagem principal */}
            <div className="relative w-[335px] lg:w-[480px] lg:min-w-[480px] h-[355px] rounded-lg overflow-hidden">
              <Image
                src={company.image}
                alt={company.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Detalhes do comércio */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>

              <div className="inline-block bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm font-medium mb-5">
                {company.category}
              </div>

              <p className="text-gray-700 mb-4 ">{company.description}</p>

              <div className="space-y-3">
                {/* Horário */}
                <div className="flex items-start gap-2">
                  <Clock className="#363636 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{company.hours}</span>
                </div>

                {/* Endereço */}
                <div className="flex items-start gap-2">
                  <MapPin className="#363636 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 max-w-2xl">
                    {company.address}
                  </span>
                </div>
              </div>

              {/* Botão WhatsApp com analytics */}
              {company.linkWhatsapp && (
                <Button
                  className="bg-green-200 hover:bg-green-100 cursor-pointer mt-10 rounded-4xl px-4 py-2 text-green-600 flex items-center gap-2"
                  variant="default"
                  onClick={handleWhatsAppClick}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Contato via WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Container com largura fixa para seção de localização - mesmo width do mapa */}
        <div className="max-w-[978px] ">
          {/* Seção de localização */}
          <section>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-bold mb-4 sm:mb-0">Localização</h2>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-gray-300 cursor-pointer  rounded-4xl flex items-center gap-2"
                  onClick={handleMapsClick}
                  disabled={!company.linkLocationMaps}
                >
                  <svg viewBox="0 0 20 20" fill="#363636">
                    <path d="M8.49963 0.755066C10.6881 0.755066 12.7869 1.62443 14.3344 3.1719C15.8819 4.71937 16.7512 6.81819 16.7512 9.00665C16.7512 11.825 15.2146 14.1318 13.5954 15.7867C12.7865 16.6046 11.9038 17.3461 10.9586 18.0018L10.568 18.2677L10.3847 18.3896L10.039 18.6097L9.73095 18.7976L9.34954 19.0195C9.09066 19.1673 8.79772 19.245 8.49963 19.245C8.20154 19.245 7.9086 19.1673 7.64972 19.0195L7.26831 18.7976L6.79155 18.5042L6.61552 18.3896L6.23961 18.1393C5.21993 17.4494 4.27015 16.6615 3.40382 15.7867C1.78467 14.1309 0.248047 11.825 0.248047 9.00665C0.248047 6.81819 1.11741 4.71937 2.66488 3.1719C4.21235 1.62443 6.31117 0.755066 8.49963 0.755066ZM8.49963 6.25612C8.13842 6.25612 7.78076 6.32726 7.44705 6.46549C7.11334 6.60372 6.81012 6.80632 6.55471 7.06173C6.2993 7.31714 6.0967 7.62036 5.95847 7.95407C5.82025 8.28778 5.7491 8.64544 5.7491 9.00665C5.7491 9.36785 5.82025 9.72552 5.95847 10.0592C6.0967 10.3929 6.2993 10.6962 6.55471 10.9516C6.81012 11.207 7.11334 11.4096 7.44705 11.5478C7.78076 11.686 8.13842 11.7572 8.49963 11.7572C9.22911 11.7572 9.92872 11.4674 10.4445 10.9516C10.9604 10.4357 11.2502 9.73613 11.2502 9.00665C11.2502 8.27716 10.9604 7.57755 10.4445 7.06173C9.92872 6.54591 9.22911 6.25612 8.49963 6.25612Z" />
                  </svg>
                  Rota Maps
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 cursor-pointer rounded-4xl flex items-center gap-2"
                  onClick={handleWazeClick}
                  disabled={!company.linkLocationWaze}
                >
                  <svg viewBox="0 0 20 20" fill="#363636">
                    <path d="M18.5402 3.63C19.2302 4.57 19.6902 5.67 19.8902 6.82C20.1002 8.07 20.0002 9.34 19.5802 10.54C19.1819 11.7122 18.4939 12.7647 17.5802 13.6C16.9115 14.2384 16.1494 14.7712 15.3202 15.18C15.7302 16.25 15.1902 17.45 14.1202 17.86C13.8802 17.95 13.6302 18 13.3802 18C12.8439 17.9978 12.3291 17.7885 11.9434 17.4159C11.5577 17.0432 11.3308 16.5359 11.3102 16H8.24019C8.13019 17.14 7.11019 18 5.97019 17.87C4.91019 17.77 4.11019 16.89 4.09019 15.83C4.10019 15.64 4.13019 15.44 4.19019 15.26C2.60186 14.7314 1.20852 13.7386 0.190188 12.41C-0.139812 11.97 -0.0398116 11.34 0.420188 11C0.600188 10.86 0.820188 10.78 1.05019 10.78C1.77019 10.78 2.05019 10.53 2.22019 10.15C2.46019 9.43 2.60019 8.68 2.61019 7.92C2.64019 7.39 2.70019 6.87 2.78019 6.35C3.13069 4.61867 4.09708 3.07315 5.50019 2C7.16019 0.7 9.19019 0 11.2902 0C12.7202 0 14.1302 0.35 15.4002 1C16.6412 1.61428 17.7177 2.51593 18.5402 3.63ZM14.7202 14.31C16.5002 13.5 17.9002 12.04 18.5902 10.21C20.2102 5.27 16.0002 1.05 11.2902 1.05C10.9402 1.05 10.5802 1.07 10.2302 1.12C7.36019 1.5 4.40019 3.5 3.81019 6.5C3.43019 8.5 4.00019 11.79 1.05019 11.79C2.00019 13 3.32019 13.93 4.81019 14.37C5.66019 13.61 6.97019 13.69 7.74019 14.55C7.85019 14.67 7.94019 14.8 8.00019 14.94H11.5502C12.0702 13.92 13.3302 13.5 14.3502 14.04C14.5002 14.12 14.6002 14.21 14.7202 14.31ZM8.97019 7.31C8.39019 7.34 7.88019 6.9 7.85019 6.31C7.82019 5.73 8.27019 5.23 8.85019 5.19C9.43019 5.16 9.94019 5.61 9.97019 6.25C9.97554 6.38216 9.95461 6.51407 9.90863 6.63809C9.86264 6.7621 9.79251 6.87577 9.70229 6.97249C9.61208 7.06922 9.50357 7.14709 9.38305 7.20159C9.26253 7.25609 9.1324 7.28614 9.00019 7.29L8.97019 7.31ZM13.6602 7.31C13.0802 7.34 12.5702 6.9 12.5402 6.31C12.5002 5.73 12.9602 5.23 13.5402 5.19C14.1202 5.16 14.6302 5.61 14.6602 6.25C14.6802 6.8 14.2502 7.27 13.6602 7.29V7.31ZM7.71019 9.07C7.65019 8.79 7.84019 8.5 8.12019 8.45C8.40019 8.4 8.68019 8.58 8.74019 8.86C8.91025 9.39895 9.25791 9.86437 9.72645 10.1804C10.195 10.4964 10.7568 10.6443 11.3202 10.6C12.4602 10.66 13.5002 9.96 13.8902 8.88C14.0302 8.62 14.3502 8.5 14.6002 8.65C14.7802 8.75 14.8902 8.92 14.8902 9.12C14.7002 9.83 14.2602 10.45 13.6602 10.88C12.9702 11.36 12.1602 11.63 11.3202 11.64H11.2102C9.58019 11.71 8.11019 10.64 7.68019 9.06L7.71019 9.07Z" />
                  </svg>
                  Rota Waze
                </Button>
              </div>
            </div>

            {/* Mapa com largura fixa de 978px e pin do comércio */}
            <div className="h-[300px] z-0 w-full bg-gray-200 rounded-md flex items-center justify-center mb-8">
              <iframe
                src={generateMapsEmbedUrl(
                  company.location.lat,
                  company.location.lng,
                  company.name
                )}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "8px", zIndex: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Localização de ${company.name}`}
              ></iframe>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </DefaultPage>
  );
}
