// Cálculos puros de la cotización.
// Fórmula canónica nueva:
//   subtotal_venta    = adultos * precio_adulto + menores * precio_menor
//   subtotal_comision = subtotal_venta * comision_pct / 100   (ingreso del operador)
//   subtotal_neto     = subtotal_venta - subtotal_comision     (lo que retiene Apacheta)
//
//   total_impuesto    = aplica_impuesto ? total_venta * impuesto_pct / 100 : 0
//   total_final       = total_venta + total_impuesto
//
// Todo se redondea a 2 decimales.

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export interface ItemSubtotalsInput {
  adultos: number
  menores: number
  precioAdultoUnit: number
  precioMenorUnit: number
  comisionPct: number
}

export interface ItemSubtotalsOutput {
  subtotalVenta: number
  subtotalComision: number
  subtotalNeto: number
}

export function calcItemSubtotals(input: ItemSubtotalsInput): ItemSubtotalsOutput {
  const adultos = Math.max(0, Number(input.adultos) || 0)
  const menores = Math.max(0, Number(input.menores) || 0)
  const pa = Math.max(0, Number(input.precioAdultoUnit) || 0)
  const pm = Math.max(0, Number(input.precioMenorUnit) || 0)
  const comm = Math.max(0, Number(input.comisionPct) || 0)

  const subtotalVenta = round2(adultos * pa + menores * pm)
  const subtotalComision = round2((subtotalVenta * comm) / 100)
  const subtotalNeto = round2(subtotalVenta - subtotalComision)

  return { subtotalVenta, subtotalComision, subtotalNeto }
}

export interface QuoteTotalsItem {
  subtotalVenta: number
  subtotalComision: number
  subtotalNeto: number
}

export interface QuoteTotalsOutput {
  totalVenta: number
  totalComision: number
  totalNeto: number
  totalImpuesto: number
  totalFinal: number
}

export function calcQuoteTotals(
  items: QuoteTotalsItem[],
  aplicaImpuesto: boolean,
  impuestoPct: number,
): QuoteTotalsOutput {
  const sums = items.reduce(
    (acc, it) => {
      acc.totalVenta += Number(it.subtotalVenta) || 0
      acc.totalComision += Number(it.subtotalComision) || 0
      acc.totalNeto += Number(it.subtotalNeto) || 0
      return acc
    },
    { totalVenta: 0, totalComision: 0, totalNeto: 0 },
  )

  const totalVenta = round2(sums.totalVenta)
  const totalComision = round2(sums.totalComision)
  const totalNeto = round2(sums.totalNeto)
  const impPct = Math.max(0, Number(impuestoPct) || 0)
  const totalImpuesto = aplicaImpuesto ? round2((totalVenta * impPct) / 100) : 0
  const totalFinal = round2(totalVenta + totalImpuesto)

  return { totalVenta, totalComision, totalNeto, totalImpuesto, totalFinal }
}
