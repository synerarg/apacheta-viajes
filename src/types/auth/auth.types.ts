export type AuthActionStatus = "idle" | "success" | "error"

export interface AuthActionState {
  status: AuthActionStatus
  message: string
  email: string
}

export const INITIAL_AUTH_ACTION_STATE: AuthActionState = {
  status: "idle",
  message: "",
  email: "",
}

export interface AuthenticatedNavbarUser {
  id: string
  email: string | null
  nombre: string | null
  apellido: string | null
  avatarUrl: string | null
}
