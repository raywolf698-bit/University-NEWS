import { NextResponse } from "next/server";
import { updateTag, deleteTag } from "@/utils/queries/tags";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateTag(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tag updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PUT /api/tags/:id]", err);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteTag(id);

    if (!deleted) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tag deleted" });
  } catch (err) {
    console.error("[DELETE /api/tags/:id]", err);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}