"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const inputClass =
  "bg-transparent border-b border-border py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"

export function ContactForm() {
  return (
    <form
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Nombre Completo
          </label>
          <input
            type="text"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Correo Electrónico
          </label>
          <input
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Tipo de Viaje</label>
          <Select>
            <SelectTrigger className="bg-transparent border-0 border-b border-border rounded-none px-0 py-2 h-auto focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receptivo">Turismo Receptivo</SelectItem>
              <SelectItem value="emisivo">Turismo Emisivo</SelectItem>
              <SelectItem value="corporativo">Viaje Corporativo</SelectItem>
              <SelectItem value="grupos">Grupos</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Presupuesto Estimado
          </label>
          <input
            type="text"
            autoComplete="off"
            placeholder="Ej: USD 2.000 por persona"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Fechas Estimadas
          </label>
          <input
            type="text"
            autoComplete="off"
            placeholder="Ej: vacaciones de julio"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">
            Número de Pasajeros
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej: 4"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-muted-foreground">Mensaje</label>
        <textarea
          rows={3}
          autoComplete="off"
          placeholder="Contanos sobre tu viaje ideal..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base mt-2"
      >
        Enviar Solicitud
      </Button>
    </form>
  )
}
