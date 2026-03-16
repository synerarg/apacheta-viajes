import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"

const footerColumns = [
  {
    title: "EXPLORAR",
    links: [
      { label: "Paquetes NOA", href: "/paquetes" },
      { label: "Experiencias", href: "/experiencias" },
      { label: "Hotelería", href: "/hoteleria" },
      { label: "Emisivo", href: "/emisivo" },
    ],
  },
  {
    title: "EMPRESA",
    links: [
      { label: "Sobre Nosotros", href: "/nosotros" },
      { label: "Para Agencias", href: "/para-agencias" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="w-full bg-dark-brown">
      <div className="w-[calc(100%-1rem)] max-w-[1440px] mx-auto pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-off-white/20">
          <div className="md:col-span-1">
            <p className="font-playfair text-xl text-off-white font-normal tracking-widest mb-5">
              APACHETA VIAJES
            </p>
            <p className="font-lato text-[15px] text-off-white/70 font-light leading-relaxed">
              Operador turístico boutique especializado en el Norte Argentino.
              Logística experta y experiencias auténticas desde 1997.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="font-lato text-[13px] text-off-white uppercase tracking-[1.6px] font-medium mb-6">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-lato text-[15px] text-off-white/70 hover:text-off-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-lato text-[13px] text-off-white uppercase tracking-[1.6px] font-medium mb-6">
              CONTACTO
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-off-white/60 mt-0.5 shrink-0"
                />
                <span className="font-lato text-[15px] text-off-white/70">
                  Caseros 450, Salta Capital
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-off-white/60 shrink-0" />
                <a
                  href="mailto:hola@apacheta.travel"
                  className="font-lato text-[15px] text-off-white/70 hover:text-off-white transition-colors"
                >
                  hola@apacheta.travel
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-off-white/60 shrink-0" />
                <a
                  href="tel:+5493875550192"
                  className="font-lato text-[15px] text-off-white/70 hover:text-off-white transition-colors"
                >
                  +54 9 387 555-0192
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-3">
          <p className="font-lato text-[13px] text-off-white/40">
            © 2026 Apacheta Viajes. Todos los derechos reservados.
          </p>
          <p className="font-lato text-[13px] text-off-white/40">
            Desarrollado por <Link href="https://synera.com.ar" target="_blank" className="text-accent">Synera</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
