"use client"

import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import { FilterPeriod, FilterType } from "@/types/finance"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomDatePicker } from "@/components/ui/calendar"

interface PeriodFilterProps {
    period: FilterPeriod
    selectedDate: Date
    filterType: FilterType
    onPeriodChange: (period: FilterPeriod) => void
    onDateChange: (date: Date) => void
    onFilterTypeChange: (type: FilterType) => void
}

export function PeriodFilter({
    period,
    selectedDate,
    filterType,
    onPeriodChange,
    onDateChange,
    onFilterTypeChange,
}: PeriodFilterProps) {
    const handlePrevious = () => {
        switch (period) {
            case "day":
                onDateChange(subDays(selectedDate, 1))
                break
            case "week":
                onDateChange(subWeeks(selectedDate, 1))
                break
            case "month":
                onDateChange(subMonths(selectedDate, 1))
                break
        }
    }

    const handleNext = () => {
        switch (period) {
            case "day":
                onDateChange(addDays(selectedDate, 1))
                break
            case "week":
                onDateChange(addWeeks(selectedDate, 1))
                break
            case "month":
                onDateChange(addMonths(selectedDate, 1))
                break
        }
    }

    const handleToday = () => {
        onDateChange(new Date())
    }

    const getDateLabel = () => {
        switch (period) {
            case "day":
                return format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })
            case "week":
                return `Minggu ke-${format(selectedDate, "w")} - ${format(selectedDate, "MMMM yyyy", { locale: id })}`
            case "month":
                return format(selectedDate, "MMMM yyyy", { locale: id })
            case "all":
                return "Semua Waktu"
        }
    }

    return (
        <div className="space-y-3 md:space-y-4">
            {/* Filter Tipe Transaksi */}
            <div className="flex items-center justify-center">
                <Tabs value={filterType} onValueChange={(v) => onFilterTypeChange(v as FilterType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-9 md:h-10">
                        <TabsTrigger 
                            value="all" 
                            className="text-xs md:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                        >
                            <Wallet className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
                            Semua
                        </TabsTrigger>
                        <TabsTrigger 
                            value="income" 
                            className="text-xs md:text-sm data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                        >
                            <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
                            Pemasukan
                        </TabsTrigger>
                        <TabsTrigger 
                            value="expense" 
                            className="text-xs md:text-sm data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                        >
                            <TrendingDown className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
                            Pengeluaran
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                <Tabs value={period} onValueChange={(v) => onPeriodChange(v as FilterPeriod)}>
                    <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex h-9">
                        <TabsTrigger value="day" className="text-xs md:text-sm text-foreground data-[state=inactive]:text-foreground/70">
                            Hari
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-xs md:text-sm text-foreground data-[state=inactive]:text-foreground/70">
                            Minggu
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-xs md:text-sm text-foreground data-[state=inactive]:text-foreground/70">
                            Bulan
                        </TabsTrigger>
                        <TabsTrigger value="all" className="text-xs md:text-sm text-foreground data-[state=inactive]:text-foreground/70">
                            Semua
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="w-full sm:w-56">
                    <CustomDatePicker
                        date={selectedDate}
                        onDateChange={(date) => date && onDateChange(date)}
                        placeholder="Pilih tanggal"
                    />
                </div>
            </div>

            {period !== "all" && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevious}
                        className="shrink-0 h-8 w-8 md:h-10 md:w-10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1.5 md:gap-2 flex-1 justify-center min-w-0 px-2">
                        <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-gold shrink-0" />
                        <span className="font-medium text-xs md:text-sm lg:text-base text-foreground truncate">{getDateLabel()}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        className="shrink-0 h-8 w-8 md:h-10 md:w-10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToday}
                        className="shrink-0 text-xs md:text-sm h-8 md:h-10"
                    >
                        <span className="hidden sm:inline">Hari Ini</span>
                        <span className="sm:hidden">Hari ini</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
