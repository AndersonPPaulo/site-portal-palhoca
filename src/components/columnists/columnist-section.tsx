import { mockColumnists } from "@/utils/mock-data";
import { generateSlug } from "@/utils/string-utils";
import Image from "next/image";
import Link from "next/link";

export const ColumnistsSection = () => {
  return (
    <div className="p-4 rounded-xl shadow-sm">
      <h2 className="text-green-700 text-xl font-semibold mb-3">Colunistas</h2>
      <ul className="flex flex-col gap-4">
        {mockColumnists.map((col, index) => (
          <li
            key={col.id}
            className={`flex gap-4 items-center ${
              index !== mockColumnists.length - 1
                ? "border-b border-[#e6e6e6] pb-3"
                : ""
            }`}
          >
              <div className="min-w-[60px] min-h-[60px] relative">
                <Image
                  src={col.image}
                  alt={col.name}
                  layout="fill"
                  className="rounded-full"
                />
              </div>
            <Link href={`/colunista/${col.id}/${generateSlug(col.topic)}`} className="cursor-pointer">

              <div>
                <p className="text-sm font-thin italic text-[#757575]">
                  {col.name}
                </p>
                <p className="text-lg font-bold">{col.topic}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
