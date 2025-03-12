export class Pagination {
    limit: number
    currentPage: number
    totalPage: number

    constructor({
        limit,
        currentPage,
        totalPage
    }: {
        limit: number
        currentPage: number
        totalPage: number
    }) {
        this.limit = limit
        this.currentPage = currentPage
        this.totalPage = totalPage
    }
}
