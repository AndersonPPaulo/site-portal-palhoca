import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CardCompany } from "./card-company"
import { mockCompanys } from "@/utils/mock-data"

export function CompanyGridSection() {
  return (
    <section className="w-full py-12 max-w-[1272px] mx-auto">

      <div className="w-[106px] h-2 bg-red rounded-full mb-6"/>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Grid */}
        <div className="flex justify-between">
          {mockCompanys.slice(0, 4).map((company) => (
            <CardCompany
              key={company.name}
              company={company}
            />
          ))}
        </div>
    </section>
  )
}
