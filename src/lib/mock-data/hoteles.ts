export interface HotelMock {
  id: number
  nombre: string
  slug: string
  ubicacion: string
  descripcion: string
  descripcion_corta: string
  estrellas: number
  precio_desde: number
  moneda: string
  imagen_url: string
  categoria: string
  activo: boolean
  orden: number
}

export const hotelesMock: HotelMock[] = [
  {
    id: 1,
    nombre: "Hotel de Montana Cachi",
    slug: "hotel-de-montana-cachi",
    ubicacion: "Cachi, Salta",
    descripcion:
      "Enclavado en el corazón del Valle Calchaquí, este hotel boutique ofrece una experiencia de descanso auténtica rodeada de montañas y viñedos. Sus habitaciones combinan el adobe tradicional con comodidades contemporáneas.",
    descripcion_corta:
      "Boutique en adobe con vistas al Valle Calchaquí y viñedos de altura.",
    estrellas: 5,
    precio_desde: 180000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Boutique",
    activo: true,
    orden: 1,
  },
  {
    id: 2,
    nombre: "Posada del Sol Cafayate",
    slug: "posada-del-sol-cafayate",
    ubicacion: "Cafayate, Salta",
    descripcion:
      "A pasos de las bodegas más reconocidas de Cafayate, esta posada colonial ofrece habitaciones con patios internos, desayuno con productos locales y servicio personalizado.",
    descripcion_corta:
      "Colonial a pasos de las bodegas, desayuno con productos locales.",
    estrellas: 4,
    precio_desde: 120000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Colonial",
    activo: true,
    orden: 2,
  },
  {
    id: 3,
    nombre: "Pucará Lodge",
    slug: "pucara-lodge",
    ubicacion: "Tilcara, Jujuy",
    descripcion:
      "Lodge contemporáneo con vista directa al Pucará de Tilcara. Arquitectura de tierra cruda y madera local, pileta climatizada y spa andino con tratamientos con barro y plantas medicinales.",
    descripcion_corta:
      "Lodge contemporáneo frente al Pucará, spa andino y pileta climatizada.",
    estrellas: 5,
    precio_desde: 210000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Lodge",
    activo: true,
    orden: 3,
  },
  {
    id: 4,
    nombre: "Casa de los Vientos",
    slug: "casa-de-los-vientos",
    ubicacion: "Purmamarca, Jujuy",
    descripcion:
      "Casa de huéspedes familiar al pie del Cerro de los Siete Colores. Ambiente íntimo con sólo 6 habitaciones, jardín propio y desayuno artesanal con quesos y dulces regionales.",
    descripcion_corta:
      "Casa íntima con 6 habitaciones al pie del Cerro de los Siete Colores.",
    estrellas: 3,
    precio_desde: 75000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Casa de Huéspedes",
    activo: true,
    orden: 4,
  },
  {
    id: 5,
    nombre: "Alto Andino Hotel",
    slug: "alto-andino-hotel",
    ubicacion: "Humahuaca, Jujuy",
    descripcion:
      "Hotel de tres pisos con terraza panorámica sobre la Quebrada. Ideal como base para explorar los pueblos del norte de la Quebrada. Restaurante con cocina andina contemporánea.",
    descripcion_corta:
      "Terraza panorámica sobre la Quebrada, restaurante de cocina andina.",
    estrellas: 4,
    precio_desde: 95000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Hotel",
    activo: true,
    orden: 5,
  },
  {
    id: 6,
    nombre: "Finca Los Cardones",
    slug: "finca-los-cardones",
    ubicacion: "Molinos, Salta",
    descripcion:
      "Finca restaurada del siglo XVIII reconvertida en alojamiento de campo. Viñedos propios, caballos criollos disponibles para cabalgatas y una atmósfera de total desconexión digital.",
    descripcion_corta:
      "Finca del siglo XVIII con viñedos, caballos y total desconexión digital.",
    estrellas: 4,
    precio_desde: 145000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Finca",
    activo: true,
    orden: 6,
  },
  {
    id: 7,
    nombre: "Gran Hotel Salta",
    slug: "gran-hotel-salta",
    ubicacion: "Salta Capital",
    descripcion:
      "El clásico de la ciudad. Ubicado frente a la Plaza 9 de Julio, combina arquitectura colonial con servicios de gran hotel: business center, pool rooftop y concierge especializado en excursiones.",
    descripcion_corta:
      "Clásico frente a la Plaza 9 de Julio con pool rooftop y concierge.",
    estrellas: 5,
    precio_desde: 230000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Hotel",
    activo: true,
    orden: 7,
  },
  {
    id: 8,
    nombre: "Refugio de Altura",
    slug: "refugio-de-altura",
    ubicacion: "Iruya, Salta",
    descripcion:
      "El alojamiento más remoto de nuestra selección. A 2.780 msnm en el pueblo de Iruya, accesible solo por un camino de ripio de 50 km. La experiencia de aislamiento más auténtica del NOA.",
    descripcion_corta:
      "El más remoto del NOA, a 2.780 msnm en Iruya. Acceso por ripio.",
    estrellas: 3,
    precio_desde: 65000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Refugio",
    activo: true,
    orden: 8,
  },
  {
    id: 9,
    nombre: "Viñas del Torrontés",
    slug: "vinas-del-torrontes",
    ubicacion: "Cafayate, Salta",
    descripcion:
      "Hotel boutique integrado a una bodega de producción. Cada habitación tiene nombre de varietal, desayuno incluye degustación y se puede participar en la vendimia según temporada.",
    descripcion_corta:
      "Boutique integrado a bodega, desayuno con degustación y vendimia.",
    estrellas: 4,
    precio_desde: 155000,
    moneda: "ARS",
    imagen_url: "",
    categoria: "Boutique",
    activo: true,
    orden: 9,
  },
]

export const categoriasHoteles = [
  "Todos",
  "Boutique",
  "Lodge",
  "Hotel",
  "Colonial",
  "Finca",
  "Refugio",
  "Casa de Huéspedes",
]
