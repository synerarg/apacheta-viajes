import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

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
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // getUser() valida el JWT en el servidor; getSession() solo lee el token y puede estar vencido
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isApiRoute = pathname.startsWith("/api/")

  // Rutas que requieren estar autenticado
  const authRoutes = ["/checkout", "/account"]
  const needsAuth = authRoutes.some((route) => pathname.startsWith(route))

  if (needsAuth && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Rutas que requieren rol admin (páginas y API) — sin sesión no se permite entrar
  const adminRoutes = ["/dashboard", "/api/dashboard"]
  const needsAdmin = adminRoutes.some((route) => pathname.startsWith(route))

  if (needsAdmin) {
    if (!user) {
      if (isApiRoute) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return response
}
