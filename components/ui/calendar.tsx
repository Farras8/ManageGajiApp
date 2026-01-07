"use client"

import * as React from "react"
import DatePicker from "react-datepicker"
import { id } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import "react-datepicker/dist/react-datepicker.css"

interface CustomDatePickerProps {
    date?: Date
    onDateChange?: (date: Date | undefined) => void
    placeholder?: string
    className?: string
}

function CustomDatePicker({
    date,
    onDateChange,
    placeholder = "Pilih tanggal",
    className
}: CustomDatePickerProps) {
    return (
        <div className={cn("relative w-full", className)}>
            <DatePicker
                selected={date}
                onChange={(date: Date | null) => onDateChange?.(date || undefined)}
                dateFormat="d MMMM yyyy"
                locale={id}
                placeholderText={placeholder}
                className="flex h-11 w-full rounded-full border border-input bg-background px-4 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                showPopperArrow={false}
                wrapperClassName="w-full"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
    )
}

export { CustomDatePicker }
