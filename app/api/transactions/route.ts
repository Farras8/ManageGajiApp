import { NextResponse } from "next/server"
import { transactionService } from "@/lib/firestore"

export async function GET() {
    try {
        const transactions = await transactionService.getAll()
        return NextResponse.json({ success: true, data: transactions })
    } catch (error) {
        console.error("Error fetching transactions:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const transaction = await transactionService.create(body)
        return NextResponse.json({ success: true, data: transaction }, { status: 201 })
    } catch (error) {
        console.error("Error creating transaction:", error)
        return NextResponse.json(
            { success: false, message: "Failed to create transaction" },
            { status: 500 }
        )
    }
}
