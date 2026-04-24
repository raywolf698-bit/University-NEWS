import { NextResponse } from 'next/server'
import { mysqlPool } from '@/utils/db'
import bcrypt from 'bcryptjs'

export async function PATCH(request) {
  const conn = await mysqlPool.getConnection()
  try {
    const { id, current_password, new_password } = await request.json()

    if (!id || !current_password || !new_password) {
      return NextResponse.json({ error: 'id, current_password and new_password are required' }, { status: 400 })
    }

    // get current hash
    const [rows] = await conn.execute(
      `SELECT password_hash FROM users WHERE id = ?`, [id]
    )

    if (!rows[0]) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // check current password
    const match = await bcrypt.compare(current_password, rows[0].password_hash)
    if (!match) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // hash new password
    const new_hash = await bcrypt.hash(new_password, 10)

    await conn.execute(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [new_hash, id]
    )

    return NextResponse.json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error('[PATCH /api/users/me/password]', err)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  } finally {
    conn.release()
  }
}