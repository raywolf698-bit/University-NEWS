import { mysqlPool } from '@/utils/db';

export async function getCategories() {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(`
      SELECT c.*, 
        p.name AS parent_name,
        COUNT(DISTINCT ac.article_id) AS article_count
      FROM categories c
      LEFT JOIN categories p ON p.id = c.parent_id
      LEFT JOIN article_categories ac ON ac.category_id = c.id
      GROUP BY c.id
      ORDER BY c.name ASC
    `);
    return rows;
  } finally {
    conn.release();
  }
}

export async function getCategoryBySlug(slug) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM categories WHERE slug = ?`, [slug]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
}

export async function createCategory({ name, slug, description, parent_id }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `INSERT INTO categories (name, slug, description, parent_id)
       VALUES (?, ?, ?, ?)`,
      [name, slug, description ?? null, parent_id ?? null]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

export async function updateCategory(id, { name, slug, description, parent_id }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `UPDATE categories SET name = ?, slug = ?, description = ?, parent_id = ? WHERE id = ?`,
      [name, slug, description ?? null, parent_id ?? null, id]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function deleteCategory(id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `DELETE FROM categories WHERE id = ?`, [id]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}