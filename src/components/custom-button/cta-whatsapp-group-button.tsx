"use client";

import wppIcon from "@/assets/WhatsappIcon.png";
import { PortalContext } from "@/provider/portal";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function ButtonCTAWhatsAppButton() {
  const [whatsapp_groups, setWhatsAppGroups] = useState<string>("");
  const { SelfPortalByReferer, portal } = useContext(PortalContext);

  useEffect(() => {
    const host = window.location.host;
    const referer = host.replace(":3000", "");
    SelfPortalByReferer(referer);
  }, []);

  useEffect(() => {
    const findWhatsAppGroupActive = portal?.whatsapp_groups.find(
      (group) => group.is_active === true
    );
    if (findWhatsAppGroupActive) {
      let link = findWhatsAppGroupActive.link;
      if (!link.startsWith("http")) {
        link = "https://" + link;
      }
      setWhatsAppGroups(link);
    }
  }, [portal]);

  return (
    <Link
      href={whatsapp_groups}
      className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-3xl hover:bg-green-200 max-w-[330px]"
    >
      <Image src={wppIcon} alt="Icone do whatsapp" className="h-5 w-5" unoptimized/>
      Entrar em nosso grupo de WhatsApp
    </Link>
  );
}
