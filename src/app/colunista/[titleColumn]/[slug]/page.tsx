import ProfileColumnist from "@/components/columnists/profile-section";
import DefaultPage from "@/components/default-page";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

export default function ColumnistPage() {
  return (
    <DefaultPage>
      <Header />
      <main>
        <ProfileColumnist />
      </main>
      <footer>
        <Footer />
      </footer>
    </DefaultPage>
  );
}
