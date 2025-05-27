import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CardCompany } from "./card-company";
import { mockCompanys } from "@/utils/mock-data";

export function CompanyGridSection() {
  return (
    <section className="w-full py-12 max-w-[1272px] mx-auto px-4">
      <div className="w-[106px] h-2 bg-red-500 rounded-full mb-6" />

      <div className="flex flex-col md:flex-row items-start gap-3 md:items-center justify-between mb-4 md:mb-8">
        <h2 className="text-2xl font-semibold text-red-500">
          Comércios que são destaques em Palhoça!
        </h2>
        <Link
          href="/comercios"
          className="flex items-center font-semibold gap-2 text-zinc-900 hover:text-red-500 transition-colors"
        >
          Veja mais
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockCompanys.slice(0, 4).map((company) => (
          <div key={company.name} className="w-full">
            <CardCompany company={company} />
          </div>
        ))}
      </div>
    </section>
  );
}
