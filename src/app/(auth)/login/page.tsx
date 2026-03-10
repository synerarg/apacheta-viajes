"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setStep("otp")
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Redirect to dashboard or home
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "MAIL"

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 bg-muted/30 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          {step === "email" ? (
            /* Email Step */
            <form onSubmit={handleSendCode} className="space-y-8">
              <div className="space-y-2">
                <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-tight">
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-border py-2 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-lg"
                    placeholder=""
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm h-11 text-base cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar código de verificación"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full group/button border-primary bg-transparent hover:bg-primary/90 rounded-sm h-11 gap-2 cursor-pointer"
                  disabled={isLoading}
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
                  <span className="text-primary group-hover/button:text-primary-foreground text-base">
                    {isLoading ? "Continuando..." : "Continuar con Google"}
                  </span>
                </Button>
              </div>
            </form>
          ) : (
            /* OTP Step */
            <form onSubmit={handleVerifyCode} className="space-y-8">
              <div className="space-y-2">
                <h1 className="font-serif italic text-4xl md:text-5xl text-foreground leading-tight">
                  Ingresa el código
                  <br />
                  de verificación
                </h1>
                <p className="text-muted-foreground text-sm">
                  Hemos enviado un código de 6 dígitos a {maskedEmail}
                </p>
              </div>

              <div className="space-y-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="justify-start gap-0"
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={0}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground mx-2" />
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot
                      index={3}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-14 w-12 rounded-sm border-0 bg-primary/10 text-lg font-medium first:rounded-l-sm last:rounded-r-sm"
                    />
                  </InputOTPGroup>
                </InputOTP>

                <p className="text-sm text-muted-foreground">
                  No recibiste el código?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Reenviar
                  </button>
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm h-11"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verificando..." : "Verificar código"}
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

      {/* Right Side - Image with Logo */}
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
