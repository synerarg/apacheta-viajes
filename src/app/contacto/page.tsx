import { ContactoView } from "@/components/contacto/contacto-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto | Apacheta Viajes",
  description: "Hablemos. Contanos sobre tus planes de viaje y diseñaremos una experiencia a medida.",
}

export default function ContactoPage() {
  return <ContactoView />
}
