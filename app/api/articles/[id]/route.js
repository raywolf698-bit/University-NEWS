import { NextResponse } from "next/server";
import { getArticleById, updateArticle, deleteArticle, incrementViewCount } from "@/utils/queries/articles";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    incrementViewCount(id).catch(console.error);
    return NextResponse.json({ data: article });
  } catch (err) {
    console.error("[GET /api/articles/:id]", err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateArticle(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Article not found or nothing to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Article updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PUT /api/articles/:id]", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deleted = await deleteArticle(id);

    if (!deleted) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article deleted" });
  } catch (err) {
    console.error("[DELETE /api/articles/:id]", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateArticle(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Article not found or nothing to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Article updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[PATCH /api/articles/:id]", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}