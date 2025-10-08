"use client";

import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { MapPin } from "lucide-react";
import ReactDOMServer from "react-dom/server";
import { CardCompany } from "../companys/card-company";
import { IPublicCompany } from "@/provider/company";
import default_image from "@/assets/no-img.png";
import { StaticImageData } from "next/image";

interface ICompanyCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Interface para imagens da empresa
interface ICompanyImage {
  id: string;
  key: string;
  url: string;
  original_name?: string;
  mime_type?: string;
  size?: number;
  uploaded_at?: Date;
  company_id: string;
}

interface CommerceMapData {
  id: string;
  name: string;
  address: string;
  company_category: ICompanyCategory[];
  company_image: ICompanyImage | StaticImageData;
  lat: number;
  lng: number;
}

// Propriedades do componente CommercialMap
interface CommercialMapProps {
  companies?: IPublicCompany[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  width?: string;
  singleCompany?: boolean;
  currentPage?: number;
}

// Função para criar ícone personalizado usando o MapPin do Lucide React
const createMapPinIcon = (color = "#EF4444", isSelected = false) => {
  const mapPinSvg = ReactDOMServer.renderToString(
    <MapPin
      color={isSelected ? "#DC2626" : color}
      size={isSelected ? 36 : 32}
      strokeWidth={isSelected ? 3 : 2}
      fill={isSelected ? "#FEE2E2" : "none"}
    />
  );

  const svgDataUrl = `data:image/svg+xml;base64,${btoa(mapPinSvg)}`;

  return new Icon({
    iconUrl: svgDataUrl,
    iconSize: isSelected ? [36, 36] : [32, 32],
    iconAnchor: isSelected ? [18, 36] : [16, 32],
    popupAnchor: [0, isSelected ? -36 : -32],
  });
};

const CommercialMap: React.FC<CommercialMapProps> = ({
  companies,
  center = [-27.64662, -48.670361],
  zoom = 10,
  height = "h-screen",
  width = "w-full",
  singleCompany = false,
  currentPage = 1,
}) => {
  const [mapData, setMapData] = useState<CommerceMapData[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);

  // Processar dados das empresas
  useEffect(() => {
    console.log("companies", companies);
    if (!companies || !Array.isArray(companies) || companies.length === 0) {
      setMapData([]);
      return;
    }

    const processedData: CommerceMapData[] = [];

    companies.forEach((company) => {
      // Verificar se temos coordenadas válidas (lat e long)
      const hasValidCoordinates =
        company.lat &&
        company.long &&
        !isNaN(company.lat) &&
        !isNaN(company.long) &&
        company.lat !== 0 &&
        company.long !== 0;

      if (hasValidCoordinates) {
        processedData.push({
          id: company.id,
          name: company.name,
          address: company.address,
          company_category: company.company_category || [],
          company_image: company.company_image
            ? company.company_image
            : default_image,
          lat: company.lat,
          lng: company.long, // Converter 'long' para 'lng' para usar no Leaflet
        });
      } else {
        console.warn(
          `Empresa "${company.name}" (ID: ${company.id}) não possui coordenadas válidas`
        );
      }
    });

    setMapData(processedData);

    // Se for empresa única, centralizar no pin da empresa
    if (singleCompany && processedData.length === 1) {
      setMapCenter([processedData[0].lat, processedData[0].lng]);
      setMapZoom(16); // Zoom mais próximo para empresa única
    } else if (processedData.length > 0) {
      // Para múltiplas empresas, calcular centro médio se necessário
      // ou usar o centro padrão
      setMapCenter(center);
      setMapZoom(zoom);
    } else {
      // Se não há empresas com coordenadas válidas, usar centro padrão
      setMapCenter(center);
      setMapZoom(zoom);
    }
  }, [companies, singleCompany, currentPage]);

  // Se não há dados para mostrar no mapa
  if (mapData.length === 0) {
    return (
      <div
        className={`${height} ${width} flex items-center justify-center bg-gray-100 rounded-lg border`}
      >
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
          <p>Localização não disponível</p>
          <p className="text-xs mt-2">
            Nenhuma empresa com coordenadas válidas foi encontrada
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${height} ${width} rounded-lg overflow-hidden border shadow-lg`}
    >
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}-${currentPage}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Renderizar marcadores para cada comércio */}
        {mapData.map((commerce) => (
          <Marker
            key={commerce.id}
            position={[commerce.lat, commerce.lng]}
            icon={createMapPinIcon("#0f0f0f", singleCompany)}
          >
            <Popup maxWidth={280} minWidth={250}>
              <div className="w-60">
                <CardCompany
                  company={{
                    name: commerce.name,
                    address: commerce.address,
                    company_category: commerce.company_category,
                    company_image:
                      typeof commerce.company_image === "object" &&
                      "id" in commerce.company_image
                        ? commerce.company_image
                        : undefined,
                    id: commerce.id,
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CommercialMap;