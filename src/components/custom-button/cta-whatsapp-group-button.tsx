import wppIcon from "@/assets/WhatsappIcon.png";
import Image from "next/image";
import Link from "next/link";

export default function ButtonCTAWhatsAppButton() {
  return (
    <Link
      href="#"
      className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-3xl hover:bg-green-200 max-w-[330px]"
    >
      <Image src={wppIcon} alt="Icone do whatsapp" className="h-5 w-5" />
      Entrar em nosso grupo de WhatsApp
    </Link>
  );
}
