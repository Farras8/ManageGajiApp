import { NextResponse } from "next/server"
import { categoryService } from "@/lib/firestore"

interface Params {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const category = await categoryService.getById(id)
        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            )
        }
        return NextResponse.json({ success: true, data: category })
    } catch (error) {
        console.error("Error fetching category:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch category" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request, { params }: Params) {
    try {
        const { id } = await params
        const body = await request.json()
        await categoryService.update(id, body)
        return NextResponse.json({ success: true, message: "Category updated" })
    } catch (error) {
        console.error("Error updating category:", error)
        return NextResponse.json(
            { success: false, message: "Failed to update category" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params
        await categoryService.delete(id)
        return NextResponse.json({ success: true, message: "Category deleted" })
    } catch (error) {
        console.error("Error deleting category:", error)
        return NextResponse.json(
            { success: false, message: "Failed to delete category" },
            { status: 500 }
        )
    }
}
