import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { mockPosts } from "@/utils/mock-data";
import { ArrowRight } from "lucide-react";

export type NewsProps = {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  image: StaticImageData;
  orientation?: "horizontal" | "vertical";
};

export default function PostTopGridSection() {
  const sortedPosts = mockPosts.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime(); // ordem decrescente (mais recente primeiro)
  });

  return (
    <section className="flex flex-col gap-6 max-w-[1272px] mx-auto py-4 justify-between">
      <div className="w-[106px] h-2 bg-primary rounded-full " />

      {/* Header */}
      <div className="flex items-center justify-between ">
        <h2 className="text-2xl font-semibold text-primary">
          Top Portal Palhoça
        </h2>
      </div>

      <div className="grid grid-cols-3 justify-between gap-7">
        {sortedPosts.slice(0, 9).map((post, idx) => (
          <Link key={idx} href="#">
            <div className="flex flex-col  rounded-xl transition">
              <div className="relative w-[405px] h-[310px] rounded-md overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl mt-2 ml-1 font-semibold leading-tight line-clamp-3">
                  {post.title}
                </h3>
                <div className="flex w-full justify-between">
                  <div className="flex items-center mt-2 gap-4">
                    <span className="w-min text-xs bg-secondary text-primary px-3 py-1 rounded-2xl">
                      {post.category}
                    </span>
                    <p className="text-xs text-gray-500">{post.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
