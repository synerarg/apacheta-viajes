import { NextResponse } from "next/server"

import { createServerAuthController } from "@/controllers/auth/auth.controller"

export async function POST() {
  try {
    const authController = await createServerAuthController()
    const profile = await authController.syncAuthenticatedUser()

    return NextResponse.json(
      {
        synced: Boolean(profile),
      },
      {
        status: 200,
      },
    )
  } catch {
    return NextResponse.json(
      {
        synced: false,
      },
      {
        status: 500,
      },
    )
  }
}
