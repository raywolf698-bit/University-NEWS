import { NextResponse } from 'next/server'
import { getComments, createComment, deleteComment } from '@/utils/queries/comments'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const comments = await getComments(id)
    return NextResponse.json({ data: comments })
  } catch (err) {
    console.error('[GET /api/articles/[id]/comments]', err)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const { user_id, content } = await request.json()
    if (!user_id || !content) {
      return NextResponse.json({ error: 'user_id and content are required' }, { status: 400 })
    }
    const commentId = await createComment({ article_id: id, user_id, content })
    return NextResponse.json({ message: 'Comment created', id: commentId }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/articles/[id]/comments]', err)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const { user_id, comment_id } = await request.json()
    const deleted = await deleteComment({ comment_id, user_id })
    if (!deleted) return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    return NextResponse.json({ message: 'Comment deleted' })
  } catch (err) {
    console.error('[DELETE /api/articles/[id]/comments]', err)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}