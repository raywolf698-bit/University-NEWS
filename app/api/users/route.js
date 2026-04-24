import { NextResponse } from 'next/server'
import { mysqlPool } from '@/utils/db'

export async function GET() {
  const conn = await mysqlPool.getConnection()
  try {
    const [rows] = await conn.execute(`
      SELECT id, full_name, email, faculty, role, created_at
      FROM users
      ORDER BY created_at DESC
    `)
    return NextResponse.json({ data: rows })
  } catch (err) {
    console.error('[GET /api/users]', err)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  } finally {
    conn.release()
  }
}

export async function PATCH(request) {
  const conn = await mysqlPool.getConnection()
  try {
    const { id, role } = await request.json()
    if (!id || !role) {
      return NextResponse.json({ error: 'id and role are required' }, { status: 400 })
    }
    await conn.execute(`UPDATE users SET role = ? WHERE id = ?`, [role, id])
    return NextResponse.json({ message: 'User updated' })
  } catch (err) {
    console.error('[PATCH /api/users]', err)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  } finally {
    conn.release()
  }
}

export async function DELETE(request) {
  const conn = await mysqlPool.getConnection()
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    await conn.execute(`DELETE FROM users WHERE id = ?`, [id])
    return NextResponse.json({ message: 'User deleted' })
  } catch (err) {
    console.error('[DELETE /api/users]', err)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  } finally {
    conn.release()
  }
}