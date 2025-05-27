"use client";

import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardCompanyProps {
  name: string;
  address: string;
  category: string;
  image: StaticImageData | string;
  id?: string; // Adicionando ID opcional para identificação única
}

interface Props {
  company: CardCompanyProps;
  className?: string;
}

export function CardCompany({ company, className = "" }: Props) {
  const router = useRouter();
  
  // Função para gerar slug amigável para URL
  const generateSlug = (text: string): string => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  // Função para redirecionar para a página de detalhes
  const handleViewDetails = () => {
    // Gerar o ID da URL baseado no nome da empresa ou usar o ID existente
    const companyId = company.id || generateSlug(company.name);
    
    // Navegar para a página de detalhes
    router.push(`/comercios/detalhes/${companyId}`);
  };

  return (
    <div
      className={`overflow-hidden rounded-3xl shadow-lg h-full w-full ${className}`}
    >
      <div 
        className="relative h-[156px] w-full cursor-pointer"
        onClick={handleViewDetails}
      >
        <Image
          src={company.image}
          alt={company.name}
          fill
          className="object-cover"
          priority
        />
        <span className="absolute top-4 left-4 bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-sm font-medium">
          {company.category}
        </span>
      </div>

      <div className="p-4 lg:p-6">
        <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full -ms-1">
          {company.category}
        </span>
        <h3 
          className="text-base lg:text-xl font-semibold mb-2 mt-4 truncate cursor-pointer hover:text-red-600 transition-colors"
          onClick={handleViewDetails}
        >
          {company.name}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin size={16} className="text-red-500 flex-shrink-0" />
          <span className="text-sm truncate">{company.address}</span>
        </div>
        <Button 
          className="w-full rounded-full hover:text-red-600 cursor-pointer" 
          variant="outline"
          onClick={handleViewDetails}
        >
          <Phone className="mr-2 flex-shrink-0" /> Conferir número
        </Button>
      </div>
    </div>
  );
}

export default CardCompany;