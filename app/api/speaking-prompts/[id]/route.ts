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
      .from('speaking_prompts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    // Transform snake_case to camelCase
    const transformedData = {
      id: data.id,
      title: data.title,
      part: data.part,
      topic: data.topic,
      promptText: data.prompt_text,
      bulletPoints: data.bullet_points,
      followUpQuestions: data.follow_up_questions,
      preparationTime: data.preparation_time,
      speakingTime: data.speaking_time,
      tips: data.tips,
      targetBand: data.target_band,
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
      part: body.part,
      topic: body.topic,
      prompt_text: body.promptText,
      bullet_points: body.bulletPoints,
      follow_up_questions: body.followUpQuestions,
      preparation_time: body.preparationTime,
      speaking_time: body.speakingTime,
      tips: body.tips,
      target_band: body.targetBand,
      is_published: body.isPublished,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('speaking_prompts')
      .update(dbData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      title: data.title,
      part: data.part,
      topic: data.topic,
      promptText: data.prompt_text,
      bulletPoints: data.bullet_points,
      followUpQuestions: data.follow_up_questions,
      preparationTime: data.preparation_time,
      speakingTime: data.speaking_time,
      tips: data.tips,
      targetBand: data.target_band,
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
      .from('speaking_prompts')
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
