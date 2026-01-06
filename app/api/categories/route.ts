import { NextResponse } from "next/server"
import { categoryService } from "@/lib/firestore"

export async function GET() {
    try {
        console.log("Fetching categories...")
        const categories = await categoryService.getAll()
        console.log(`Found ${categories.length} categories`)
        return NextResponse.json({ success: true, data: categories })
    } catch (error) {
        console.error("Error fetching categories:", error)
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to fetch categories",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log("Creating category:", body)
        const category = await categoryService.create(body)
        console.log("Category created:", category.id)
        return NextResponse.json({ success: true, data: category }, { status: 201 })
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json(
            { 
                success: false, 
                message: "Failed to create category",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        )
    }
}
