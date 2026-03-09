interface HeroBannerProps {
  label?: string;
  title: string;
  subtitle: string;
  dataSlot: string;
}

export function HeroBanner({ label, title, subtitle, dataSlot }: HeroBannerProps) {
  return (
    <section className="relative w-full h-[600px] overflow-hidden flex items-center justify-center">
      {/* Background image — vacío, el cliente cargará la imagen */}
      {/* TODO: reemplazar src con imagen real */}
      <img
        data-slot={dataSlot}
        src=""
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-dark-brown/60" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-8">
        {label && (
          <p className="font-lato text-[13px] text-off-white uppercase tracking-[1.6px] font-light mb-6">
            {label}
          </p>
        )}
        <h1 className="font-playfair text-[56px] md:text-[80px] lg:text-[96px] text-off-white font-normal leading-tight mb-8">
          {title}
        </h1>
        <p className="font-lato text-[18px] md:text-[20px] text-off-white font-normal max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
