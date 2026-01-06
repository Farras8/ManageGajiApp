"use client"

import { useState } from "react"
import { Plus, Settings } from "lucide-react"
import { useFinance } from "@/hooks/use-finance"
import { Transaction, Category } from "@/types/finance"
import { Header } from "@/components/layout/header"
import { SummaryCards } from "@/components/finance/summary-cards"
import { TransactionList } from "@/components/finance/transaction-list"
import { TransactionForm } from "@/components/finance/transaction-form"
import { PeriodFilter } from "@/components/finance/period-filter"
import { CategoryForm } from "@/components/finance/category-form"
import { CategoryList } from "@/components/finance/category-list"
import { FinanceCharts } from "@/components/finance/finance-charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function FinanceDashboard() {
    const {
        categories,
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
    } = useFinance()

    const { toast } = useToast()
    const [showTransactionForm, setShowTransactionForm] = useState(false)
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const handleAddTransaction = (data: Parameters<typeof addTransaction>[0]) => {
        addTransaction(data)
        toast({
            title: "Berhasil!",
            description: "Transaksi berhasil ditambahkan",
        })
    }

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction)
        setShowTransactionForm(true)
    }

    const handleUpdateTransaction = (data: Parameters<typeof addTransaction>[0]) => {
        if (editingTransaction) {
            updateTransaction(editingTransaction.id, data)
            setEditingTransaction(null)
            toast({
                title: "Berhasil!",
                description: "Transaksi berhasil diperbarui",
            })
        }
    }

    const handleDeleteTransaction = (id: string) => {
        deleteTransaction(id)
        toast({
            title: "Dihapus",
            description: "Transaksi berhasil dihapus",
        })
    }

    const handleAddCategory = (data: Parameters<typeof addCategory>[0]) => {
        addCategory(data)
        toast({
            title: "Berhasil!",
            description: "Kategori berhasil ditambahkan",
        })
    }

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setShowCategoryForm(true)
    }

    const handleUpdateCategory = (data: Parameters<typeof addCategory>[0]) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, data)
            setEditingCategory(null)
            toast({
                title: "Berhasil!",
                description: "Kategori berhasil diperbarui",
            })
        }
    }

    const handleDeleteCategory = (id: string) => {
        deleteCategory(id)
        toast({
            title: "Dihapus",
            description: "Kategori berhasil dihapus",
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background" suppressHydrationWarning>
                <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
                    <div className="w-12 h-12 rounded-full bg-gold-gradient animate-pulse" suppressHydrationWarning />
                    <p className="text-muted-foreground">Memuat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-4 md:py-6 lg:py-8 space-y-4 md:space-y-6 lg:space-y-8 px-4">
                <SummaryCards summary={summary} />

                <PeriodFilter
                    period={filterPeriod}
                    selectedDate={selectedDate}
                    filterType={filterType}
                    onPeriodChange={setFilterPeriod}
                    onDateChange={setSelectedDate}
                    onFilterTypeChange={setFilterType}
                />

                <div className="grid lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4 px-4 md:px-6">
                            <CardTitle className="text-lg md:text-xl font-bold">Transaksi</CardTitle>
                            <Button 
                                onClick={() => {
                                    setEditingTransaction(null)
                                    setShowTransactionForm(true)
                                }}
                                size="sm"
                                className="h-8 md:h-10"
                            >
                                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1" />
                                <span className="hidden sm:inline">Tambah</span>
                                <span className="sm:hidden text-xs">+</span>
                            </Button>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <TransactionList
                                transactions={filteredTransactions}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteTransaction}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 md:pb-4 px-4 md:px-6">
                            <CardTitle className="text-lg md:text-xl font-bold">Kategori</CardTitle>
                            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                                        <Settings className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Kelola Kategori</DialogTitle>
                                    </DialogHeader>
                                    <CategoryList
                                        categories={categories}
                                        onAdd={() => {
                                            setEditingCategory(null)
                                            setShowCategoryForm(true)
                                        }}
                                        onEdit={handleEditCategory}
                                        onDelete={handleDeleteCategory}
                                    />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <div className="grid grid-cols-2 gap-2">
                                {categories.slice(0, 8).map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center gap-1.5 md:gap-2 p-2 rounded-lg bg-muted/50 border border-gold/10 hover:border-gold/30 transition-colors"
                                    >
                                        <span className="text-sm md:text-base">{category.icon}</span>
                                        <span className="text-xs md:text-sm truncate">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                            {categories.length > 8 && (
                                <Button
                                    variant="link"
                                    className="w-full mt-2 text-gold text-xs md:text-sm"
                                    onClick={() => setShowSettings(true)}
                                >
                                    Lihat semua ({categories.length})
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <FinanceCharts transactions={filteredTransactions} />
            </main>

            <TransactionForm
                open={showTransactionForm}
                onOpenChange={(open) => {
                    setShowTransactionForm(open)
                    if (!open) setEditingTransaction(null)
                }}
                categories={categories}
                transaction={editingTransaction}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
            />

            <CategoryForm
                open={showCategoryForm}
                onOpenChange={(open) => {
                    setShowCategoryForm(open)
                    if (!open) setEditingCategory(null)
                }}
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
            />
        </div>
    )
}
