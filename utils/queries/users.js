import { mysqlPool } from '@/utils/db';

export async function getUserByEmail(email) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
}

export async function getUserById(id) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, full_name, email, role, faculty, avatar_url, is_verified, created_at
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
}

export async function createUser({ full_name, email, password_hash, role = 'student', faculty }) {
  const conn = await mysqlPool.getConnection();
  try {
    const [result] = await conn.execute(
      `INSERT INTO users (full_name, email, password_hash, role, faculty)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, password_hash, role, faculty ?? null]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}