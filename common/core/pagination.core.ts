export class Pagination {
    limit: number
    currentPage: number
    totalPage: number
    totalElements: number

    constructor({
        limit,
        currentPage,
        totalPage,
        totalElements
    }: {
        limit: number
        currentPage: number
        totalPage: number
        totalElements: number
    }) {
        this.limit = limit
        this.currentPage = currentPage
        this.totalPage = totalPage
        this.totalElements = totalElements
    }
}
