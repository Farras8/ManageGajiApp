export type TransactionType = "income" | "expense"

export type FilterType = "all" | "income" | "expense"

export interface Category {
    id: string
    name: string
    type: TransactionType
    icon: string
    color: string
    createdAt: Date
}

export interface Transaction {
    id: string
    categoryId: string
    category?: Category
    amount: number
    type: TransactionType
    description: string
    date: Date
    createdAt: Date
}

export type FilterPeriod = "day" | "week" | "month" | "year" | "all"

export interface FinanceSummary {
    totalIncome: number
    totalExpense: number
    balance: number
    transactionCount: number
}
