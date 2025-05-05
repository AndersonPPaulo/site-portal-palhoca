import Image from "next/image";
import Link from "next/link";
import { mockPosts } from "@/utils/mock-data";

export default function HeroSection() {
  const mainPost = mockPosts[0];
  const sidePosts = mockPosts.slice(1, 4);

  return (
    <section className="flex flex-col lg:flex-row w-full max-w-[360px] gap-6 py-4 lg:max-w-[1272px] mx-auto border-t border-[#e6e6e6]">
      {/* Main Post */}
      <div className="flex flex-col lg:flex-row gap-6 rounded-xl ">
        <div className="relative md:min-w-[490px] max-w-[490px] min-h-[406px] max-h-[406px] rounded-xl overflow-hidden">
          <Image
            src={mainPost.image}
            alt={mainPost.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">
              {mainPost.title}
            </h1>
            <span className="text-sm bg-secondary text-primary my-4 px-2 py-1 rounded-full inline-block mb-2">
              {mainPost.category}
            </span>
            <p className="text-md text-gray-600 line-clamp-11">
              {mainPost.description}
              {mainPost.description}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-4">{mainPost.date}</p>
        </div>
      </div>

      {/* Side Posts */}
      <div className="flex flex-col gap-4 shadow-md p-4 rounded-2xl min-w-[300px] md:min-w-[415px] max-w-[415px]">
        {sidePosts.map((post, idx) => (
          <Link key={idx} href="#">
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
    </section>
  );
}
