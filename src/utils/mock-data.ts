import ImagePost from "@/assets/post/image-post.jpg";
import ImagePost2 from "@/assets/post/image-post-2.jpg";
import ImagePost3 from "@/assets/post/image-post-3.jpg";
import ImagePost4 from "@/assets/post/image-post-4.jpg";
import colunista from "@/assets/colunista/colunista.jpg";
import colunista2 from "@/assets/colunista/colunista-2.jpg";

import companyImg from "@/assets/amigos-do-camarao.jpg";
import { Post } from "@/types";

// Função para gerar um slug a partir do nome
function generateSlug(name: string): string {
  return name
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Interface para as empresas
export interface Company {
  id: string;
  name: string;
  address: string;
  category: string;
  image: any;
  district: string;
}

// Interface para empresas com slug
export interface CompanyWithSlug extends Company {
  slug: string;
}

export const mockCompanys: Company[] = [
  {
    id: "1",
    name: "kayron",
    address: "Av. Atlântica, 1520, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "2",
    name: " Delícia Real",
    address: "Rua das Flores, 234, Jardim Eldorado",
    category: "Padaria",
    district: "Jardim Eldorado",
    image: companyImg,
  },
  {
    id: "3",
    name: " São Jorge",
    address: "Av. Principal, 789, Centro",
    category: "Supermercado",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "4",
    name: "  Total",
    address: "Rua dos Ipês, 432, Caminho Novo",
    category: "Farmácia",
    district: "Caminho Novo",
    image: companyImg,
  },
  {
    id: "5",
    name: "  Silva",
    address: "Av. Industrial, 567, Brejaru",
    category: "Autopeças",
    district: "Brejaru",
    image: companyImg,
  },
  {
    id: "6",
    name: " Bella ",
    address: "Rua das Palmeiras, 890, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "7",
    name: "Açougue do Paulo",
    address: "Av. Central, 123, Ponte do Imaruim",
    category: "Açougue",
    district: "Ponte do Imaruim",
    image: companyImg,
  },
  {
    id: "8",
    name: "Papelaria Criativa",
    address: "Rua do Comércio, 456, Centro",
    category: "Papelaria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "9",
    name: "Pet Shop  Fiel",
    address: "Av. das Gaivotas, 789, Pachecos",
    category: "Pet Shop",
    district: "Pachecos",
    image: companyImg,
  },
  {
    id: "10",
    name: "Oficina Mecânica Precisão",
    address: "Rua Industrial, 321, Aririú",
    category: "Oficina Mecânica",
    district: "Aririú",
    image: companyImg,
  },
  {
    id: "11",
    name: " & Bistrô Sabor",
    address: "Av. Beira Mar, 654, Centro",
    category: "Cafeteria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "12",
    name: "Loja de Roupas Fashion Style",
    address: "Rua do Shopping, 987, Centro",
    category: "Vestuário",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "13",
    name: "  Camarão",
    address: "Av. Atlântica, 1520, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "14",
    name: "Padaria Delícia Real",
    address: "Rua das Flores, 234, Jardim Eldorado",
    category: "Padaria",
    district: "Jardim Eldorado",
    image: companyImg,
  },
  {
    id: "15",
    name: "Mercado  ",
    address: "Av. Principal, 789, Centro",
    category: "Supermercado",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "16",
    name: " Saúde ",
    address: "Rua dos Ipês, 432, Caminho Novo",
    category: "Farmácia",
    district: "Caminho Novo",
    image: companyImg,
  },
  {
    id: "17",
    name: "Auto  Silva",
    address: "Av. Industrial, 567, Brejaru",
    category: "Autopeças",
    district: "Brejaru",
    image: companyImg,
  },
  {
    id: "18",
    name: "Pizzaria Bella Napoli",
    address: "Rua das Palmeiras, 890, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "19",
    name: "Açougue do Paulo",
    address: "Av. Central, 123, Ponte do Imaruim",
    category: "Açougue",
    district: "Ponte do Imaruim",
    image: companyImg,
  },
  {
    id: "20",
    name: "Papelaria ",
    address: "Rua do Comércio, 456, Centro",
    category: "Papelaria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "21",
    name: "Pet Shop Amigo Fiel",
    address: "Av. das Gaivotas, 789, Pachecos",
    category: "Pet Shop",
    district: "Pachecos",
    image: companyImg,
  },
  {
    id: "22",
    name: " Mecânica Precisão",
    address: "Rua Industrial, 321, Aririú",
    category: "Oficina Mecânica",
    district: "Aririú",
    image: companyImg,
  },
  {
    id: "23",
    name: "Café & Bistrô ",
    address: "Av. Beira Mar, 654, Centro",
    category: "Cafeteria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "24",
    name: "Loja de Roupas Fashion Style",
    address: "Rua do Shopping, 987, Centro",
    category: "Vestuário",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "25",
    name: "Amigos do Camarão",
    address: "Av. Atlântica, 1520, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "26",
    name: "Padaria Delícia Real",
    address: "Rua das Flores, 234, Jardim Eldorado",
    category: "Padaria",
    district: "Jardim Eldorado",
    image: companyImg,
  },
  {
    id: "27",
    name: "Mercado São Jorge",
    address: "Av. Principal, 789, Centro",
    category: "Supermercado",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "28",
    name: "Farmácia Saúde Total",
    address: "Rua dos Ipês, 432, Caminho Novo",
    category: "Farmácia",
    district: "Caminho Novo",
    image: companyImg,
  },
  {
    id: "29",
    name: "Auto Peças Silva",
    address: "Av. Industrial, 567, Brejaru",
    category: "Autopeças",
    district: "Brejaru",
    image: companyImg,
  },
  {
    id: "30",
    name: "Pizzaria Bella Napoli",
    address: "Rua das Palmeiras, 890, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "31",
    name: "Açougue do Paulo",
    address: "Av. Central, 123, Ponte do Imaruim",
    category: "Açougue",
    district: "Ponte do Imaruim",
    image: companyImg,
  },
  {
    id: "32",
    name: "Papelaria Criativa",
    address: "Rua do Comércio, 456, Centro",
    category: "Papelaria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "33",
    name: "Pet Shop Amigo Fiel",
    address: "Av. das Gaivotas, 789, Pachecos",
    category: "Pet Shop",
    district: "Pachecos",
    image: companyImg,
  },
  {
    id: "34",
    name: "Oficina Mecânica Precisão",
    address: "Rua Industrial, 321, Aririú",
    category: "Oficina Mecânica",
    district: "Aririú",
    image: companyImg,
  },
  {
    id: "35",
    name: "Café & Bistrô Sabor",
    address: "Av. Beira Mar, 654, Centro",
    category: "Cafeteria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "36",
    name: "Loja de Roupas Fashion Style",
    address: "Rua do Shopping, 987, Centro",
    category: "Vestuário",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "37",
    name: "Amigos do Camarão",
    address: "Av. Atlântica, 1520, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "38",
    name: "Padaria Delícia Real",
    address: "Rua das Flores, 234, Jardim Eldorado",
    category: "Padaria",
    district: "Jardim Eldorado",
    image: companyImg,
  },
  {
    id: "39",
    name: "Mercado São Jorge",
    address: "Av. Principal, 789, Centro",
    category: "Supermercado",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "40",
    name: "Farmácia Saúde Total",
    address: "Rua dos Ipês, 432, Caminho Novo",
    category: "Farmácia",
    district: "Caminho Novo",
    image: companyImg,
  },
  {
    id: "41",
    name: "Auto Peças Silva",
    address: "Av. Industrial, 567, Brejaru",
    category: "Autopeças",
    district: "Brejaru",
    image: companyImg,
  },
  {
    id: "42",
    name: "Pizzaria Bella Napoli",
    address: "Rua das Palmeiras, 890, Centro",
    category: "Restaurante",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "43",
    name: "Açougue do Paulo",
    address: "Av. Central, 123, Ponte do Imaruim",
    category: "Açougue",
    district: "Ponte do Imaruim",
    image: companyImg,
  },
  {
    id: "44",
    name: "Papelaria Criativa",
    address: "Rua do Comércio, 456, Centro",
    category: "Papelaria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "45",
    name: "Pet Shop Amigo Fiel",
    address: "Av. das Gaivotas, 789, Pachecos",
    category: "Pet Shop",
    district: "Pachecos",
    image: companyImg,
  },
  {
    id: "46",
    name: "Oficina Mecânica Precisão",
    address: "Rua Industrial, 321, Aririú",
    category: "Oficina Mecânica",
    district: "Aririú",
    image: companyImg,
  },
  {
    id: "47",
    name: "Café & Bistrô Sabor",
    address: "Av. Beira Mar, 654, Centro",
    category: "Cafeteria",
    district: "Centro",
    image: companyImg,
  },
  {
    id: "48",
    name: "Loja de Roupas Fashion Style",
    address: "Rua do Shopping, 987, Centro",
    category: "Vestuário",
    district: "Centro",
    image: companyImg,
  },
];

// Função para adicionar slugs às empresas
export function generateCompaniesWithSlugs(): CompanyWithSlug[] {
  return mockCompanys.map((company) => ({
    ...company,
    // Usa o slug do nome como ID adicional
    slug: generateSlug(company.name)
  }));
}

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Tecnologia transforma arquitetura urbana no Brasil",
    category: "Variedades",
    description:
      "Proin fermentum sapien non magna imperdiet, vel imperdiet erat volutpat. Suspendisse tincidunt metus condimentum ipsum pulvinar dapibus. Suspendisse potenti. Duis pulvinar faucibus urna eget. Cras mollis viverra sem.Duis pulvinar faucibus urna eget. Cras mollis viverra sem. Duis pulvinar faucibus urna eget.",
    content:
      "Vestibulum euismod accumsan ex sit amet accumsan. Donec nibh velit, molestie sed viverra vel, congue sit amet justo. Mauris quis bibendum quam. Sed sit amet orci sed ex sodales feugiat ut at augue. Duis eu luctus mauris. Etiam efficitur massa at tortor pharetra, id tincidunt erat suscipit. Integer sed feugiat erat. Ut blandit, neque sit amet dictum scelerisque, purus odio gravida diam, vel accumsan lectus nunc non turpis. Vestibulum euismod accumsan ex sit amet accumsan. Donec nibh velit, molestie sed viverra vel, congue sit amet justo. Mauris quis bibendum quam. Sed sit amet orci sed ex sodales feugiat ut at augue. Duis eu luctus mauris. Etiam efficitur massa at tortor pharetra, id tincidunt erat suscipit. Integer sed feugiat erat. Ut blandit, neque sit amet dictum scelerisque, purus odio gravida diam, vel accumsan lectus nunc non turpis. Vestibulum euismod accumsan ex sit amet accumsan. Donec nibh velit, molestie sed viverra vel, congue sit amet justo. Mauris quis bibendum quam. Sed sit amet orci sed ex sodales feugiat ut at augue. Duis eu luctus mauris. Etiam efficitur massa at tortor pharetra, id tincidunt erat suscipit. Integer sed feugiat erat. Ut blandit, neque sit amet dictum scelerisque, purus odio gravida diam, vel accumsan lectus nunc non turpis. Vestibulum euismod accumsan ex sit amet accumsan. Donec nibh velit, molestie sed viverra vel, congue sit amet justo. Mauris quis bibendum quam. Sed sit amet orci sed ex sodales feugiat ut at augue. Duis eu luctus mauris. Etiam efficitur massa at tortor pharetra, id tincidunt erat suscipit. Integer sed feugiat erat. Ut blandit, neque sit amet dictum scelerisque, purus odio gravida diam, vel accumsan lectus nunc non turpis.",
    date: "29/04/2025",
    image: ImagePost,
  },
  // ... outros posts
];

export const mockColumnists = [
  {
    id: 1,
    name: "Diogo Pacheco",
    topic: "Você conversa com ele?",
    image: colunista,
  },
  {
    id: 2,
    name: "Ísis Martins Vasquez",
    topic: "Palavrões: comunicação ou falta de educação?",
    image: colunista2,
  },
  {
    id: 3,
    name: "Matheus Andrade",
    topic: "Quando a inteligência artificial ultrapassa o humano?",
    image: colunista,
  },
  {
    id: 4,
    name: "Ísis Martins Vasquez",
    topic: "Palavrões: comunicação ou falta de educação?",
    image: colunista2,
  },
];