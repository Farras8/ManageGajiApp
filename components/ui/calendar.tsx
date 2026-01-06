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
                className="flex h-11 w-full rounded-lg border-2 border-gold/30 bg-background px-4 py-2 pl-10 text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                calendarClassName="!bg-card !border-gold/30 !rounded-xl !shadow-xl !font-sans"
                dayClassName={() => "!text-foreground hover:!bg-gold/20 !rounded-md"}
                weekDayClassName={() => "!text-muted-foreground"}
                monthClassName={() => "!text-foreground"}
                showPopperArrow={false}
                popperClassName="react-datepicker-dark"
                wrapperClassName="w-full"
            />
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold pointer-events-none" />
        </div>
    )
}

export { CustomDatePicker }
