"use client"

import { useState, useCallback, useEffect } from "react"
import { Category, Transaction, FilterPeriod, TransactionType, FilterType } from "@/types/finance"
import { filterTransactionsByPeriod, calculateSummary } from "@/lib/finance"

const defaultCategories: Omit<Category, "id" | "createdAt">[] = [
    { name: "Makan & Minum", type: "expense", icon: "🍔", color: "#f97316" },
    { name: "Transportasi", type: "expense", icon: "🚗", color: "#3b82f6" },
    { name: "Belanja", type: "expense", icon: "🛍️", color: "#ec4899" },
    { name: "Hiburan", type: "expense", icon: "🎬", color: "#8b5cf6" },
    { name: "Kesehatan", type: "expense", icon: "💊", color: "#10b981" },
    { name: "Tagihan", type: "expense", icon: "📄", color: "#64748b" },
    { name: "Gaji", type: "income", icon: "💰", color: "#22c55e" },
    { name: "Investasi", type: "income", icon: "📈", color: "#0ea5e9" },
    { name: "Bonus", type: "income", icon: "🎁", color: "#f43f5e" },
    { name: "Lainnya", type: "expense", icon: "📦", color: "#6b7280" },
]

async function fetchCategories(): Promise<Category[]> {
    const res = await fetch("/api/categories")
    const data = await res.json()
    if (data.success) {
        return data.data.map((c: Category) => ({
            ...c,
            createdAt: new Date(c.createdAt),
        }))
    }
    return []
}

async function fetchTransactions(): Promise<Transaction[]> {
    const res = await fetch("/api/transactions")
    const data = await res.json()
    if (data.success) {
        return data.data.map((t: Transaction) => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt),
        }))
    }
    return []
}

export function useFinance() {
    const [categories, setCategories] = useState<Category[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("month")
    const [filterType, setFilterType] = useState<FilterType>("all")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [isLoading, setIsLoading] = useState(true)

    const loadData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [cats, trans] = await Promise.all([
                fetchCategories(),
                fetchTransactions(),
            ])

            if (cats.length === 0) {
                for (const cat of defaultCategories) {
                    await fetch("/api/categories", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(cat),
                    })
                }
                const newCats = await fetchCategories()
                setCategories(newCats)
            } else {
                setCategories(cats)
            }

            setTransactions(trans)
        } catch (error) {
            console.error("Error loading data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    const addCategory = useCallback(async (category: Omit<Category, "id" | "createdAt">) => {
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(category),
            })
            const data = await res.json()
            if (data.success) {
                setCategories((prev) => [{ ...data.data, createdAt: new Date(data.data.createdAt) }, ...prev])
                return data.data
            }
        } catch (error) {
            console.error("Error adding category:", error)
        }
    }, [])

    const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
        try {
            await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })
            setCategories((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
            )
        } catch (error) {
            console.error("Error updating category:", error)
        }
    }, [])

    const deleteCategory = useCallback(async (id: string) => {
        try {
            await fetch(`/api/categories/${id}`, { method: "DELETE" })
            setCategories((prev) => prev.filter((c) => c.id !== id))
        } catch (error) {
            console.error("Error deleting category:", error)
        }
    }, [])

    const addTransaction = useCallback(async (transaction: {
        categoryId: string
        amount: number
        type: TransactionType
        description: string
        date: Date
    }) => {
        try {
            const res = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            })
            const data = await res.json()
            if (data.success) {
                const category = categories.find((c) => c.id === transaction.categoryId)
                const newTransaction = {
                    ...data.data,
                    date: new Date(data.data.date || transaction.date),
                    createdAt: new Date(data.data.createdAt),
                    category,
                }
                setTransactions((prev) => [newTransaction, ...prev])
                return newTransaction
            }
        } catch (error) {
            console.error("Error adding transaction:", error)
        }
    }, [categories])

    const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
        try {
            await fetch(`/api/transactions/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            })
            setTransactions((prev) =>
                prev.map((t) => {
                    if (t.id === id) {
                        const category = updates.categoryId
                            ? categories.find((c) => c.id === updates.categoryId)
                            : t.category
                        return { ...t, ...updates, category }
                    }
                    return t
                })
            )
        } catch (error) {
            console.error("Error updating transaction:", error)
        }
    }, [categories])

    const deleteTransaction = useCallback(async (id: string) => {
        try {
            await fetch(`/api/transactions/${id}`, { method: "DELETE" })
            setTransactions((prev) => prev.filter((t) => t.id !== id))
        } catch (error) {
            console.error("Error deleting transaction:", error)
        }
    }, [])

    const transactionsWithCategory = transactions.map((t) => ({
        ...t,
        category: categories.find((c) => c.id === t.categoryId),
    }))

    const filteredByPeriod = filterTransactionsByPeriod(
        transactionsWithCategory,
        filterPeriod,
        selectedDate
    )

    // Filter berdasarkan tipe transaksi
    const filteredTransactions = filterType === "all" 
        ? filteredByPeriod
        : filteredByPeriod.filter((t) => t.type === filterType)

    const summary = calculateSummary(filteredTransactions)

    return {
        categories,
        transactions: transactionsWithCategory,
        filteredTransactions,
        summary,
        filterPeriod,
        filterType,
        selectedDate,
        isLoading,
        setFilterPeriod,
        setFilterType,
        setSelectedDate,
        addCategory,
        updateCategory,
        deleteCategory,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshData: loadData,
    }
}
