import TopBanner from "@/components/banner/top";
import DefaultPage from "@/components/default-page";
import Header from "@/components/header";

export default function Home() {
  return (
    <DefaultPage>
      <Header />
      <TopBanner/>
    </DefaultPage>
  );
}
