"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Wallet, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    const { setTheme, theme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse-slow">
                        <Coffee className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-medium tracking-tight text-foreground font-sans">
                            Catatan Keuangan
                        </h1>
                        <p className="text-xs text-muted-foreground font-light tracking-wide">Take it slow & steady 🌿</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 rounded-full"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all text-orange-400 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-blue-200 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}
