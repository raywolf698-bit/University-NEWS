import { NextResponse } from "next/server";
import { getTags, createTag } from "@/utils/queries/tags";

export async function GET() {
  try {
    const tags = await getTags();
    return NextResponse.json({ data: tags });
  } catch (err) {
    console.error("[GET /api/tags]", err);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const id = await createTag({ name, slug });
    return NextResponse.json({ message: "Tag created", id }, { status: 201 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Tag already exists" }, { status: 409 });
    }
    console.error("[POST /api/tags]", err);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}