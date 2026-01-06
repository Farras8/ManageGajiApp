"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    const { theme, setTheme } = useTheme()

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 md:h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gold-gradient flex items-center justify-center shadow-lg">
                        <Wallet className="h-4 w-4 md:h-5 md:w-5 text-black" />
                    </div>
                    <div>
                        <h1 className="text-base md:text-xl font-bold tracking-tight text-gold-gradient font-serif">
                            Keuangan
                        </h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">Catat keuangan pribadi</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gold/10 h-8 w-8 md:h-10 md:w-10"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all text-gold dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all text-gold dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    )
}
