import Image from "next/image"

export function WhyChooseSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px]">
        <h2 className="font-serif text-3xl md:text-4xl italic text-foreground mb-12">
          Por qué elegir Apacheta
        </h2>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="flex gap-5">
              <div className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center">
                <Image src="/para-agencias/why-choose-icon.png" alt="" width={104} height={71} className="object-contain" />
              </div>
              <div>
                <h3 className="text-primary font-medium mb-2">Curaduría Exquisita</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Solo trabajamos con proveedores que cumplen nuestros estándares de autenticidad
                  y confort. No vendemos &quot;tourists traps&quot;.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center">
                <Image src="/para-agencias/why-choose-icon.png" alt="" width={104} height={71} className="object-contain" />
              </div>
              <div>
                <h3 className="text-primary font-medium mb-2">Respeto por el Canal</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nuestra estructura comercial está diseñada para proteger a la agencia. Tarifas
                  netas competitivas y respeto absoluto por su cliente.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center">
                <Image src="/para-agencias/why-choose-icon.png" alt="" width={104} height={71} className="object-contain" />
              </div>
              <div>
                <h3 className="text-primary font-medium mb-2">Conocimiento de Terreno</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nacimos acá. Conocemos los caminos alternativos cuando llueve, el mejor horario
                  para la luz en Salinas, y al dueño de la bodega.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-background rounded-xl shadow-md p-8">
              <blockquote className="font-serif text-xl md:text-2xl italic text-foreground leading-relaxed mb-6">
                &ldquo;Encontrar un partner en el NOA que entienda el nivel de exigencia de nuestros clientes
                europeos fue un desafío, hasta que dimos con Apacheta. Su ejecución es impecable.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div>
                  <p className="font-medium text-foreground">Elon Musk</p>
                  <p className="text-sm text-primary font-bold">CEO de X</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
