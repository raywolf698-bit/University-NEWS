import { mysqlPool } from '@/utils/db';

const emojiToType = {
  '👍': 'like',
  '❤️': 'love',
  '🔥': 'insightful',
  '😮': 'celebrate',
}

const typeToEmoji = {
  'like': '👍',
  'love': '❤️',
  'insightful': '🔥',
  'celebrate': '😮',
}

export async function getReactions(article_id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT reaction_type, COUNT(*) AS count
       FROM reactions
       WHERE article_id = ?
       GROUP BY reaction_type`,
      [article_id]
    );
    return rows.map(r => ({
      emoji: typeToEmoji[r.reaction_type] || r.reaction_type,
      count: r.count
    }))
  } finally {
    conn.release();
  }
}

export async function getUserReaction({ article_id, user_id }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT reaction_type FROM reactions
       WHERE article_id = ? AND user_id = ?`,
      [article_id, user_id]
    );
    const type = rows[0]?.reaction_type
    return type ? typeToEmoji[type] : null
  } finally {
    conn.release();
  }
}

export async function upsertReaction({ article_id, user_id, emoji }) {
  const conn = await mysqlPool.getConnection();
  try {
    const reaction_type = emojiToType[emoji] || 'like'
    await conn.execute(
      `INSERT INTO reactions (article_id, user_id, reaction_type)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reaction_type = ?`,
      [article_id, user_id, reaction_type, reaction_type]
    );
  } finally {
    conn.release();
  }
}

export async function deleteReaction({ article_id, user_id }) {
  const conn = await mysqlPool.getConnection();
  try {
    await conn.execute(
      `DELETE FROM reactions WHERE article_id = ? AND user_id = ?`,
      [article_id, user_id]
    );
  } finally {
    conn.release();
  }
}