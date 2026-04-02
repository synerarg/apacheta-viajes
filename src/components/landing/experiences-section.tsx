import Image from "next/image"
import Link from "next/link"

const EXPERIENCES = [
  {
    label: "Cultura",
    image: "/landing/experiences/experience-1.jpg",
    href: "/experiencias?categoria=Cultura",
  },
  {
    label: "Paisaje",
    image: "/landing/experiences/experience-2.jpg",
    href: "/experiencias?categoria=Paisaje",
  },
  {
    label: "Altura",
    image: "/landing/experiences/experience-3.jpg",
    href: "/experiencias?categoria=Altura",
  },
  {
    label: "Vino",
    image: "/landing/experiences/experience-4.jpg",
    href: "/experiencias?categoria=Vino",
  },
  {
    label: "Aventura",
    image: "/landing/experiences/experience-5.jpg",
    href: "/experiencias?categoria=Aventura",
  },
  {
    label: "4x4",
    image: "/landing/experiences/experience-6.jpg",
    href: "/experiencias?categoria=4x4",
  },
]

export function ExperiencesSection() {
  return (
    <section id="experiencias" className="bg-white">
      {/* Header */}
      <div className="px-4 pb-8 pt-12 text-center md:pb-10 md:pt-16">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
          Elegi Tu Experiencia
        </p>
        <h2 className="font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
          El Norte Argentino tiene algo para cada viajero
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-px bg-neutral-200 md:grid-cols-3">
        {EXPERIENCES.map((exp) => (
          <Link
            key={exp.label}
            href={exp.href}
            className="group relative aspect-square overflow-hidden bg-neutral-300"
          >
            <Image
              src={exp.image}
              alt={exp.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/25" />

            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
              <span className="inline-block bg-[#8b1a1a] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white">
                {exp.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
