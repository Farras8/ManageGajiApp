"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Trash2, Pencil } from "lucide-react"
import { Transaction } from "@/types/finance"
import { formatCurrency } from "@/lib/finance"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TransactionListProps {
    transactions: Transaction[]
    onEdit?: (transaction: Transaction) => void
    onDelete?: (id: string) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Belum ada transaksi</h3>
                <p className="text-muted-foreground text-sm">
                    Mulai catat pemasukan dan pengeluaran Anda
                </p>
            </div>
        )
    }

    const groupedByDate = transactions.reduce((groups, transaction) => {
        const dateKey = format(new Date(transaction.date), "yyyy-MM-dd")
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].push(transaction)
        return groups
    }, {} as Record<string, Transaction[]>)

    const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    )

    return (
        <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
                {sortedDates.map((dateKey) => (
                    <div key={dateKey}>
                        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">
                                {format(new Date(dateKey), "EEEE, d MMMM yyyy", { locale: id })}
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {groupedByDate[dateKey].map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

interface TransactionItemProps {
    transaction: Transaction
    onEdit?: (transaction: Transaction) => void
    onDelete?: (id: string) => void
}

function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
    const isIncome = transaction.type === "income"

    return (
        <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-md transition-all duration-200">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${transaction.category?.color}20` }}
            >
                {transaction.category?.icon || "📦"}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">
                        {transaction.category?.name || "Tanpa Kategori"}
                    </span>
                    <Badge variant={isIncome ? "income" : "expense"} className="shrink-0">
                        {isIncome ? "Pemasukan" : "Pengeluaran"}
                    </Badge>
                </div>
                {transaction.description && (
                    <p className="text-sm text-muted-foreground truncate">
                        {transaction.description}
                    </p>
                )}
            </div>

            <div className="text-right shrink-0">
                <p className={cn(
                    "font-bold text-lg",
                    isIncome ? "text-emerald-600" : "text-rose-600"
                )}>
                    {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(transaction)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(transaction.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
