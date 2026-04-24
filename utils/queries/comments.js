import { mysqlPool } from '@/utils/db';

export async function getComments(article_id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT c.id, c.content, c.created_at,
              u.id AS user_id, u.full_name, u.avatar_url
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.article_id = ? AND c.is_approved = 1 AND c.parent_id IS NULL
       ORDER BY c.created_at DESC`,
      [article_id]
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function createComment({ article_id, user_id, content }) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.execute(
      `INSERT INTO comments (article_id, user_id, content, is_approved) VALUES (?, ?, ?, 1)`,
      [article_id, user_id, content]
    );
  } finally {
    conn.release();
  }
}

export async function deleteComment({ comment_id, user_id }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `DELETE FROM comments WHERE id = ? AND user_id = ?`,
      [comment_id, user_id]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}