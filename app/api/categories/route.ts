import { NextResponse } from "next/server"
import { categoryService } from "@/lib/firestore"

export async function GET() {
    try {
        const categories = await categoryService.getAll()
        return NextResponse.json({ success: true, data: categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const category = await categoryService.create(body)
        return NextResponse.json({ success: true, data: category }, { status: 201 })
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json(
            { success: false, message: "Failed to create category" },
            { status: 500 }
        )
    }
}
