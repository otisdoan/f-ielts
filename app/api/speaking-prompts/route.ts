import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')
  const part = searchParams.get('part')

  try {
    let query = supabase
      .from('speaking_prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (published === 'true') {
      query = query.eq('is_published', true)
    }

    if (part) {
      query = query.eq('part', parseInt(part))
    }

    const { data, error } = await query

    if (error) throw error

    // Transform snake_case to camelCase
    const transformedData = data?.map((prompt: any) => ({
      id: prompt.id,
      title: prompt.title,
      part: prompt.part,
      topic: prompt.topic,
      promptText: prompt.prompt_text,
      bulletPoints: prompt.bullet_points,
      followUpQuestions: prompt.follow_up_questions,
      preparationTime: prompt.preparation_time,
      speakingTime: prompt.speaking_time,
      tips: prompt.tips,
      targetBand: prompt.target_band,
      createdBy: prompt.created_by,
      isPublished: prompt.is_published,
      createdAt: prompt.created_at,
      updatedAt: prompt.updated_at,
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

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
      created_by: user.id,
      is_published: body.isPublished || false,
    }

    const { data, error } = await supabase
      .from('speaking_prompts')
      .insert(dbData)
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

    return NextResponse.json({ data: transformedData }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
