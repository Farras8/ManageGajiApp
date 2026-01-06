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
            <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted flex items-center justify-center mb-3 md:mb-4">
                    <span className="text-2xl md:text-3xl">📝</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">Belum ada transaksi</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
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
        <ScrollArea className="h-[400px] md:h-[500px] pr-2 md:pr-4">
            <div className="space-y-4 md:space-y-6">
                {sortedDates.map((dateKey) => (
                    <div key={dateKey}>
                        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-1.5 md:py-2">
                            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground">
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
        <div className="group rounded-lg md:rounded-xl bg-card border hover:shadow-md transition-all duration-200">
            {/* Main content - horizontal layout */}
            <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
                <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-base md:text-xl shrink-0"
                    style={{ backgroundColor: `${transaction.category?.color}20` }}
                >
                    {transaction.category?.icon || "📦"}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
                        <span className="font-semibold text-sm md:text-base truncate">
                            {transaction.category?.name || "Tanpa Kategori"}
                        </span>
                        <Badge variant={isIncome ? "income" : "expense"} className="shrink-0 text-xs">
                            {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </Badge>
                    </div>
                    {transaction.description && (
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {transaction.description}
                        </p>
                    )}
                </div>

                <div className="text-right shrink-0">
                    <p className={cn(
                        "font-bold text-sm md:text-lg whitespace-nowrap",
                        isIncome ? "text-emerald-600" : "text-rose-600"
                    )}>
                        {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                    </p>
                </div>

                {/* Action buttons for desktop - tetap di samping */}
                <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* Action buttons for mobile - di bawah */}
            <div className="flex md:hidden items-center justify-end gap-1 px-3 pb-3 pt-0 border-t border-border/50 mt-0">
                {onEdit && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex-1"
                        onClick={() => onEdit(transaction)}
                    >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Edit
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs flex-1 text-destructive hover:text-destructive"
                        onClick={() => onDelete(transaction.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Hapus
                    </Button>
                )}
            </div>
        </div>
    )
}
