"use client";

import Image from "next/image";
import { mockPosts } from "@/utils/mock-data";
import { ColumnistsSection } from "./columnists/columnist-section";
import PostTopGridSection from "./sections/post-top-grid-section";
import { useParams } from "next/navigation";
import PostBanner from "../banner/post-banner";
import { CompanyGridSection } from "../companys/company-grid-section";
import ButtonCTAWhatsAppButton from "../custom-button/cta-whatsapp-group-button";
import { Share2 } from "lucide-react";
import SideBanner from "../banner/side";
import Link from "next/link";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, ""); // Remove spaces
}

export default function PostPage() {
  const slug = useParams();

  const postFiltered = mockPosts.find(
    (item) => item.id.toString() === slug.slug?.toString()
  );

  const sidePosts = mockPosts.slice(0, 5);
  return (
    <section className="flex flex-col gap-6 mx-auto max-w-[1272px] justify-between">
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row w-full gap-2 rounded-2xl">
          {
            <div className="flex flex-col gap-3 rounded-xl p-2 transition">
              {/* aqui está autor, breadcrumb, categoria e compartilhar */}
              <div className="flex flex-col justify-between">
                <h3 className="text-4xl max-w-[820px] font-[700] ">
                  {postFiltered!.title}
                </h3>
                <div className="flex w-full justify-between">
                  <div className="flex items-center mt-2 gap-4">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {postFiltered!.category}
                    </span>
                    <p className="text-xs text-gray-500">
                      {postFiltered!.date}
                    </p>

                    <span className="flex gap-1 items-center hover:underline hover:cursor-pointer">
                      <Share2 className="h-3 w-3" /> Compartilhar
                    </span>
                  </div>
                </div>
              </div>

              {/* imagem */}
              <div className="relative max-w-[340px] lg:w-[840px] h-[475px] rounded-md overflow-hidden">
                <Image
                  src={postFiltered!.image}
                  alt={postFiltered!.title}
                  fill
                  className="object-cover "
                />
              </div>

              <span className="text-xs text-[#757575]">
                Foto: Vestibulum euismod accumsan ex sit amet accumsan.
              </span>

              {/* post banner */}
              <PostBanner />

              {/* conteudo */}
              <p className="text-[16px] text-[#363636] max-w-[840px] mb-10">
                {postFiltered!.content}
              </p>
              <ButtonCTAWhatsAppButton />
            </div>
          }
        </div>

        {/* Side Posts */}
        <div className="flex flex-col max-w-[356px]">
          <div className="shadow-md">
            {sidePosts.map((post, idx) => (
              <Link
                key={idx}
                href={`/noticia/${normalizeText(post.category)}/${post.id}`}
              >
                <div className="flex gap-3 rounded-xl p-2 transition">
                  <div className="relative min-w-[151px] h-[110px] rounded-sm overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between">
                    <h3 className="text-xl font-semibold leading-tight line-clamp-3">
                      {post.title}
                    </h3>
                    <div className="flex w-full justify-between">
                      <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                        {post.category}
                      </span>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <SideBanner />
        </div>
      </div>
      <CompanyGridSection />
      <PostTopGridSection />
    </section>
  );
}
