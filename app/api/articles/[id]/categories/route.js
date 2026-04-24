import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request, { params }) {
  const { id } = await params;
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT c.id, c.name, c.slug 
       FROM categories c
       JOIN article_categories ac ON ac.category_id = c.id
       WHERE ac.article_id = ?`,
      [id]
    );
    return NextResponse.json({ data: rows });
  } finally {
    conn.release();
  }
}