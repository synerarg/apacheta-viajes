interface DestinationCardProps {
  name: string;
  description: string;
  dataSlot: string;
}

export function DestinationCard({ name, description, dataSlot }: DestinationCardProps) {
  return (
    <div className="group flex flex-col gap-0">
      {/* Image container */}
      <div className="relative w-full h-[280px] overflow-hidden bg-muted">
        {/* TODO: reemplazar src con imagen real */}
        <img
          data-slot={dataSlot}
          src=""
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-dark-brown/0 group-hover:bg-dark-brown/55 transition-colors duration-300 flex items-center justify-center">
          <span className="font-playfair text-[22px] text-off-white text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug">
            {name}
          </span>
        </div>
      </div>

      {/* Name + description */}
      <div className="pt-5">
        <h3 className="font-playfair text-[22px] text-dark-brown font-normal mb-2">
          {name}
        </h3>
        <p className="font-lato text-[14px] text-body-text leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
