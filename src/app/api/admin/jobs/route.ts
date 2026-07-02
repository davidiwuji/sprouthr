import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

/**
 * POST /api/admin/jobs — Create a new job (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }
    const isAdmin = user.email === SUPER_ADMIN_EMAIL || user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    // Use service role for DB operations
    const { createClient: sbCreateClient } = await import('@supabase/supabase-js');
    const svc = sbCreateClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const job = await req.json();
    if (!job.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await svc.from('jobs').insert({
      title: job.title,
      company: job.company || 'Unknown',
      description: job.description || '',
      salary: job.salary || null,
      location: job.location || null,
      type: job.type || 'Full Time',
      category: job.category || 'job',
      date_posted: job.date_posted || new Date().toISOString(),
      deadline: job.deadline || null,
      experience_level: job.experience_level || 'entry',
      workplace_type: job.workplace_type || null,
      url: job.url || null,
      source: 'admin_added',
      external_id: `admin_${Date.now()}`,
    }).select('id').single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/jobs?id=xxx — Delete a job (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }
    const isAdmin = user.email === SUPER_ADMIN_EMAIL || user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const { createClient: sbCreateClient } = await import('@supabase/supabase-js');
    const svc = sbCreateClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    const { error } = await svc.from('jobs').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
