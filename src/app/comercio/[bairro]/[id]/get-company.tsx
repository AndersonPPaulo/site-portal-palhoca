import { IPublicCompany } from "@/provider/company";
import { api } from "@/service/api";

export async function getCompanyByIdServer(
  id: string
): Promise<IPublicCompany | null> {
  try {
    const response = await api.get(`/company/${id}`);
    const company: IPublicCompany = response.data.response;

    if (company.status !== "active") return null;

    return company;
  } catch (err) {
    console.error("Erro ao buscar empresa (server):", err);
    return null;
  }
}
