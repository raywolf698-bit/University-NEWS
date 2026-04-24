import { NextResponse } from 'next/server'
import { mysqlPool } from '@/utils/db'

export async function PATCH(request) {
  const conn = await mysqlPool.getConnection()
  try {
    const { id, full_name, bio, faculty } = await request.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await conn.execute(
      `UPDATE users SET full_name = ?, faculty = ? WHERE id = ?`,
      [full_name, faculty, id]
    )

    const [rows] = await conn.execute(
      `SELECT id, full_name, email, role, faculty, avatar_url, is_verified, created_at FROM users WHERE id = ?`,
      [id]
    )

    return NextResponse.json({ message: 'Profile updated', user: rows[0] })
  } catch (err) {
    console.error('[PATCH /api/users/me]', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  } finally {
    conn.release()
  }
}