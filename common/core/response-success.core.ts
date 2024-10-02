interface Pagination {
  limit: number
  currentPage: number
  totalPage: number
}

export class DataResponse<T> {
  message: string
  data?: T

  constructor({ message, data }: { message: string; data?: T }) {
    this.message = message
    this.data = data
  }
}

export class DataResponseWithPagination<T> extends DataResponse<T> {
  pagination: Pagination

  constructor({ message, data, pagination }: { message: string; data: T; pagination: Pagination }) {
    super({ message, data })
    this.pagination = pagination
  }
}
