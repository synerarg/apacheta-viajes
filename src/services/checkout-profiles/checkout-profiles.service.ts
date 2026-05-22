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

  async getByUserId(userId: string): Promise<CheckoutProfilesRow | null> {
    return this.get({ usuario_id: userId })
  }

  async upsertByUserId(
    userId: string,
    payload: CheckoutProfilesUpdate,
  ): Promise<CheckoutProfilesRow> {
    try {
      const profile = await (
        this.repository as CheckoutProfilesRepository
      ).upsertByUserId(userId, {
        ...payload,
        updated_at: new Date().toISOString(),
      })

      if (!profile) {
        throw new CheckoutProfilesNotFoundException(`usuario_id ${userId}`)
      }

      return profile
    } catch (error) {
      this.handleServiceError("upsertByUserId", error)
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await (
        this.repository as CheckoutProfilesRepository
      ).deleteByUserId(userId)
    } catch (error) {
      this.handleServiceError("deleteByUserId", error)
    }
  }
}

export function createCheckoutProfilesService(
  repository: CheckoutProfilesRepository,
) {
  return new CheckoutProfilesService(repository)
}
