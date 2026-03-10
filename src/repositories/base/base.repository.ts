import type {
  DatabaseClient,
  PublicTableName,
  TableFilters,
  TableInsert,
  TableRow,
  TableUpdate,
} from "@/types/database/database.types"

type QueryResult<TData> = Promise<{
  data: TData | null
  error: unknown
}>

type FilterableQuery<TData> = QueryResult<TData> & {
  eq: (column: string, value: unknown) => FilterableQuery<TData>
  maybeSingle: () => QueryResult<TData>
}

export abstract class BaseRepository<TTableName extends PublicTableName> {
  protected constructor(
    protected readonly supabase: DatabaseClient,
    protected readonly tableName: TTableName,
  ) {}

  protected abstract createRepositoryException(
    operation: string,
    cause?: unknown,
  ): Error

  protected applyFilters<TData>(
    query: FilterableQuery<TData>,
    filters?: TableFilters<TTableName>,
  ) {
    if (!filters) {
      return query
    }

    let scopedQuery = query

    for (const [column, value] of Object.entries(filters)) {
      if (value !== undefined) {
        scopedQuery = scopedQuery.eq(column, value)
      }
    }

    return scopedQuery
  }

  protected ensureFilters(
    operation: string,
    filters?: TableFilters<TTableName>,
  ): asserts filters is TableFilters<TTableName> {
    if (!filters || Object.keys(filters).length === 0) {
      throw this.createRepositoryException(
        operation,
        new Error("At least one filter is required"),
      )
    }
  }

  async findAll(): Promise<TableRow<TTableName>[]> {
    const { data, error } = (await this.supabase
      .from(this.tableName)
      .select("*")) as unknown as {
      data: TableRow<TTableName>[] | null
      error: unknown
    }

    if (error) {
      throw this.createRepositoryException("findAll", error)
    }

    return data ?? []
  }

  async findMany(
    filters?: TableFilters<TTableName>,
  ): Promise<TableRow<TTableName>[]> {
    const query = this.applyFilters(
      this.supabase
        .from(this.tableName)
        .select("*") as unknown as FilterableQuery<TableRow<TTableName>[]>,
      filters,
    )
    const { data, error } = await query

    if (error) {
      throw this.createRepositoryException("findMany", error)
    }

    return data ?? []
  }

  async findOne(
    filters: TableFilters<TTableName>,
  ): Promise<TableRow<TTableName> | null> {
    const query = this.applyFilters(
      this.supabase
        .from(this.tableName)
        .select("*") as unknown as FilterableQuery<TableRow<TTableName>>,
      filters,
    )
    const { data, error } = await query.maybeSingle()

    if (error) {
      throw this.createRepositoryException("findOne", error)
    }

    return data
  }

  async create(payload: TableInsert<TTableName>): Promise<TableRow<TTableName>> {
    const { data, error } = (await this.supabase
      .from(this.tableName)
      .insert(payload as never)
      .select("*")
      .single()) as unknown as {
      data: TableRow<TTableName> | null
      error: unknown
    }

    if (error) {
      throw this.createRepositoryException("create", error)
    }

    if (!data) {
      throw this.createRepositoryException(
        "create",
        new Error("No record returned after insert"),
      )
    }

    return data
  }

  async update(
    filters: TableFilters<TTableName>,
    payload: TableUpdate<TTableName>,
  ): Promise<TableRow<TTableName> | null> {
    this.ensureFilters("update", filters)

    const query = this.applyFilters(
      this.supabase
        .from(this.tableName)
        .update(payload as never)
        .select("*") as unknown as FilterableQuery<TableRow<TTableName>>,
      filters,
    )
    const { data, error } = await query.maybeSingle()

    if (error) {
      throw this.createRepositoryException("update", error)
    }

    return data
  }

  async delete(filters: TableFilters<TTableName>): Promise<void> {
    this.ensureFilters("delete", filters)

    const query = this.applyFilters(
      this.supabase
        .from(this.tableName)
        .delete() as unknown as FilterableQuery<null>,
      filters,
    )
    const { error } = await query

    if (error) {
      throw this.createRepositoryException("delete", error)
    }
  }
}
