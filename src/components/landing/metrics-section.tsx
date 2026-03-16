export function MetricsSection() {
  const metrics = [
    { value: "+25", label: "AÑOS DE EXPERIENCIA" },
    { value: "+5.000", label: "VIAJEROS POR AÑO" },
    { value: "100%", label: "FLOTA PROPIA" },
    { value: "+200", label: "ITINERARIOS DISEÑADOS" },
  ]

  return (
    <section className="bg-primary">
      <div className="mx-auto w-[calc(100%-1rem)] max-w-[1440px] py-8">
        <div className="grid grid-cols-2 gap-6 md:flex md:items-center md:justify-between md:gap-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="flex flex-col items-center text-center md:flex-1 md:flex-row md:justify-center md:gap-0"
            >
              <div className="flex flex-col items-center md:px-8">
                <span className="font-serif text-4xl italic text-white md:text-5xl lg:text-6xl">
                  {metric.value}
                </span>
                <span className="mt-2 text-xs tracking-widest text-white/80">
                  {metric.label}
                </span>
              </div>
              {index < metrics.length - 1 && (
                <div className="hidden h-12 w-px bg-white/30 md:block md:ml-auto" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
