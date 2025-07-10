import { api } from "@/service/api";

export async function getArticleBySlug(slug: string) {
  const response = await api.get(`/article/${slug}/slug`);
  return response.data.response;
}
