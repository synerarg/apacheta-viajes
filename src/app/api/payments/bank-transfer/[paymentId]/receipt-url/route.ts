import { NextResponse } from "next/server"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import {
  PaymentReceiptAccessDeniedException,
  PaymentReceiptUnavailableException,
  PaymentReceiptValidationException,
} from "@/exceptions/payments/payments.exceptions"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> },
) {
  try {
    const { paymentId } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Necesitás iniciar sesión para ver el comprobante." },
        { status: 401 },
      )
    }

    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.getBankTransferReceiptDownloadUrl(
      paymentId,
      user.id,
    )

    return NextResponse.redirect(result.url)
  } catch (error) {
    if (error instanceof PaymentReceiptAccessDeniedException) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    if (error instanceof PaymentReceiptUnavailableException) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    if (error instanceof PaymentReceiptValidationException) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo generar el acceso al comprobante.",
      },
      { status: 500 },
    )
  }
}
