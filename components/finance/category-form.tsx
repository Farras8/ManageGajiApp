"use client"

import { useState, useEffect } from "react"
import { Category, TransactionType } from "@/types/finance"
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
import { cn } from "@/lib/utils"

const iconOptions = ["🍔", "🚗", "🛍️", "🎬", "💊", "📚", "📄", "💰", "📈", "🎁", "💼", "🏠", "✈️", "💡", "📱", "🎮", "👕", "💇", "🐕", "📦"]
const colorOptions = ["#f97316", "#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#64748b", "#22c55e", "#0ea5e9", "#f43f5e"]

interface CategoryFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category?: Category | null
    onSubmit: (data: {
        name: string
        type: TransactionType
        icon: string
        color: string
    }) => void
}

export function CategoryForm({
    open,
    onOpenChange,
    category,
    onSubmit,
}: CategoryFormProps) {
    const [name, setName] = useState("")
    const [type, setType] = useState<TransactionType>("expense")
    const [icon, setIcon] = useState(iconOptions[0])
    const [color, setColor] = useState(colorOptions[0])

    useEffect(() => {
        if (category) {
            setName(category.name)
            setType(category.type)
            setIcon(category.icon)
            setColor(category.color)
        } else {
            setName("")
            setType("expense")
            setIcon(iconOptions[0])
            setColor(colorOptions[0])
        }
    }, [category, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        onSubmit({ name: name.trim(), type, icon, color })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {category ? "Edit Kategori" : "Tambah Kategori"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                value="expense"
                                className={cn(
                                    "data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700",
                                    "dark:data-[state=active]:bg-rose-900/30 dark:data-[state=active]:text-rose-400"
                                )}
                            >
                                💸 Pengeluaran
                            </TabsTrigger>
                            <TabsTrigger
                                value="income"
                                className={cn(
                                    "data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700",
                                    "dark:data-[state=active]:bg-emerald-900/30 dark:data-[state=active]:text-emerald-400"
                                )}
                            >
                                💰 Pemasukan
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Kategori</Label>
                        <Input
                            id="name"
                            placeholder="Contoh: Makan & Minum"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Ikon</Label>
                        <div className="grid grid-cols-10 gap-2">
                            {iconOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setIcon(opt)}
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all",
                                        icon === opt
                                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                            : "bg-muted hover:bg-accent"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Warna</Label>
                        <div className="grid grid-cols-10 gap-2">
                            {colorOptions.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setColor(opt)}
                                    className={cn(
                                        "w-9 h-9 rounded-full transition-all",
                                        color === opt && "ring-2 ring-offset-2 ring-primary"
                                    )}
                                    style={{ backgroundColor: opt }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                            style={{ backgroundColor: `${color}30` }}
                        >
                            {icon}
                        </div>
                        <div>
                            <p className="font-semibold">{name || "Nama Kategori"}</p>
                            <p className="text-sm text-muted-foreground">
                                {type === "income" ? "Pemasukan" : "Pengeluaran"}
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            {category ? "Simpan" : "Tambah"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
