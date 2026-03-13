export interface ExperienciaMock {
  id: number
  nombre: string
  slug: string
  descripcion: string
  descripcion_corta: string
  duracion_horas: number
  precio: number
  moneda: string
  imagen_url: string
  ubicacion: string
  latitud: number
  longitud: number
  categoria: string
  destacado: boolean
  activo: boolean
  orden: number
  fecha_salida?: string
  longitud_km?: number
  altura_msnm?: number
  galeria?: string[]
}

export const experienciasMock: ExperienciaMock[] = [
  {
    id: 1,
    nombre: "Caminata con Llamas",
    slug: "caminata-con-llamas",
    descripcion:
      "Una experiencia única que combina la cultura andina con el paisaje natural del NOA. Junto a nuestras llamas domesticadas, recorremos senderos ancestrales que los pueblos originarios usaron por siglos. El guía local comparte leyendas, usos medicinales de plantas y la cosmovisión andina mientras acompañamos a estos majestuosos animales por la montaña. Apta para toda la familia, sin requerimientos físicos especiales. La caminata finaliza con una merienda típica en el refugio con vistas panorámicas.",
    descripcion_corta:
      "Recorre senderos ancestrales junto a llamas domesticadas con guía local y merienda típica.",
    duracion_horas: 4,
    precio: 85000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Cachi, Salta",
    latitud: -25.1199,
    longitud: -66.1534,
    categoria: "Cultura",
    destacado: true,
    activo: true,
    orden: 1,
    fecha_salida: "Todos los sábados",
    longitud_km: 8,
    altura_msnm: 2280,
    galeria: [],
  },
  {
    id: 2,
    nombre: "Trekking Cerro San Bernardo",
    slug: "trekking-cerro-san-bernardo",
    descripcion:
      "Ascenso al emblemático Cerro San Bernardo, el pulmón verde de la ciudad de Salta. La ruta a pie de 7 km ofrece vistas panorámicas de la ciudad y el Valle de Lerma. Atravesamos flora nativa, miradores y una catarata escondida. El sendero está perfectamente señalizado y tiene dificultad moderada. Incluye guía especializado y snack energético.",
    descripcion_corta:
      "Ascenso al Cerro San Bernardo con vistas panorámicas de Salta y el Valle de Lerma.",
    duracion_horas: 3,
    precio: 65000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Salta Capital",
    latitud: -24.7859,
    longitud: -65.4117,
    categoria: "Paisaje",
    destacado: true,
    activo: true,
    orden: 2,
    fecha_salida: "Martes y jueves",
    longitud_km: 7,
    altura_msnm: 1460,
    galeria: [],
  },
  {
    id: 3,
    nombre: "Safari Fotográfico en los Cardones",
    slug: "safari-fotografico-cardones",
    descripcion:
      "El Parque Nacional Los Cardones es el set fotográfico más impresionante del NOA. Guiados por un fotógrafo profesional, aprendemos técnicas de fotografía de paisaje y naturaleza mientras capturamos los cardones gigantes al amanecer. La luz mágica de la mañana sobre estos cactus centenarios es un espectáculo visual único.",
    descripcion_corta:
      "Fotografía de paisaje profesional en el Parque Nacional Los Cardones al amanecer.",
    duracion_horas: 5,
    precio: 95000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Parque Nacional Los Cardones, Salta",
    latitud: -25.0823,
    longitud: -65.8946,
    categoria: "Paisaje",
    destacado: false,
    activo: true,
    orden: 3,
    fecha_salida: "Bajo pedido",
    longitud_km: 4,
    altura_msnm: 2700,
    galeria: [],
  },
  {
    id: 4,
    nombre: "Degustación de Vinos de Altura",
    slug: "degustacion-vinos-altura",
    descripcion:
      "Cafayate produce algunos de los mejores vinos del mundo gracias a su altura única de 1.700 msnm. Visitamos tres bodegas boutique con producción limitada y degustamos más de 12 varietales incluyendo el Torrontés autóctono. El sommelier explica la influencia de la altura y el terroir andino en cada copa.",
    descripcion_corta:
      "Visita a bodegas boutique y degustación de Torrontés y Malbec de altura en Cafayate.",
    duracion_horas: 6,
    precio: 120000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Cafayate, Salta",
    latitud: -26.0724,
    longitud: -65.9729,
    categoria: "Vino",
    destacado: true,
    activo: true,
    orden: 4,
    fecha_salida: "Viernes y sábados",
    galeria: [],
  },
  {
    id: 5,
    nombre: "4x4 por la Puna",
    slug: "4x4-puna",
    descripcion:
      "La puna argentina solo puede conquistarse en 4x4. Con nuestros vehículos equipados y guías expertos, exploramos rutas de tierra que no aparecen en los mapas convencionales. Lagunas altoandinas, salares abandonados, volcanes dormidos y fauna silvestre incluyendo vicuñas y cóndores andinos.",
    descripcion_corta:
      "Expedición en 4x4 por la puna profunda con lagunas, salares y fauna silvestre.",
    duracion_horas: 10,
    precio: 180000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Puna Salteña",
    latitud: -23.6543,
    longitud: -66.8012,
    categoria: "4x4",
    destacado: true,
    activo: true,
    orden: 5,
    fecha_salida: "Bajo pedido (mínimo 4 personas)",
    longitud_km: 180,
    altura_msnm: 4500,
    galeria: [],
  },
  {
    id: 6,
    nombre: "Ceremonia de Pachamama",
    slug: "ceremonia-pachamama",
    descripcion:
      "Cada primer día de agosto, los pueblos andinos realizan la ofrenda a la Pachamama, la Madre Tierra. Pero esta ceremonia vive en el NOA todo el año. Junto a una comunidad indígena local, participamos de una ceremonia auténtica: enterramos la ofrenda con chicha, hojas de coca y alimentos, agradeciendo los dones de la tierra.",
    descripcion_corta:
      "Participación en ceremonia ancestral de la Pachamama con comunidad indígena local.",
    duracion_horas: 3,
    precio: 70000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Comunidad andina, Jujuy",
    latitud: -22.8994,
    longitud: -65.6014,
    categoria: "Cultura",
    destacado: false,
    activo: true,
    orden: 6,
    fecha_salida: "Primer sábado del mes",
    galeria: [],
  },
  {
    id: 7,
    nombre: "Ascenso Cerro Gordo",
    slug: "ascenso-cerro-gordo",
    descripcion:
      "Para los amantes del trekking de alta montaña, el Cerro Gordo ofrece un desafío a 4.700 msnm. La vista desde la cumbre abarca la puna argentina y boliviana en un panorama de 360 grados imposible de olvidar. Requiere buena condición física y aclimatación previa.",
    descripcion_corta:
      "Trekking de alta montaña hasta 4.700 msnm con vistas panorámicas de 360 grados.",
    duracion_horas: 12,
    precio: 150000,
    moneda: "ARS",
    imagen_url: "",
    ubicacion: "Puna de Atacama, Salta",
    latitud: -24.4892,
    longitud: -66.9234,
    categoria: "Altura",
    destacado: false,
    activo: true,
    orden: 7,
    fecha_salida: "Bajo pedido",
    longitud_km: 14,
    altura_msnm: 4700,
    galeria: [],
  },
]

export const categoriasExperiencias = [
  "Todos",
  "Cultura",
  "Paisaje",
  "Altura",
  "Vino",
  "4x4",
]

export function formatPrecio(precio: number, moneda: string): string {
  if (moneda === "ARS") {
    return `ARS $${precio.toLocaleString("es-AR")}`
  }
  return `${moneda} $${precio.toLocaleString("es-AR")}`
}
