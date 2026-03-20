import { NextResponse } from "next/server"

import { createServerPaymentsController } from "@/controllers/payments/payments.controller"
import { createClient } from "@/lib/supabase/server"

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
    const paymentsController = await createServerPaymentsController()
    const result = await paymentsController.uploadBankTransferReceipt({
      paymentId,
      userId: user.id,
      fileName: receipt.name,
      fileType: receipt.type || "application/octet-stream",
      fileBuffer: await receipt.arrayBuffer(),
      receiptReference:
        typeof receiptReference === "string" && receiptReference.trim().length > 0
          ? receiptReference.trim()
          : undefined,
      note: typeof note === "string" && note.trim().length > 0 ? note.trim() : undefined,
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo cargar el comprobante.",
      },
      { status: 400 },
    )
  }
}
