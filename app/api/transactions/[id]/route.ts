import { NextResponse } from "next/server"
import { transactionService } from "@/lib/firestore"

interface Params {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const transaction = await transactionService.getById(id)
        if (!transaction) {
            return NextResponse.json(
                { success: false, message: "Transaction not found" },
                { status: 404 }
            )
        }
        return NextResponse.json({ success: true, data: transaction })
    } catch (error) {
        console.error("Error fetching transaction:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch transaction" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const body = await request.json()
        await transactionService.update(id, body)
        return NextResponse.json({ success: true, message: "Transaction updated" })
    } catch (error) {
        console.error("Error updating transaction:", error)
        return NextResponse.json(
            { success: false, message: "Failed to update transaction" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params
        await transactionService.delete(id)
        return NextResponse.json({ success: true, message: "Transaction deleted" })
    } catch (error) {
        console.error("Error deleting transaction:", error)
        return NextResponse.json(
            { success: false, message: "Failed to delete transaction" },
            { status: 500 }
        )
    }
}
