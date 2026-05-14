-- traslados (servicios de transfer)
CREATE TABLE IF NOT EXISTS public.traslados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  descripcion text,
  descripcion_corta text,
  origen text NOT NULL,
  destino text NOT NULL,
  tipo_servicio text NOT NULL DEFAULT 'regular' CHECK (tipo_servicio IN ('regular','privado')),
  modalidad text NOT NULL DEFAULT 'ida_vuelta' CHECK (modalidad IN ('ida','ida_vuelta','punto_a_punto')),
  vehiculo_tipo text CHECK (vehiculo_tipo IN ('auto','combi','minibus','camioneta_4x4','bus')),
  capacidad_max integer,
  base_minima_pax integer NOT NULL DEFAULT 1,
  precio_desde numeric(12,2) NOT NULL DEFAULT 0,
  moneda text NOT NULL DEFAULT 'ARS',
  duracion_minutos integer,
  incluye_equipaje boolean DEFAULT true,
  incluye_iva boolean DEFAULT true,
  impuestos_adicionales_pct numeric(5,2) DEFAULT 1.2,
  imagen_url text,
  destino_id uuid REFERENCES public.destinos(id) ON DELETE SET NULL,
  activo boolean DEFAULT true,
  destacado boolean DEFAULT false,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_traslados_slug ON public.traslados(slug);
CREATE INDEX IF NOT EXISTS idx_traslados_activo ON public.traslados(activo);
CREATE INDEX IF NOT EXISTS idx_traslados_destacado ON public.traslados(destacado);
CREATE INDEX IF NOT EXISTS idx_traslados_destino_id ON public.traslados(destino_id);
CREATE INDEX IF NOT EXISTS idx_traslados_tipo_servicio ON public.traslados(tipo_servicio);

-- traslados_tarifas (precios por vigencia / temporada)
CREATE TABLE IF NOT EXISTS public.traslados_tarifas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traslado_id uuid NOT NULL REFERENCES public.traslados(id) ON DELETE CASCADE,
  vigencia_label text NOT NULL,
  vigencia_desde date,
  vigencia_hasta date,
  precio_adulto numeric(12,2) NOT NULL,
  precio_nino numeric(12,2),
  moneda text NOT NULL DEFAULT 'ARS',
  comision_pct numeric(5,2),
  notas text,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_traslados_tarifas_traslado_id ON public.traslados_tarifas(traslado_id);
CREATE INDEX IF NOT EXISTS idx_traslados_tarifas_vigencia ON public.traslados_tarifas(vigencia_desde, vigencia_hasta);

-- traslados_imagenes (galería)
CREATE TABLE IF NOT EXISTS public.traslados_imagenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traslado_id uuid NOT NULL REFERENCES public.traslados(id) ON DELETE CASCADE,
  url text NOT NULL,
  orden integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_traslados_imagenes_traslado_id ON public.traslados_imagenes(traslado_id);

-- updated_at trigger (set_updated_at ya existe a nivel global)
DROP TRIGGER IF EXISTS trg_traslados_updated_at ON public.traslados;
CREATE TRIGGER trg_traslados_updated_at BEFORE UPDATE ON public.traslados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_traslados_tarifas_updated_at ON public.traslados_tarifas;
CREATE TRIGGER trg_traslados_tarifas_updated_at BEFORE UPDATE ON public.traslados_tarifas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.traslados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traslados_tarifas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.traslados_imagenes ENABLE ROW LEVEL SECURITY;

-- Public read (solo activos)
DROP POLICY IF EXISTS "traslados public read activos" ON public.traslados;
CREATE POLICY "traslados public read activos" ON public.traslados
  FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "traslados_tarifas public read" ON public.traslados_tarifas;
CREATE POLICY "traslados_tarifas public read" ON public.traslados_tarifas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.traslados t WHERE t.id = traslado_id AND t.activo = true)
  );

DROP POLICY IF EXISTS "traslados_imagenes public read" ON public.traslados_imagenes;
CREATE POLICY "traslados_imagenes public read" ON public.traslados_imagenes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.traslados t WHERE t.id = traslado_id AND t.activo = true)
  );

-- Admin write (usuarios.tipo = 'admin')
DROP POLICY IF EXISTS "traslados admin all" ON public.traslados;
CREATE POLICY "traslados admin all" ON public.traslados FOR ALL USING (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
);

DROP POLICY IF EXISTS "traslados_tarifas admin all" ON public.traslados_tarifas;
CREATE POLICY "traslados_tarifas admin all" ON public.traslados_tarifas FOR ALL USING (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
);

DROP POLICY IF EXISTS "traslados_imagenes admin all" ON public.traslados_imagenes;
CREATE POLICY "traslados_imagenes admin all" ON public.traslados_imagenes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.usuarios u WHERE u.id = auth.uid() AND u.tipo = 'admin')
);
