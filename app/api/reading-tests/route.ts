import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET all reading tests
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    let query = supabase
      .from('reading_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (published === 'true') {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST create new reading test
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('reading_tests')
      .insert({
        title: body.title,
        target_band: body.targetBand,
        duration: body.duration,
        passage_content: body.passageContent,
        questions: body.questions,
        created_by: user.id,
        is_published: body.isPublished || false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
