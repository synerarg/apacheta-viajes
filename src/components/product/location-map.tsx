interface UbicacionMapProps {
  nombre: string
  latitud: number
  longitud: number
}

export function UbicacionMap({ nombre, latitud, longitud }: UbicacionMapProps) {
  const embedSrc = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${longitud}!3d${latitud}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1234567890`

  return (
    <div className="rounded-[2px] overflow-hidden border border-dark-brown/15">
      <iframe
        src={embedSrc}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ubicación — ${nombre}`}
        className="grayscale"
      />
    </div>
  )
}
