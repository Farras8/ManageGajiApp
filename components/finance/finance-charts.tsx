"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction, Category } from "@/types/finance"
import { formatCurrency } from "@/lib/finance"

interface FinanceChartsProps {
    transactions: Transaction[]
    categories: Category[]
}

export function FinanceCharts({ transactions, categories }: FinanceChartsProps) {


    const incomeTotal = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const expenseTotal = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const barData = [
        { name: 'Pemasukan', amount: incomeTotal, fill: 'var(--chart-1)' },
        { name: 'Pengeluaran', amount: expenseTotal, fill: 'var(--chart-2)' },
    ]


    const expenseTransactions = transactions.filter(t => t.type === 'expense')
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
        const catName = categories.find(c => c.id === t.categoryId)?.name || 'Unknown'
        acc[catName] = (acc[catName] || 0) + t.amount
        return acc
    }, {} as Record<string, number>)

    const pieData = Object.entries(categoryTotals)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)


    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-popover border border-border rounded-xl p-3 shadow-lg">
                    <p className="font-medium mb-1 text-popover-foreground">{label || payload[0].name}</p>
                    <p className="text-sm text-primary font-bold">{formatCurrency(payload[0].value)}</p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Card className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                    <CardTitle>Arus Kas Bulan Ini</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.fill}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                    <CardTitle>Top Pengeluaran</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full relative">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`var(--chart-${(index % 5) + 1})`}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground font-medium">
                                Belum ada data pengeluaran 🍃
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
