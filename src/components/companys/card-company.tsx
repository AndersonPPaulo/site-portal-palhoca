import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Phone } from "lucide-react"

interface CardCompanyProps {
  name: string
  address: string
  category: string
  image: StaticImageData
}

interface Props {
    company: CardCompanyProps
}

export function CardCompany({ company }: Props) {
  return (
    <div className="overflow-hidden w-[360px] md:w-[300px] rounded-3xl shadow-lg">
      <div className="relative h-[156px]">
        <Image
          src={company.image}
          alt={company.name}
          fill
          className="object-cover"
          priority
        />
        <span className="absolute top-4 left-4 bg-pink-100 text-pink-500 px-3 py-1 rounded-full text-sm font-medium">
          {company.category}
        </span>
      </div>
      
      <div className="p-6">
        <span className="bg-red-100 text-red px-3 py-1 rounded-full -ms-1">{company.category}</span>
        <h3 className="text-xl font-semibold mb-2 mt-4">{company.name}</h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin size={16} className="text-red" />
          <span className="text-sm">{company.address}</span>
        </div>
        <Button className="w-full rounded-full" variant="outline">
          <Phone fill="#000"/> Conferir número
        </Button>
      </div>
    </div>
  )
}
