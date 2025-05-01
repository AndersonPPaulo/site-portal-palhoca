import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { mockPosts } from "@/utils/mock-data";

export type NewsProps = {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  image: StaticImageData;
  orientation?: "horizontal" | "vertical";
};

export default function PostGridSection() {
  const sortedPosts = mockPosts.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime(); // ordem decrescente (mais recente primeiro)
  });

  const slicedPosts = sortedPosts.slice(4, 7); // índice 4, 5 e 6

  return (
    <section className="flex gap-6 max-w-[1272px] mx-auto py-4 justify-between">
      <div className="flex flex-col lg:flex-row justify-between gap-7">
        {slicedPosts.map((post, idx) => (
          <Link key={idx} href="#">
            <div className="flex flex-col  rounded-xl transition">
              <div className="relative min-w-[300px] md:w-[405px] h-[310px] rounded-md overflow-hidden">
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
