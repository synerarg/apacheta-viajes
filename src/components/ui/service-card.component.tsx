import { Check, type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

export function ServiceCard({ icon: Icon, title, description, bullets }: ServiceCardProps) {
  return (
    <div className="border border-muted bg-white p-8 flex flex-col gap-6 hover:shadow-md transition-shadow">
      {/* Icon container */}
      <div className="w-16 h-16 bg-dark-brown flex items-center justify-center shrink-0">
        <Icon size={32} className="text-off-white" />
      </div>

      {/* Title */}
      <h3 className="font-playfair text-[32px] text-dark-brown font-normal leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="font-lato text-[17px] text-body-text leading-relaxed">
        {description}
      </p>

      {/* Bullet points */}
      <ul className="flex flex-col gap-3 mt-auto">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check size={18} className="text-primary shrink-0 mt-0.5" />
            <span className="font-lato text-[15px] text-primary leading-snug">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
