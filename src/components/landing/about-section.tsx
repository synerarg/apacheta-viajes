import Image from "next/image"

export function AboutSection() {
  return (
    <section id="nosotros" className="bg-background py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Nuestra Historia
            </span>

            <h2 className="font-serif italic text-3xl md:text-4xl lg:text-[42px] text-foreground leading-tight">
              Desde 1997 en el corazón del Norte Argentino
            </h2>

            <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Apacheta Viajes nació en Salta Capital en 1997, con una vocación
                clara desde el primer día: desarrollar turismo receptivo y
                emisivo, conectando personas, destinos y experiencias con un
                mismo estándar de calidad y compromiso.
              </p>
              <p>
                Desde nuestros inicios trabajamos en el turismo receptivo del
                Norte Argentino, combinando conocimiento local, flota propia y
                un equipo humano altamente capacitado, al mismo tiempo que
                acompañamos a pasajeros particulares y empresas en sus viajes
                nacionales e internacionales, a través del turismo emisivo y la
                venta de pasajes.
              </p>
              <p>
                Creemos que viajar no es solo trasladarse, sino vivir
                experiencias que perduren en el tiempo y queden en la memoria de
                nuestros clientes. Por eso diseñamos servicios a medida y
                programas cuidadosamente planificados, respaldados por acuerdos
                estratégicos con proveedores, que nos permiten brindar
                soluciones confiables y competitivas.
              </p>
              <p>
                Nuestro propósito es afianzarnos como uno de los mejores
                operadores receptivos del Norte Argentino, manteniendo siempre
                el mismo espíritu que nos vio nacer: calidad, cercanía y pasión
                por crear viajes inolvidables.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[480px]">
            <Image
              src="/landing/about.png"
              alt="Vista panorámica de Salta con montañas y la iglesia San Bernardo"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
