import { mysqlPool } from '@/utils/db'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const body = await req.json()
    const { step, email, newPassword } = body

    if (!email) {
      return Response.json({ error: 'Email is required.' }, { status: 400 })
    }

    // ── STEP 1: Check email exists ──
    if (step === 1) {
      const [rows] = await mysqlPool.query(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email.trim().toLowerCase()]
      )
      if (rows.length === 0) {
        return Response.json(
          { error: 'No account found with this email address.' },
          { status: 404 }
        )
      }
      return Response.json({ success: true })
    }

    // ── STEP 2: Update password ──
    if (step === 2) {
      if (!newPassword || newPassword.length < 6) {
        return Response.json(
          { error: 'Password must be at least 6 characters.' },
          { status: 400 }
        )
      }

      // Check email still exists
      const [rows] = await mysqlPool.query(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email.trim().toLowerCase()]
      )
      if (rows.length === 0) {
        return Response.json(
          { error: 'No account found with this email address.' },
          { status: 404 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update in DB
      await mysqlPool.query(
        'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
        [hashedPassword, email.trim().toLowerCase()]
      )

      return Response.json({ success: true })
    }

    return Response.json({ error: 'Invalid step.' }, { status: 400 })

  } catch (err) {
    console.error('[forgot-password]', err)
    return Response.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}