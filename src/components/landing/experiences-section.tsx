import Image from "next/image";
import Link from "next/link";

const experiences = [
  {
    id: 1,
    name: "Cultura",
    image: "/landing/experiences/experience-1.jpg",
    href: "/experiencias/cultura",
  },
  {
    id: 2,
    name: "Paisaje",
    image: "/landing/experiences/experience-2.jpg",
    href: "/experiencias/paisaje",
  },
  {
    id: 3,
    name: "Altura",
    image: "/landing/experiences/experience-3.jpg",
    href: "/experiencias/altura",
  },
  {
    id: 4,
    name: "Vino",
    image: "/landing/experiences/experience-4.jpg",
    href: "/experiencias/vino",
  },
  {
    id: 5,
    name: "Aventura",
    image: "/landing/experiences/experience-5.jpg",
    href: "/experiencias/aventura",
  },
  {
    id: 6,
    name: "4x4",
    image: "/landing/experiences/experience-6.jpg",
    href: "/experiencias/4x4",
  },
];

export function ExperiencesSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
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
  );
}
