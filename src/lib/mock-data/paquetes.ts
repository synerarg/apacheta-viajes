export interface PaqueteMock {
  id: number
  nombre: string
  slug: string
  descripcion: string
  descripcion_corta: string
  duracion_dias: number
  precio_desde: number
  moneda: string
  imagen_url: string
  incluye_alojamiento: boolean
  incluye_traslado: boolean
  incluye_comidas: boolean
  incluye_guia: boolean
  incluye_entradas: boolean
  destacado: boolean
  activo: boolean
  orden: number
  categoria: string
  fecha_salida?: string
  itinerario: ItinerarioDia[]
}

export interface ItinerarioDia {
  dia: number
  titulo: string
  descripcion: string
}

export const paquetesMock: PaqueteMock[] = [
  {
    id: 1,
    nombre: "Vuelta a los Valles Calchaquíes",
    slug: "vuelta-valles-calchaquies",
    descripcion:
      "Un recorrido épico por los valles más impresionantes del norte argentino. Desde las salinas brillantes hasta los viñedos de altura, cada kilómetro revela un paisaje único que quedará grabado en tu memoria. Atravesamos la Quebrada de las Flechas, el pueblo de Cachi y los viñedos de Cafayate en un circuito de 5 días diseñado para el viajero que busca autenticidad.",
    descripcion_corta:
      "Recorrido completo por los valles más icónicos del NOA con alojamiento boutique y guía especializado.",
    duracion_dias: 5,
    precio_desde: 450000,
    moneda: "ARS",
    imagen_url: "",
    incluye_alojamiento: true,
    incluye_traslado: true,
    incluye_comidas: true,
    incluye_guia: true,
    incluye_entradas: true,
    destacado: true,
    activo: true,
    orden: 1,
    categoria: "Circuito",
    fecha_salida: "15 Abr — 20 Abr",
    itinerario: [
      {
        dia: 1,
        titulo: "Salta — Cachi",
        descripcion:
          "Partimos temprano desde Salta hacia Cachi por la mítica Ruta 33. Cruzamos la Cuesta del Obispo, paramos en el Parque Nacional Los Cardones y llegamos al pueblo colonial de Cachi al atardecer.",
      },
      {
        dia: 2,
        titulo: "Cachi — Molinos — Angastaco",
        descripcion:
          "Recorremos el Valle Calchaquí norte visitando la Iglesia de Molinos y las ruinas de Angastaco. Tarde libre para recorrer los viñedos locales.",
      },
      {
        dia: 3,
        titulo: "Angastaco — Quebrada de las Flechas — Cafayate",
        descripcion:
          "Atravesamos la espectacular Quebrada de las Flechas, una formación geológica única. Llegada a Cafayate para degustar los mejores Torrontés de la región.",
      },
      {
        dia: 4,
        titulo: "Cafayate — Quebrada de las Conchas — Salta",
        descripcion:
          "Retorno por la Quebrada de Cafayate con sus formaciones rocosas: El Anfiteatro, La Garganta del Diablo y los Castillos. Arribo a Salta al atardecer.",
      },
      {
        dia: 5,
        titulo: "Salta Ciudad",
        descripcion:
          "Día libre para recorrer la ciudad. Visita opcional al Cerro San Bernardo, el MAAM y el mercado artesanal. Transfer al aeropuerto.",
      },
    ],
  },
  {
    id: 2,
    nombre: "Puna y Salinas Grandes",
    slug: "puna-salinas-grandes",
    descripcion:
      "Ascendemos hasta la puna argentina para descubrir un mundo de altitudes extremas y paisajes lunares. Las Salinas Grandes a 3.450 msnm, el Abra Pampa y la laguna de los flamencos rosados forman un circuito que pocos viajeros se atreven a explorar. Experiencia única para amantes de la naturaleza extrema.",
    descripcion_corta:
      "Expedición a la puna con las Salinas Grandes, flamencos rosados y paisajes lunares únicos.",
    duracion_dias: 3,
    precio_desde: 280000,
    moneda: "ARS",
    imagen_url: "",
    incluye_alojamiento: true,
    incluye_traslado: true,
    incluye_comidas: false,
    incluye_guia: true,
    incluye_entradas: true,
    destacado: true,
    activo: true,
    orden: 2,
    categoria: "Expedición",
    fecha_salida: "22 Abr — 24 Abr",
    itinerario: [
      {
        dia: 1,
        titulo: "Salta — Humahuaca",
        descripcion:
          "Subida por la Quebrada de Humahuaca, Patrimonio de la Humanidad. Visitamos Purmamarca y el Cerro de los Siete Colores.",
      },
      {
        dia: 2,
        titulo: "Salinas Grandes — Abra Pampa",
        descripcion:
          "Mañana en las Salinas Grandes (3.450 msnm). Tarde: Laguna de los Flamencos y arribo a Abra Pampa.",
      },
      {
        dia: 3,
        titulo: "Laguna de Pozuelos — Salta",
        descripcion:
          "Visita al Monumento Natural Laguna de los Pozuelos. Retorno a Salta por la tarde.",
      },
    ],
  },
  {
    id: 3,
    nombre: "Quebrada de Humahuaca Completa",
    slug: "quebrada-humahuaca-completa",
    descripcion:
      "La Quebrada de Humahuaca es mucho más que el Cerro de los Siete Colores. En este circuito de 4 días descubrimos sus pueblos escondidos, sus ceremonias ancestrales y sus paisajes que cambian de color según la hora del día. Una inmersión profunda en la cultura andina del norte argentino.",
    descripcion_corta:
      "Inmersión profunda en la Quebrada Patrimonio UNESCO con cultura andina y pueblos remotos.",
    duracion_dias: 4,
    precio_desde: 360000,
    moneda: "ARS",
    imagen_url: "",
    incluye_alojamiento: true,
    incluye_traslado: true,
    incluye_comidas: true,
    incluye_guia: true,
    incluye_entradas: false,
    destacado: false,
    activo: true,
    orden: 3,
    categoria: "Cultural",
    fecha_salida: "1 May — 4 May",
    itinerario: [
      {
        dia: 1,
        titulo: "Salta — Purmamarca",
        descripcion:
          "Viaje a Purmamarca. Tarde para recorrer el pueblo y el Paseo de los Colorados.",
      },
      {
        dia: 2,
        titulo: "Tilcara — Uquía",
        descripcion:
          "Visita al Pucará de Tilcara y sus museos. Pueblo de Uquía con su iglesia colonial.",
      },
      {
        dia: 3,
        titulo: "Humahuaca — Iruya",
        descripcion:
          "Humahuaca ciudad, luego descenso a Iruya, uno de los pueblos más bellos de Argentina.",
      },
      {
        dia: 4,
        titulo: "Regreso a Salta",
        descripcion: "Retorno por la Quebrada con paradas fotográficas.",
      },
    ],
  },
]

export const categoriasPaquetes = [
  "Todos",
  "Circuito",
  "Expedición",
  "Cultural",
  "Aventura",
]
