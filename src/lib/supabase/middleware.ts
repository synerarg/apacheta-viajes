import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

function buildLoginRedirect(request: NextRequest, nextOverride?: string) {
  const loginUrl = new URL("/login", request.url)
  const original =
    nextOverride ?? request.nextUrl.pathname + (request.nextUrl.search ?? "")
  // Sólo preservar paths internos (los safe-next del LoginForm exigen "/")
  if (original && original.startsWith("/") && original !== "/login") {
    loginUrl.searchParams.set("next", original)
  }
  return NextResponse.redirect(loginUrl)
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith("/api/")

  const authRoutes = ["/checkout", "/account"]
  const needsAuth = authRoutes.some((route) => pathname.startsWith(route))

  const adminRoutes = ["/dashboard", "/api/dashboard"]
  const needsAdmin = adminRoutes.some((route) => pathname.startsWith(route))

  const operatorRoutes = ["/operador", "/api/operador"]
  const needsOperador = operatorRoutes.some((route) =>
    pathname.startsWith(route),
  )

  // Bloque unificado: cualquier ruta protegida sin sesión va al login con
  // el `next` correcto, así el usuario vuelve exactamente donde quería ir.
  if ((needsAuth || needsAdmin || needsOperador) && !user) {
    if (isApiRoute) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }
    // Si pedís entrar al panel de operador sin sesión, no sabemos todavía si
    // tenés rol operador. Vamos primero al login y, al volver, te llevamos a
    // /account/operador: si ya sos operador la página te ofrece "Ir al panel",
    // si no, te muestra el formulario de inscripción. Así no rebotamos por
    // /operador → /account/operador después del login.
    if (needsOperador) {
      return buildLoginRedirect(request, "/account/operador")
    }
    return buildLoginRedirect(request)
  }

  // Sólo a partir de acá sabemos que hay sesión. Si la ruta requiere un rol
  // específico hacemos una sola consulta de perfil.
  if ((needsAdmin || needsOperador) && user) {
    const { data: profile } = await supabase
      .from("usuarios")
      .select("tipo")
      .eq("id", user.id)
      .maybeSingle()

    if (needsAdmin && profile?.tipo !== "admin") {
      if (isApiRoute) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (
      needsOperador &&
      profile?.tipo !== "operador" &&
      profile?.tipo !== "admin"
    ) {
      if (isApiRoute) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/account/operador", request.url))
    }
  }

  return response
}
