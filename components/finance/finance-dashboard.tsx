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
        selectedDate,
        isLoading,
        setFilterPeriod,
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

            <main className="container py-6 lg:py-8 space-y-6 lg:space-y-8">
                <SummaryCards summary={summary} />

                <PeriodFilter
                    period={filterPeriod}
                    selectedDate={selectedDate}
                    onPeriodChange={setFilterPeriod}
                    onDateChange={setSelectedDate}
                />

                <div className="grid lg:grid-cols-3 gap-6 items-stretch">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xl font-bold">Transaksi</CardTitle>
                            <Button onClick={() => {
                                setEditingTransaction(null)
                                setShowTransactionForm(true)
                            }}>
                                <Plus className="h-4 w-4 mr-1" />
                                Tambah
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <TransactionList
                                transactions={filteredTransactions}
                                onEdit={handleEditTransaction}
                                onDelete={handleDeleteTransaction}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xl font-bold">Kategori</CardTitle>
                            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="h-4 w-4" />
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
                        <CardContent>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.slice(0, 8).map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-gold/10 hover:border-gold/30 transition-colors"
                                    >
                                        <span>{category.icon}</span>
                                        <span className="text-sm truncate">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                            {categories.length > 8 && (
                                <Button
                                    variant="link"
                                    className="w-full mt-2 text-gold"
                                    onClick={() => setShowSettings(true)}
                                >
                                    Lihat semua ({categories.length})
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
