"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  missing_auth_code:
    "No pudimos iniciar la sesión con Google. Intenta otra vez.",
  oauth_callback_failed:
    "Falló la validación del login con Google. Reintenta desde el botón de acceso.",
}

const RESEND_COOLDOWN_SECONDS = 30

function getSafeNext(next: string | null) {
  if (!next || !next.startsWith("/")) {
    return "/"
  }

  return next
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = getSafeNext(searchParams.get("next"))
  const authError = searchParams.get("error")
  const handledErrorRef = useRef<string | null>(null)

  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const [pendingAction, setPendingAction] = useState<
    "send-code" | "verify-code" | "resend-code" | "google" | null
  >(null)

  useEffect(() => {
    if (!authError || handledErrorRef.current === authError) {
      return
    }

    handledErrorRef.current = authError

    toast.error(
      AUTH_ERROR_MESSAGES[authError] ??
        "No pudimos completar el inicio de sesión. Intenta nuevamente.",
    )
  }, [authError])

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timeout = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [resendCooldown])

  async function handleSendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email) {
      return
    }

    setPendingAction("send-code")

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        throw error
      }

      setStep("otp")
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      toast.success("Código enviado. Revisa tu correo electrónico.")
    } catch (error) {
      toast.error(
        getUserFacingErrorMessage(
          error,
          "No pudimos enviar el codigo. Intenta nuevamente.",
        ),
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleVerifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (otp.length !== 6) {
      return
    }

    setPendingAction("verify-code")

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (error) {
        throw error
      }

      toast.success("Sesión iniciada correctamente.")
      router.replace(next)
      router.refresh()
    } catch (error) {
      toast.error(
        getUserFacingErrorMessage(
          error,
          "No pudimos verificar el codigo. Intenta nuevamente.",
        ),
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleResendCode() {
    if (!email) {
      return
    }

    setPendingAction("resend-code")

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })

      if (error) {
        throw error
      }

      setResendCooldown(RESEND_COOLDOWN_SECONDS)
      toast.success("Código reenviado. Revisa tu correo nuevamente.")
    } catch (error) {
      toast.error(
        getUserFacingErrorMessage(
          error,
          "No pudimos reenviar el codigo. Intenta nuevamente.",
        ),
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function handleGoogleSignIn() {
    setPendingAction("google")

    try {
      const redirectTo = new URL("/auth/callback", window.location.origin)
      redirectTo.searchParams.set("next", next)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo.toString(),
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      toast.error(
        getUserFacingErrorMessage(
          error,
          "No pudimos iniciar el acceso con Google.",
        ),
      )
      setPendingAction(null)
    }
  }

  const isLoading = pendingAction !== null
  const isResendDisabled = pendingAction === "resend-code" || resendCooldown > 0
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "MAIL"

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 bg-muted/30 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          {step === "email" ? (
            <form onSubmit={handleSendCode} className="space-y-7 sm:space-y-8">
              <div className="space-y-2">
                <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                  Bienvenido a Apacheta
                </h1>
                <p className="text-muted-foreground text-sm text-center">
                  Ingresa tu email abajo para iniciar sesión en tu cuenta
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Correo Electrónico
                  </Label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full bg-transparent border-0 border-b border-border py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-lg"
                    placeholder=""
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-sm h-11 text-base cursor-pointer"
                  disabled={isLoading}
                >
                  {pendingAction === "send-code"
                    ? "Enviando..."
                    : "Enviar código de verificación"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full group/button border-primary bg-transparent hover:bg-primary/90 rounded-sm h-11 gap-2 cursor-pointer"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  <span className="text-primary text-base">
                    {pendingAction === "google"
                      ? "Continuando..."
                      : "Continuar con Google"}
                  </span>
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyCode}
              className="space-y-7 sm:space-y-8"
            >
              <div className="space-y-2 text-center flex flex-col items-center justify-center">
                <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
                  Ingresa el código
                  <br />
                  de verificación
                </h1>
                <p className="text-muted-foreground text-sm">
                  Hemos enviado un código de 6 dígitos a {maskedEmail}
                </p>
              </div>

              <div className="space-y-4 text-center flex flex-col items-center justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-center gap-0"
                >
                  <InputOTPGroup className="gap-1 sm:gap-2">
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground mx-1 sm:mx-2" />
                  <InputOTPGroup className="gap-1 sm:gap-2">
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-9 sm:h-14 sm:w-12 bg-primary/20 text-base sm:text-lg font-medium rounded-none border border-primary"
                    />
                  </InputOTPGroup>
                </InputOTP>

                <p className="text-sm text-muted-foreground">
                  No recibiste el código?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-primary hover:underline font-medium cursor-pointer"
                    disabled={isResendDisabled}
                  >
                    {pendingAction === "resend-code"
                      ? "Reenviando..."
                      : resendCooldown > 0
                        ? `Reenviar (${resendCooldown}s)`
                        : "Reenviar"}
                  </button>
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-sm h-11"
                  disabled={isLoading || otp.length !== 6}
                >
                  {pendingAction === "verify-code"
                    ? "Verificando..."
                    : "Verificar código"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Al continuar, aceptas nuestros{" "}
                  <Link
                    href="/terminos"
                    className="text-primary hover:underline"
                  >
                    Términos de servicio
                  </Link>{" "}
                  y{" "}
                  <Link
                    href="/privacidad"
                    className="text-primary hover:underline"
                  >
                    Política de privacidad
                  </Link>
                  .
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative">
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
