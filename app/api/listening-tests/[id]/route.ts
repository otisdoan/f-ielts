import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const { data, error } = await supabase
      .from('listening_tests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    // Transform snake_case to camelCase
    const transformedData = {
      id: data.id,
      title: data.title,
      targetBand: data.target_band,
      duration: data.duration,
      audioUrl: data.audio_url,
      audioDuration: data.audio_duration,
      canReplay: data.can_replay,
      parts: data.parts,
      createdBy: data.created_by,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ data: transformedData })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const body = await request.json()

    // Transform camelCase to snake_case for database
    const dbData = {
      title: body.title,
      target_band: body.targetBand,
      duration: body.duration,
      audio_url: body.audioUrl,
      audio_duration: body.audioDuration,
      can_replay: body.canReplay,
      parts: body.parts,
      is_published: body.isPublished,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('listening_tests')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      title: data.title,
      targetBand: data.target_band,
      duration: data.duration,
      audioUrl: data.audio_url,
      audioDuration: data.audio_duration,
      canReplay: data.can_replay,
      parts: data.parts,
      createdBy: data.created_by,
      isPublished: data.is_published,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json({ data: transformedData })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  try {
    const { error } = await supabase
      .from('listening_tests')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
