"use client"

import { useState, useEffect } from "react"
import { Category, Transaction, TransactionType } from "@/types/finance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomDatePicker } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface TransactionFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    categories: Category[]
    transaction?: Transaction | null
    onSubmit: (data: {
        categoryId: string
        amount: number
        type: TransactionType
        description: string
        date: Date
    }) => void
}

export function TransactionForm({
    open,
    onOpenChange,
    categories,
    transaction,
    onSubmit,
}: TransactionFormProps) {
    const [type, setType] = useState<TransactionType>("expense")
    const [categoryId, setCategoryId] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Date>(new Date())

    useEffect(() => {
        if (transaction) {
            setType(transaction.type)
            setCategoryId(transaction.categoryId)
            setAmount(transaction.amount.toString())
            setDescription(transaction.description)
            setDate(new Date(transaction.date))
        } else {
            setType("expense")
            setCategoryId("")
            setAmount("")
            setDescription("")
            setDate(new Date())
        }
    }, [transaction, open])

    const filteredCategories = categories.filter((c) => c.type === type)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!categoryId || !amount || parseFloat(amount) <= 0) return

        onSubmit({
            categoryId,
            amount: parseFloat(amount),
            type,
            description,
            date,
        })
        onOpenChange(false)
    }

    const handleAmountChange = (value: string) => {
        const cleaned = value.replace(/[^0-9]/g, "")
        setAmount(cleaned)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl">
                        {transaction ? "Edit Transaksi" : "Tambah Transaksi"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <Tabs value={type} onValueChange={(v) => {
                        setType(v as TransactionType)
                        setCategoryId("")
                    }}>
                        <TabsList className="grid w-full grid-cols-2 h-9 md:h-10">
                            <TabsTrigger
                                value="expense"
                                className={cn(
                                    "text-xs md:text-sm data-[state=active]:bg-rose-500 data-[state=active]:text-white",
                                    "dark:data-[state=active]:bg-rose-600 dark:data-[state=active]:text-white"
                                )}
                            >
                                💸 Pengeluaran
                            </TabsTrigger>
                            <TabsTrigger
                                value="income"
                                className={cn(
                                    "text-xs md:text-sm data-[state=active]:bg-emerald-500 data-[state=active]:text-white",
                                    "dark:data-[state=active]:bg-emerald-600 dark:data-[state=active]:text-white"
                                )}
                            >
                                💰 Pemasukan
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm">Jumlah (Rp)</Label>
                        <Input
                            id="amount"
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            value={amount ? parseInt(amount).toLocaleString("id-ID") : ""}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="text-xl md:text-2xl font-bold h-12 md:h-14"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm">Kategori</Label>
                        <Select value={categoryId} onValueChange={setCategoryId} required>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        <span className="flex items-center gap-2">
                                            <span>{category.icon}</span>
                                            <span>{category.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm">Tanggal</Label>
                        <CustomDatePicker
                            date={date}
                            onDateChange={(d) => d && setDate(d)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm">Keterangan (Opsional)</Label>
                        <Input
                            id="description"
                            placeholder="Tambahkan keterangan..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant={type === "income" ? "success" : "destructive"}
                            disabled={!categoryId || !amount}
                            className="w-full sm:w-auto"
                        >
                            {transaction ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
