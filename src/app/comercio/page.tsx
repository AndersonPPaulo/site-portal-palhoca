// app/comercio/page.tsx
import { Suspense } from "react";
import ClientListArticlesByCategory from "./client-side";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ClientListArticlesByCategory />
    </Suspense>
  );
}
