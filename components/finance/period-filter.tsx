"use client"

import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { FilterPeriod } from "@/types/finance"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomDatePicker } from "@/components/ui/calendar"

interface PeriodFilterProps {
    period: FilterPeriod
    selectedDate: Date
    onPeriodChange: (period: FilterPeriod) => void
    onDateChange: (date: Date) => void
}

export function PeriodFilter({
    period,
    selectedDate,
    onPeriodChange,
    onDateChange,
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
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Tabs value={period} onValueChange={(v) => onPeriodChange(v as FilterPeriod)}>
                    <TabsList className="grid w-full grid-cols-4 sm:w-auto sm:inline-flex">
                        <TabsTrigger value="day" className="text-foreground data-[state=inactive]:text-foreground/70">
                            Hari
                        </TabsTrigger>
                        <TabsTrigger value="week" className="text-foreground data-[state=inactive]:text-foreground/70">
                            Minggu
                        </TabsTrigger>
                        <TabsTrigger value="month" className="text-foreground data-[state=inactive]:text-foreground/70">
                            Bulan
                        </TabsTrigger>
                        <TabsTrigger value="all" className="text-foreground data-[state=inactive]:text-foreground/70">
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
                        className="shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
                        <Calendar className="h-4 w-4 text-gold shrink-0" />
                        <span className="font-medium text-sm lg:text-base text-foreground truncate">{getDateLabel()}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        className="shrink-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleToday}
                        className="shrink-0 hidden sm:flex"
                    >
                        Hari Ini
                    </Button>
                </div>
            )}
        </div>
    )
}
