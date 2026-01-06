import { Category, Transaction, FilterPeriod, FinanceSummary } from "@/types/finance"
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from "date-fns"

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num)
}

export function getDateRange(period: FilterPeriod, baseDate: Date = new Date()): { start: Date; end: Date } {
    switch (period) {
        case "day":
            return { start: startOfDay(baseDate), end: endOfDay(baseDate) }
        case "week":
            return { start: startOfWeek(baseDate, { weekStartsOn: 1 }), end: endOfWeek(baseDate, { weekStartsOn: 1 }) }
        case "month":
            return { start: startOfMonth(baseDate), end: endOfMonth(baseDate) }
        case "year":
            return { start: startOfYear(baseDate), end: endOfYear(baseDate) }
        case "all":
        default:
            return { start: new Date(0), end: new Date(8640000000000000) }
    }
}

export function filterTransactionsByPeriod(
    transactions: Transaction[],
    period: FilterPeriod,
    baseDate: Date = new Date()
): Transaction[] {
    if (period === "all") return transactions

    const { start, end } = getDateRange(period, baseDate)

    return transactions.filter((transaction) =>
        isWithinInterval(new Date(transaction.date), { start, end })
    )
}

export function calculateSummary(transactions: Transaction[]): FinanceSummary {
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactionCount: transactions.length,
    }
}

export function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
    return transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date).toISOString().split("T")[0]
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(transaction)
        return groups
    }, {} as Record<string, Transaction[]>)
}

export function groupTransactionsByCategory(transactions: Transaction[]): Record<string, { category: Category; total: number; count: number }> {
    return transactions.reduce((groups, transaction) => {
        const categoryId = transaction.categoryId
        if (!groups[categoryId]) {
            groups[categoryId] = {
                category: transaction.category!,
                total: 0,
                count: 0,
            }
        }
        groups[categoryId].total += transaction.amount
        groups[categoryId].count += 1
        return groups
    }, {} as Record<string, { category: Category; total: number; count: number }>)
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const categoryIcons: Record<string, string> = {
    food: "🍔",
    transport: "🚗",
    shopping: "🛍️",
    entertainment: "🎬",
    health: "💊",
    education: "📚",
    bills: "📄",
    salary: "💰",
    investment: "📈",
    gift: "🎁",
    other: "📦",
}

export const categoryColors: Record<string, string> = {
    food: "#f97316",
    transport: "#3b82f6",
    shopping: "#ec4899",
    entertainment: "#8b5cf6",
    health: "#10b981",
    education: "#f59e0b",
    bills: "#64748b",
    salary: "#22c55e",
    investment: "#0ea5e9",
    gift: "#f43f5e",
    other: "#6b7280",
}
