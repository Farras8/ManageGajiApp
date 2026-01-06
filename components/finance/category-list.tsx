"use client"

import { Trash2, Pencil, Plus } from "lucide-react"
import { Category } from "@/types/finance"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface CategoryListProps {
    categories: Category[]
    onAdd?: () => void
    onEdit?: (category: Category) => void
    onDelete?: (id: string) => void
}

export function CategoryList({ categories, onAdd, onEdit, onDelete }: CategoryListProps) {
    const incomeCategories = categories.filter((c) => c.type === "income")
    const expenseCategories = categories.filter((c) => c.type === "expense")

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Kategori</h3>
                {onAdd && (
                    <Button size="sm" onClick={onAdd}>
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah
                    </Button>
                )}
            </div>

            <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Pemasukan
                        </h4>
                        <div className="space-y-2">
                            {incomeCategories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                            {incomeCategories.length === 0 && (
                                <p className="text-sm text-muted-foreground py-2">
                                    Belum ada kategori pemasukan
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Pengeluaran
                        </h4>
                        <div className="space-y-2">
                            {expenseCategories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                            {expenseCategories.length === 0 && (
                                <p className="text-sm text-muted-foreground py-2">
                                    Belum ada kategori pengeluaran
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

interface CategoryItemProps {
    category: Category
    onEdit?: (category: Category) => void
    onDelete?: (id: string) => void
}

function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
    return (
        <div className="group flex items-center gap-3 p-3 rounded-lg bg-card border hover:shadow-sm transition-all">
            <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: `${category.color}20` }}
            >
                {category.icon}
            </div>

            <div className="flex-1 min-w-0">
                <span className="font-medium truncate block">{category.name}</span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEdit(category)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDelete(category.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}
