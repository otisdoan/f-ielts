import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')

  try {
    let query = supabase
      .from('listening_tests')
      .select('*')
      .order('created_at', { ascending: false })

    if (published === 'true') {
      query = query.eq('is_published', true)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform snake_case to camelCase
    const transformedData = data?.map((test: any) => ({
      id: test.id,
      title: test.title,
      targetBand: test.target_band,
      duration: test.duration,
      audioUrl: test.audio_url,
      audioDuration: test.audio_duration,
      canReplay: test.can_replay,
      parts: test.parts,
      createdBy: test.created_by,
      isPublished: test.is_published,
      createdAt: test.created_at,
      updatedAt: test.updated_at,
    }))

    return NextResponse.json({ data: transformedData })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()

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
      is_published: body.isPublished || false,
    }

    const { data, error } = await supabase
      .from('listening_tests')
      .insert([dbData])
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
