import { NextResponse } from "next/server"
import { z } from "zod"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import {
  PaymentReceiptAccessDeniedException,
  PaymentReceiptValidationException,
} from "@/exceptions/payments/payments.exceptions"
import { createClient } from "@/lib/supabase/server"

const authorizeReceiptUploadSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
})

export async function POST(
  request: Request,
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
        { error: "Necesitás iniciar sesión para cargar el comprobante." },
        { status: 401 },
      )
    }

    const body = await request.json()
    const payload = authorizeReceiptUploadSchema.parse(body)
    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.authorizeBankTransferReceiptUpload({
      paymentId,
      userId: user.id,
      fileName: payload.fileName,
      fileType: payload.fileType,
      fileSize: payload.fileSize,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof PaymentReceiptAccessDeniedException) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    if (error instanceof PaymentReceiptValidationException || error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error instanceof z.ZodError ? "Metadata de comprobante inválida." : error.message },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo autorizar la carga del comprobante.",
      },
      { status: 400 },
    )
  }
}
