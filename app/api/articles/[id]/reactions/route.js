import { NextResponse } from 'next/server'
import { getReactions, getUserReaction, upsertReaction, deleteReaction } from '@/utils/queries/reactions'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const [reactions, userReaction] = await Promise.all([
      getReactions(id),
      user_id ? getUserReaction({ article_id: id, user_id }) : null
    ])
    return NextResponse.json({ data: reactions, userReaction })
  } catch (err) {
    console.error('[GET /api/articles/[id]/reactions]', err)
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const { user_id, emoji } = await request.json()
    if (!user_id || !emoji) {
      return NextResponse.json({ error: 'user_id and emoji are required' }, { status: 400 })
    }
    await upsertReaction({ article_id: id, user_id, emoji })
    return NextResponse.json({ message: 'Reaction saved' })
  } catch (err) {
    console.error('[POST /api/articles/[id]/reactions]', err)
    return NextResponse.json({ error: 'Failed to save reaction' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { user_id } = await request.json()
    await deleteReaction({ article_id: id, user_id })
    return NextResponse.json({ message: 'Reaction removed' })
  } catch (err) {
    console.error('[DELETE /api/articles/[id]/reactions]', err)
    return NextResponse.json({ error: 'Failed to remove reaction' }, { status: 500 })
  }
}