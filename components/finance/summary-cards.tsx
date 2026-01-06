"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Wallet, Receipt, Eye, EyeOff } from "lucide-react"
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
            gradient: "from-emerald-500 via-green-500 to-emerald-600",
            iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
            show: showIncome,
            setShow: setShowIncome,
        },
        {
            title: "Pengeluaran",
            value: summary.totalExpense,
            icon: TrendingDown,
            positive: false,
            gradient: "from-rose-500 via-red-500 to-rose-600",
            iconBg: "bg-gradient-to-br from-rose-400 to-red-600",
            show: showExpense,
            setShow: setShowExpense,
        },
        {
            title: "Transaksi",
            value: summary.transactionCount,
            icon: Receipt,
            positive: true,
            gradient: "from-blue-500 via-indigo-500 to-blue-600",
            iconBg: "bg-gradient-to-br from-blue-400 to-indigo-600",
            isCount: true,
        },
    ]

    return (
        <div className="space-y-4">
            <Card className="border-gold/20 bg-gradient-to-br from-card to-card/80 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600" />
                <CardContent className="p-6 lg:p-8 relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg">
                                <Wallet className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-muted-foreground font-medium">Total Saldo</p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 hover:bg-gold/10"
                                        onClick={() => setShowBalance(!showBalance)}
                                    >
                                        {showBalance ? (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                                <p className={cn(
                                    "text-3xl lg:text-4xl font-bold",
                                    summary.balance >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {showBalance ? formatCurrency(summary.balance) : "••••••••••"}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4">
                {smallCards.map((card) => (
                    <Card
                        key={card.title}
                        className="border-gold/20 bg-gradient-to-br from-card to-card/80 overflow-hidden relative"
                    >
                        <div className={cn(
                            "absolute inset-0 opacity-5 bg-gradient-to-br",
                            card.gradient
                        )} />
                        <CardContent className="p-4 lg:p-5 relative">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2.5 rounded-xl shadow-lg shrink-0",
                                    card.iconBg
                                )}>
                                    <card.icon className="h-5 w-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <p className="text-xs lg:text-sm text-muted-foreground font-medium">{card.title}</p>
                                        {!card.isCount && card.setShow && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 hover:bg-gold/10"
                                                onClick={() => card.setShow(!card.show)}
                                            >
                                                {card.show ? (
                                                    <Eye className="h-3 w-3 text-muted-foreground" />
                                                ) : (
                                                    <EyeOff className="h-3 w-3 text-muted-foreground" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "text-base lg:text-xl font-bold truncate",
                                        card.isCount ? "text-blue-500" : card.positive ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        {card.isCount
                                            ? card.value
                                            : (card.show ? formatCurrency(card.value) : "••••••••")
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
