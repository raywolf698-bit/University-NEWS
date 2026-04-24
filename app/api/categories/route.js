import { NextResponse } from "next/server";
import { getCategories, createCategory, getCategoryBySlug } from "@/utils/queries/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ data: categories });
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, parent_id } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await getCategoryBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const id = await createCategory({ name, slug, description, parent_id });
    return NextResponse.json({ message: "Category created", id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/categories]", err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}