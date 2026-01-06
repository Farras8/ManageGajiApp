export interface User {
    id: string
    email: string
    name: string
    role: string
    createdAt: string
    updatedAt: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    success: boolean
    message: string
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}
