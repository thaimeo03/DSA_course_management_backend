interface Pagination {
  limit: number
  currentPage: number
  totalPage: number
}

export class ResponseData<T> {
  message: string
  data?: T

  constructor({ message, data }: { message: string; data?: T }) {
    this.message = message
    this.data = data
  }
}

export class ResponseDataWithPagination<T> extends ResponseData<T> {
  pagination: Pagination

  constructor({ message, data, pagination }: { message: string; data: T; pagination: Pagination }) {
    super({ message, data })
    this.pagination = pagination
  }
}
