import { StaticImageData } from "next/image";

export interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  description: string;
  date: string;
  image: StaticImageData;
}
