"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Wallet, Receipt, Eye, EyeOff, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FinanceSummary } from "@/types/finance"
import { formatCurrency } from "@/lib/finance"
import { cn } from "@/lib/utils"

interface SummaryCardsProps {
    summary: FinanceSummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
    const [showBalance, setShowBalance] = useState(false)
    const [showIncome, setShowIncome] = useState(false)
    const [showExpense, setShowExpense] = useState(false)

    const smallCards = [
        {
            title: "Pemasukan",
            value: summary.totalIncome,
            icon: TrendingUp,
            positive: true,
            show: showIncome,
            setShow: setShowIncome,
            bgClass: "bg-emerald-50/50 dark:bg-emerald-900/20",
            iconClass: "text-emerald-600 dark:text-emerald-400",
        },
        {
            title: "Pengeluaran",
            value: summary.totalExpense,
            icon: TrendingDown,
            positive: false,
            show: showExpense,
            setShow: setShowExpense,
            bgClass: "bg-rose-50/50 dark:bg-rose-900/20",
            iconClass: "text-rose-600 dark:text-rose-400",
        },
        {
            title: "Transaksi",
            value: summary.transactionCount,
            icon: Receipt,
            positive: true,
            isCount: true,
            bgClass: "bg-blue-50/50 dark:bg-blue-900/20",
            iconClass: "text-blue-600 dark:text-blue-400",
        },
    ]

    return (
        <div className="space-y-6">
            <Card className="border-none bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm overflow-hidden relative">
                <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Sparkles className="h-24 w-24 text-primary rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Total Tabungan
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full hover:bg-primary/20"
                                onClick={() => setShowBalance(!showBalance)}
                            >
                                {showBalance ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        <p className={cn(
                            "text-4xl lg:text-5xl font-bold tracking-tight mb-2 transition-all duration-500",
                            summary.balance >= 0 ? "text-primary" : "text-destructive"
                        )}>
                            {showBalance ? formatCurrency(summary.balance) : "••••••••••"}
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                            "Simpan sedikit demi sedikit, lama-lama menjadi bukit ⛰️"
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {smallCards.map((card) => (
                    <Card
                        key={card.title}
                        className={cn(
                            "border-none shadow-sm hover:shadow-md transition-all duration-300",
                            card.bgClass
                        )}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
                                <div className={cn("p-2 rounded-full bg-white/50 dark:bg-black/20", card.iconClass)}>
                                    <card.icon className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-foreground">
                                    {card.isCount
                                        ? card.value
                                        : (card.show ? formatCurrency(card.value) : "••••••••")
                                    }
                                </p>
                                {!card.isCount && card.setShow && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 p-0 opacity-50 hover:opacity-100 hover:bg-transparent"
                                        onClick={() => card.setShow!(!card.show)}
                                    >
                                        {card.show ? (
                                            <Eye className="h-3.5 w-3.5" />
                                        ) : (
                                            <EyeOff className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
