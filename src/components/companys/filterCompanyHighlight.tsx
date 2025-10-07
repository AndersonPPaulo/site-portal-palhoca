"use client";

import { useEffect } from "react";
import { usePublicCompany } from "@/provider/company";
import CardCompany from "./card-company";

// ==================== COMPONENTE PRINCIPAL ====================
export default function FilteredCommerceListHighlight() {
  const { highlightedCompanies, loading, listHighlightedCompanies } =
  usePublicCompany();

  useEffect(() => {
    listHighlightedCompanies(1, 6);
  }, []);

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {highlightedCompanies?.data &&
        highlightedCompanies.data.length > 0 &&
        !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlightedCompanies.data.map((company) => (
              <div className="w-full" key={company.id}>
                <CardCompany company={company} />
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
