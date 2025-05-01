import Image from "next/image";
import Link from "next/link";
import { ColumnistsSection } from "../columnists/columnist-section";
import { mockPosts } from "@/utils/mock-data";



export default function PostGridWwithColumnistSection() {
  const sortedPosts = mockPosts.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);

    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateB.getTime() - dateA.getTime(); // ordem decrescente (mais recente primeiro)
  });

  const slicedPosts = sortedPosts.slice(7, 10); // índice 7, 8 e 9
  
  return (
    <section className="flex flex-col lg:flex-row gap-6 mx-auto max-w-[1272px] justify-between">
      <div className="flex flex-col lg:flex-row max-w-[840px] gap-2 rounded-2xl">
        {slicedPosts.map((post, idx) => (
          <Link key={idx} href="#">
            <div className="flex flex-col gap-3 rounded-xl p-2 transition">
              <div className="relative min-w-[300px]  h-[310px] md:w-[264px] md:min-w-[260px] md:h-[200px] rounded-md overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover "
                />
              </div>
              <div className="flex flex-col justify-between">
                <h3 className="text-2xl font-semibold leading-tight line-clamp-3">
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

      <ColumnistsSection/>
    </section>
  );
}
