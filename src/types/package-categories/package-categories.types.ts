export interface PackageCategoriesRow {
  paquete_id: string
  categoria_id: string
}

export interface PackageCategoriesInsert {
  paquete_id: string
  categoria_id: string
}

export interface PackageCategoriesUpdate {
  paquete_id?: string
  categoria_id?: string
}
