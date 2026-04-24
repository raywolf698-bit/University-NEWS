import { mysqlPool } from '@/utils/db';

export async function getTags() {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(`
      SELECT t.*,
        COUNT(DISTINCT at2.article_id) AS article_count
      FROM tags t
      LEFT JOIN article_tags at2 ON at2.tag_id = t.id
      GROUP BY t.id
      ORDER BY t.name ASC
    `);
    return rows;
  } finally {
    conn.release();
  }
}

export async function createTag({ name, slug }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `INSERT INTO tags (name, slug) VALUES (?, ?)`,
      [name, slug]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

export async function updateTag(id, { name, slug }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `UPDATE tags SET name = ?, slug = ? WHERE id = ?`,
      [name, slug, id]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function deleteTag(id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `DELETE FROM tags WHERE id = ?`, [id]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}