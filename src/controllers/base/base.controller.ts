import type { BaseService } from "@/services/base/base.service"
import type {
  PublicTableName,
  TableFilters,
  TableInsert,
  TableRow,
  TableUpdate,
} from "@/types/database/database.types"

export abstract class BaseController<
  TTableName extends PublicTableName,
  TService extends BaseService<TTableName> = BaseService<TTableName>,
> {
  protected constructor(
    protected readonly service: TService,
  ) {}

  async list(filters?: TableFilters<TTableName>) {
    return this.service.list(filters)
  }

  async get(filters: TableFilters<TTableName>) {
    return this.service.get(filters)
  }

  async create(payload: TableInsert<TTableName>) {
    return this.service.create(payload)
  }

  async updateByFilters(
    filters: TableFilters<TTableName>,
    payload: TableUpdate<TTableName>,
    criteria: string,
  ) {
    return this.service.updateByFilters(filters, payload, criteria)
  }

  async deleteByFilters(filters: TableFilters<TTableName>) {
    return this.service.deleteByFilters(filters)
  }
}

export abstract class BaseIdController<
  TTableName extends PublicTableName,
  TService extends BaseService<TTableName> = BaseService<TTableName>,
> extends BaseController<TTableName, TService> {
  protected buildIdFilter(id: string): TableFilters<TTableName> {
    return {
      id,
    } as unknown as TableFilters<TTableName>
  }

  async getById(id: string): Promise<TableRow<TTableName>> {
    return this.service.getOrThrow(this.buildIdFilter(id), `id ${id}`)
  }

  async updateById(
    id: string,
    payload: TableUpdate<TTableName>,
  ): Promise<TableRow<TTableName>> {
    return this.service.updateByFilters(
      this.buildIdFilter(id),
      payload,
      `id ${id}`,
    )
  }

  async deleteById(id: string) {
    return this.service.deleteByFilters(this.buildIdFilter(id))
  }
}
