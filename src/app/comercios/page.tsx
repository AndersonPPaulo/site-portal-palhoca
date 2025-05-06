import { CardCompany } from "@/components/companys/card-company";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";
import { mockCompanys } from "@/utils/mock-data";

export default function Comercio() {
  return (
    <DefaultPage>
      <Header />
      <div className="max-w-[1272px] mx-auto px-7 py-2">
        <h1 className="text-[24px] font-[600] text-red-600 mb-4">
          Comércios de Palhoça
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mockCompanys.map((company, index) => (
            <div className="w-full" key={index}>
              <CardCompany company={company} />
            </div>
          ))}
        </div>
      </div>
    </DefaultPage>
  );
}
