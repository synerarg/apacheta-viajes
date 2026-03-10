export interface PaquetesCategoriasRow {
  paquete_id: string
  categoria_id: string
}

export interface PaquetesCategoriasInsert {
  paquete_id: string
  categoria_id: string
}

export interface PaquetesCategoriasUpdate {
  paquete_id?: string
  categoria_id?: string
}
