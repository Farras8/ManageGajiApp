"use client"

import { useMemo } from "react"
import { Transaction } from "@/types/finance"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/finance"
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"
import { id } from "date-fns/locale"

interface FinanceChartsProps {
    transactions: Transaction[]
}

export function FinanceCharts({ transactions }: FinanceChartsProps) {
    const barChartData = useMemo(() => {
        const groupedByDate = transactions.reduce((acc, transaction) => {
            const dateKey = format(new Date(transaction.date), "dd MMM", { locale: id })
            
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, pemasukan: 0, pengeluaran: 0 }
            }
            
            if (transaction.type === "income") {
                acc[dateKey].pemasukan += transaction.amount
            } else {
                acc[dateKey].pengeluaran += transaction.amount
            }
            
            return acc
        }, {} as Record<string, { date: string; pemasukan: number; pengeluaran: number }>)

        return Object.values(groupedByDate).sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA.getTime() - dateB.getTime()
        }).slice(-10)
    }, [transactions])

    const donutChartData = useMemo(() => {
        const categoryTotals = transactions
            .filter((t) => t.type === "expense")
            .reduce((acc, transaction) => {
                const categoryName = transaction.category?.name || "Lainnya"
                const categoryColor = transaction.category?.color || "#6b7280"
                
                if (!acc[categoryName]) {
                    acc[categoryName] = {
                        name: categoryName,
                        value: 0,
                        color: categoryColor,
                    }
                }
                
                acc[categoryName].value += transaction.amount
                
                return acc
            }, {} as Record<string, { name: string; value: number; color: string }>)

        return Object.values(categoryTotals).sort((a, b) => b.value - a.value)
    }, [transactions])

    const totalExpense = useMemo(() => {
        return donutChartData.reduce((sum, item) => sum + item.value, 0)
    }, [donutChartData])

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold mb-1">{payload[0].payload.date}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const percentage = ((payload[0].value / totalExpense) * 100).toFixed(1)
            return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-semibold mb-1">{payload[0].name}</p>
                    <p className="text-xs text-emerald-500">
                        {formatCurrency(payload[0].value)}
                    </p>
                    <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
            )
        }
        return null
    }

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        if (percent < 0.05) return null
        
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    if (transactions.length === 0) {
        return (
            <Card className="border-gold/20">
                <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Belum ada data untuk ditampilkan</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="lg:col-span-2 border-gold/20">
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="text-lg md:text-xl font-bold">Tren Keuangan</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">Perbandingan pemasukan & pengeluaran</p>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                stroke="hsl(var(--border))"
                            />
                            <YAxis 
                                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                                stroke="hsl(var(--border))"
                                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }} />
                            <Legend 
                                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                                iconType="circle"
                            />
                            <Bar 
                                dataKey="pemasukan" 
                                fill="#10b981" 
                                radius={[8, 8, 0, 0]}
                                name="Pemasukan"
                            />
                            <Bar 
                                dataKey="pengeluaran" 
                                fill="#ef4444" 
                                radius={[8, 8, 0, 0]}
                                name="Pengeluaran"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-gold/20">
                <CardHeader className="px-4 md:px-6">
                    <CardTitle className="text-lg md:text-xl font-bold">Alokasi Pengeluaran</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">Distribusi per kategori</p>
                </CardHeader>
                <CardContent className="px-2 md:px-6">
                    {donutChartData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={donutChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomLabel}
                                        outerRadius={80}
                                        innerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {donutChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomPieTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {donutChartData.slice(0, 5).map((item, index) => {
                                    const percentage = ((item.value / totalExpense) * 100).toFixed(1)
                                    return (
                                        <div key={index} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <div 
                                                    className="w-3 h-3 rounded-full shrink-0" 
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </div>
                                            <span className="font-semibold text-muted-foreground shrink-0 ml-2">
                                                {percentage}%
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-[240px]">
                            <p className="text-sm text-muted-foreground">Belum ada pengeluaran</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
