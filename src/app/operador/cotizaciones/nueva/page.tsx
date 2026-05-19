import { NuevaCotizacionClient } from "@/components/operador/nueva-cotizacion-client"

export const dynamic = "force-dynamic"

export default function NuevaCotizacionPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <NuevaCotizacionClient />
    </div>
  )
}
