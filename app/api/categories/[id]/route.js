import { NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/utils/queries/categories";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCategory(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PUT /api/categories/:id]", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteCategory(id);

    if (!deleted) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    console.error("[DELETE /api/categories/:id]", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}