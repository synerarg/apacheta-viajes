import Image from "next/image"
import Link from "next/link"

const experiences = [
  {
    id: 1,
    name: "Cultura",
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/cultura",
  },
  {
    id: 2,
    name: "Paisaje",
    image: "https://images.unsplash.com/photo-1547234935-80c7145ec969?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/paisaje",
  },
  {
    id: 3,
    name: "Altura",
    image: "https://images.unsplash.com/photo-1609429019995-8c40f49535a5?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/altura",
  },
  {
    id: 4,
    name: "Vino",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/vino",
  },
  {
    id: 5,
    name: "Aventura",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/aventura",
  },
  {
    id: 6,
    name: "4x4",
    image: "https://images.unsplash.com/photo-1533591917513-f0c9b575e190?q=80&w=800&auto=format&fit=crop",
    href: "/experiencias/4x4",
  },
]

export function ExperiencesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Elegi Tu Experiencia
          </p>
          <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-foreground">
            El Norte Argentino tiene algo para cada viajero
          </h2>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={experience.href}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={experience.image}
                alt={experience.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Label */}
              <div className="absolute bottom-4 left-4">
                <span className="inline-block bg-neutral-700/90 text-white text-xs font-medium tracking-wide uppercase px-3 py-1.5">
                  {experience.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
