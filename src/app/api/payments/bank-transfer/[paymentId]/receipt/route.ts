import { NextResponse } from "next/server"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import {
  PaymentReceiptAccessDeniedException,
  PaymentReceiptValidationException,
} from "@/exceptions/payments/payments.exceptions"
import { getUserFacingErrorMessage } from "@/lib/errors/user-facing-error"
import { createClient } from "@/lib/supabase/server"

const JSON_CONTENT_TYPE = "application/json"

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

    const paymentsController = await createServerPaymentsController()
    const contentType = request.headers.get("content-type") ?? ""
    const result = contentType.includes(JSON_CONTENT_TYPE)
      ? await (async () => {
          const body = (await request.json()) as {
            receiptStoragePath?: string
            fileName?: string
            fileType?: string
            receiptReference?: string
            note?: string
          }

          if (
            !body.receiptStoragePath?.trim() ||
            !body.fileName?.trim() ||
            !body.fileType?.trim()
          ) {
            return NextResponse.json(
              { error: "Faltan datos para registrar el comprobante." },
              { status: 400 },
            )
          }

          const uploadResult =
            await paymentsController.registerBankTransferReceiptUpload({
              paymentId,
              userId: user.id,
              receiptStoragePath: body.receiptStoragePath.trim(),
              fileName: body.fileName.trim(),
              fileType: body.fileType.trim(),
              receiptReference: body.receiptReference?.trim() || undefined,
              note: body.note?.trim() || undefined,
            })

          return NextResponse.json(uploadResult, { status: 200 })
        })()
      : await (async () => {
          const formData = await request.formData()
          const receipt = formData.get("receipt")

          if (!(receipt instanceof File)) {
            return NextResponse.json(
              { error: "El comprobante es obligatorio." },
              { status: 400 },
            )
          }

          const receiptReference = formData.get("receiptReference")
          const note = formData.get("note")
          const uploadResult = await paymentsController.uploadBankTransferReceipt({
            paymentId,
            userId: user.id,
            fileName: receipt.name,
            fileType: receipt.type || "application/octet-stream",
            fileBuffer: await receipt.arrayBuffer(),
            receiptReference:
              typeof receiptReference === "string" && receiptReference.trim().length > 0
                ? receiptReference.trim()
                : undefined,
            note:
              typeof note === "string" && note.trim().length > 0
                ? note.trim()
                : undefined,
          })

          return NextResponse.json(uploadResult, { status: 200 })
        })()

    return result
  } catch (error) {
    if (error instanceof PaymentReceiptAccessDeniedException) {
      return NextResponse.json(
        {
          error: getUserFacingErrorMessage(
            error,
            "No tenes permiso para cargar este comprobante.",
          ),
        },
        { status: 403 },
      )
    }

    if (error instanceof PaymentReceiptValidationException) {
      return NextResponse.json(
        {
          error: getUserFacingErrorMessage(
            error,
            "No se pudo validar el comprobante.",
          ),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: getUserFacingErrorMessage(
          error,
          "No se pudo cargar el comprobante.",
        ),
      },
      { status: 400 },
    )
  }
}
