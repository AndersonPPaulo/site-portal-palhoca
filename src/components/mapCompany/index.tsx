"use client"

import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { CardCompany } from '../companys/card-company';
import companyImg from "@/assets/amigos-do-camarao.jpg"

// Mock de dados para as empresas
export const mockCompanys = [
  {
    id: '1',
    name: "Amigos do Camarão",
    address: "Av. Atlântica, 1520, Centro",
    category: "Restaurante",
    image: '/api/placeholder/80/80',
    lat: -27.646620,
    lng: -48.667361
  },
  {
    id: '2',
    name: "Padaria Delícia Real",
    address: "Rua das Flores, 234, Jardim Eldorado",
    category: "Padaria",
    image: '/api/placeholder/80/80',
    lat: -27.648820,
    lng: -48.669161
  },
  {
    id: '3',
    name: "Mercado São Jorge",
    address: "Av. Principal, 789, Centro",
    category: "Supermercado",
    image: '/api/placeholder/80/80',
    lat: -27.646120,
    lng: -48.673561
  },
  {
    id: '4',
    name: "Farmácia Saúde Total",
    address: "Rua dos Ipês, 432, Caminho Novo",
    category: "Farmácia",
    image: '/api/placeholder/80/80',
    lat: -27.642520,
    lng: -48.671361
  },
  {
    id: '5',
    name: "Auto Peças Silva",
    address: "Av. Industrial, 567, Brejaru",
    category: "Autopeças",
    image: '/api/placeholder/80/80',
    lat: -27.639720,
    lng: -48.675561
  },
  {
    id: '6',
    name: "Pizzaria Bella Napoli",
    address: "Rua das Palmeiras, 890, Centro",
    category: "Restaurante",
    image: '/api/placeholder/80/80',
    lat: -27.645220,
    lng: -48.668361
  },
  {
    id: '7',
    name: "Açougue do Paulo",
    address: "Av. Central, 123, Ponte do Imaruim",
    category: "Açougue",
    image: '/api/placeholder/80/80',
    lat: -27.633720,
    lng: -48.665361
  },
  {
    id: '8',
    name: "Papelaria Criativa",
    address: "Rua do Comércio, 456, Centro",
    category: "Papelaria",
    image: '/api/placeholder/80/80',
    lat: -27.644920,
    lng: -48.669861
  },
  {
    id: '9',
    name: "Pet Shop Amigo Fiel",
    address: "Av. das Gaivotas, 789, Pachecos",
    category: "Pet Shop",
    image: '/api/placeholder/80/80',
    lat: -27.649920,
    lng: -48.674361
  },
  {
    id: '10',
    name: "Oficina Mecânica Precisão",
    address: "Rua Industrial, 321, Aririú",
    category: "Oficina Mecânica",
    image: '/api/placeholder/80/80',
    lat: -27.651320,
    lng: -48.683361
  },
  {
    id: '11',
    name: "Café & Bistrô Sabor",
    address: "Av. Beira Mar, 654, Centro",
    category: "Cafeteria",
    image: '/api/placeholder/80/80',
    lat: -27.645620,
    lng: -48.667761
  },
  {
    id: '12',
    name: "Loja de Roupas Fashion Style",
    address: "Rua do Shopping, 987, Centro",
    category: "Vestuário",
    image: '/api/placeholder/80/80',
    lat: -27.647320,
    lng: -48.669861
  }
];

// Definição de tipos para melhor tipagem
export const CommerceTypes = {
  RESTAURANT: 'Restaurante',
  STORE: 'Loja',
  MARKET: 'Supermercado',
  CAFE: 'Cafeteria',
  SERVICE: 'Serviço',
  BAKERY: 'Padaria',
  PHARMACY: 'Farmácia',
  AUTOPARTS: 'Autopeças',
  BUTCHER: 'Açougue',
  STATIONERY: 'Papelaria',
  PETSHOP: 'Pet Shop',
  MECHANIC: 'Oficina Mecânica',
  CLOTHING: 'Vestuário'
} as const;

// Tipo para as categorias de comércio
export type CommerceType = typeof CommerceTypes[keyof typeof CommerceTypes];

// Interface para os dados de comércio
interface CommerceData {
  id: string;
  name: string;
  type: CommerceType;
  description: string;
  lat: number;
  lng: number;
  image?: string;
}

// Interface para os dados brutos do mockCompanys
interface RawCommerceData {
  id: string;
  name: string;
  address: string;
  category: string;
  image: string;
  lat: number;
  lng: number;
}

// Propriedades do componente CommercialMap
interface CommercialMapProps {
  initialCommerces?: RawCommerceData[] | CommerceData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}



// Função para criar ícone personalizado usando o MapPin do Lucide React
const createMapPinIcon = (color = '#4B5563') => {
  // Renderiza o componente MapPin para string HTML
  const mapPinSvg = ReactDOMServer.renderToString(
    <MapPin color={color} size={32} strokeWidth={2} />
  );
  
  // Converte para URL de dados
  const svgDataUrl = `data:image/svg+xml;base64,${btoa(mapPinSvg)}`;
  
  // Cria um ícone do Leaflet
  return new Icon({
    iconUrl: svgDataUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],   // Ancora o pin na ponta inferior
    popupAnchor: [0, -32]   // Posiciona o popup acima do pin
  });
};

const CommercialMap: React.FC<CommercialMapProps> = ({ 
  initialCommerces = mockCompanys,
  center = [-27.646620, -48.670361], // Centro de Palhoça, SC
  zoom = 14,
  height = 'h-screen',
}) => {
  // Converter os dados do mockCompanys para o formato usado pelo componente
  const convertMockData = (data: RawCommerceData[]): CommerceData[] => {
    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.category as CommerceType,
      description: item.address,
      lat: item.lat,
      lng: item.lng,
      image: item.image
    }));
  };

  // Verificar se os dados são do formato bruto (mockCompanys) ou já estão no formato interno
  const isRawData = (data: any[]): data is RawCommerceData[] => {
    return data.length > 0 && 'category' in data[0] && 'address' in data[0];
  };

  // Estado para armazenar os comércios
  const [commerces, setCommerces] = useState<CommerceData[]>(() => {
    if (Array.isArray(initialCommerces) && initialCommerces.length > 0) {
      return isRawData(initialCommerces) 
        ? convertMockData(initialCommerces) 
        : initialCommerces as CommerceData[];
    }
    return [];
  });

  // Atualizar os comércios quando as props mudarem
  useEffect(() => {
    if (Array.isArray(initialCommerces) && initialCommerces.length > 0) {
      const processedData = isRawData(initialCommerces) 
        ? convertMockData(initialCommerces) 
        : initialCommerces as CommerceData[];
      setCommerces(processedData);
    }
  }, [initialCommerces]);

  return (
    <div className="flex h-full">
      {/* Mapa alinhado à esquerda ocupando toda a altura com largura fixa de 408px */}
      <div className={`${height} w-[408px] flex-shrink-0 rounded-lg overflow-hidden border shadow-lg`}>
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Renderizar marcadores para cada comércio */}
          {commerces.map((commerce) => (
            <Marker 
              key={commerce.id} 
              position={[commerce.lat, commerce.lng]}
              icon={createMapPinIcon('#4B5563')}
            >
              <Popup>
                <div className="w-60">
                  <CardCompany
                    company={{
                      name: commerce.name,
                      address: commerce.description,
                      category: commerce.type,
                      image: companyImg,
                    }}
                  />
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default CommercialMap;