"use client"

import { startTransition, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_auth_code: "No pudimos iniciar la sesión con Google. Intenta otra vez.",
  oauth_callback_failed:
    "Falló la validación del login con Google. Reintenta desde el botón de acceso.",
}

function getSafeNext(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/"
  }

  return next
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const next = getSafeNext(searchParams.get("next"))
  const authError = searchParams.get("error")
  const [email, setEmail] = useState("")
  const [isEmailPending, setIsEmailPending] = useState(false)
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const resolvedErrorMessage = authError
    ? AUTH_ERROR_MESSAGES[authError] ??
      "No pudimos completar el inicio de sesión. Intenta nuevamente."
    : ""

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email) {
      return
    }

    setIsEmailPending(true)
    setSuccessMessage("")
    setErrorMessage("")

    const emailRedirectTo = new URL(window.location.origin)
    emailRedirectTo.pathname = next

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: emailRedirectTo.toString(),
        shouldCreateUser: true,
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setIsEmailPending(false)
      return
    }

    setSuccessMessage(
      "Te enviamos un enlace mágico a tu correo. Abrilo desde el mismo navegador para completar el acceso.",
    )
    setIsEmailPending(false)
  }

  function handleGoogleSignIn() {
    setErrorMessage("")
    setSuccessMessage("")
    setIsGooglePending(true)

    startTransition(async () => {
      const redirectTo = new URL("/auth/callback", window.location.origin)
      redirectTo.searchParams.set("next", next)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
        },
      })

      if (error) {
        setErrorMessage(error.message)
        setIsGooglePending(false)
      }
    })
  }

  const feedbackMessage = errorMessage || resolvedErrorMessage || successMessage
  const feedbackTone =
    errorMessage || resolvedErrorMessage ? "text-destructive" : "text-primary"

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center bg-muted/30 px-8 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="font-serif text-4xl italic leading-tight text-foreground md:text-5xl">
              Accede a tu cuenta
              <br />
              sin contraseña
            </h1>
            <p className="text-sm text-muted-foreground">
              Entra con un enlace mágico por email o con Google. Al autenticarte
              sincronizamos automáticamente tu perfil en Apacheta.
            </p>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-[0.24em] text-muted-foreground"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border-0 border-b border-border bg-transparent py-3 text-lg text-foreground outline-none transition-colors focus:border-primary"
                placeholder="tu@email.com"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-sm bg-primary text-base text-primary-foreground hover:bg-primary/90"
              disabled={isEmailPending || isGooglePending}
            >
              {isEmailPending ? "Enviando enlace..." : "Enviar enlace mágico"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/70" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/30 px-4 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                o continúa con
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="group h-11 w-full gap-3 rounded-sm border-primary bg-transparent hover:bg-primary hover:text-primary-foreground"
            disabled={isEmailPending || isGooglePending}
            onClick={handleGoogleSignIn}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-base">
              {isGooglePending ? "Redirigiendo a Google..." : "Continuar con Google"}
            </span>
          </Button>

          {feedbackMessage ? (
            <p className={`text-sm ${feedbackTone}`}>{feedbackMessage}</p>
          ) : null}

          <p className="text-center text-xs text-muted-foreground lg:text-left">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos" className="text-primary hover:underline">
              Términos de servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacidad" className="text-primary hover:underline">
              Política de privacidad
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 lg:flex">
        <Image
          src="/login/login-image.png"
          alt="Paisaje del Norte Argentino"
          fill
          className="object-cover object-right"
          priority
        />
      </div>
    </div>
  )
}
