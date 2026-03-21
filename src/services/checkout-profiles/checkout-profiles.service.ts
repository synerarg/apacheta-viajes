import {
  CheckoutProfilesNotFoundException,
  CheckoutProfilesServiceException,
} from "@/exceptions/checkout-profiles/checkout-profiles.exceptions"
import { CheckoutProfilesRepository } from "@/repositories/checkout-profiles/checkout-profiles.repository"
import { BaseService } from "@/services/base/base.service"
import type {
  CheckoutProfilesRow,
  CheckoutProfilesUpdate,
} from "@/types/checkout-profiles/checkout-profiles.types"

export class CheckoutProfilesService extends BaseService<"checkout_profiles"> {
  constructor(repository: CheckoutProfilesRepository) {
    super(repository)
  }

  protected createServiceException(operation: string, cause?: unknown) {
    return new CheckoutProfilesServiceException(operation, cause)
  }

  protected createNotFoundException(criteria: string) {
    return new CheckoutProfilesNotFoundException(criteria)
  }

  async getByUsuarioId(usuarioId: string): Promise<CheckoutProfilesRow | null> {
    return this.get({ usuario_id: usuarioId })
  }

  async upsertByUsuarioId(
    usuarioId: string,
    payload: CheckoutProfilesUpdate,
  ): Promise<CheckoutProfilesRow> {
    try {
      const profile = await (
        this.repository as CheckoutProfilesRepository
      ).upsertByUsuarioId(usuarioId, {
        ...payload,
        updated_at: new Date().toISOString(),
      })

      if (!profile) {
        throw new CheckoutProfilesNotFoundException(`usuario_id ${usuarioId}`)
      }

      return profile
    } catch (error) {
      this.handleServiceError("upsertByUsuarioId", error)
    }
  }

  async deleteByUsuarioId(usuarioId: string): Promise<void> {
    try {
      await (
        this.repository as CheckoutProfilesRepository
      ).deleteByUsuarioId(usuarioId)
    } catch (error) {
      this.handleServiceError("deleteByUsuarioId", error)
    }
  }
}

export function createCheckoutProfilesService(
  repository: CheckoutProfilesRepository,
) {
  return new CheckoutProfilesService(repository)
}
