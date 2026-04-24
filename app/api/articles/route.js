import { NextResponse } from "next/server";
import { getArticles, countArticles, createArticle } from "@/utils/queries/articles";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status        = searchParams.get("status")       ?? "published";
    const article_type  = searchParams.get("article_type") ?? undefined;
    const category_slug = searchParams.get("category")     ?? undefined;
    const tag_slug      = searchParams.get("tag")          ?? undefined;
    const search        = searchParams.get("search")       ?? undefined;
    const page          = parseInt(searchParams.get("page")  ?? "1");
    const limit         = parseInt(searchParams.get("limit") ?? "12");

    const [articles, total] = await Promise.all([
      getArticles({ status, article_type, category_slug, tag_slug, search, page, limit }),
      countArticles({ status, article_type, search }),
    ]);

    return NextResponse.json({
      data: articles,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[GET /api/articles]", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { author_id, title, slug, content, excerpt,
            cover_image, status, article_type,
            category_ids, tag_ids, published_at } = body;

    if (!author_id || !title || !slug || !content) {
      return NextResponse.json(
        { error: "author_id, title, slug and content are required" },
        { status: 400 }
      );
    }

    const result = await createArticle({
      author_id, title, slug, content, excerpt,
      cover_image, status, article_type,
      category_ids, tag_ids, published_at,
    });

    return NextResponse.json({ message: "Article created", ...result }, { status: 201 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[POST /api/articles]", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}