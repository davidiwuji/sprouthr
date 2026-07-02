import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

const svc = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Extract the Supabase access token from cookies.
 * @supabase/ssr v0.12 stores the session as a JSON cookie named sb-{project_ref}-auth-token.
 */
async function getAccessTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    // Find the first cookie matching the Supabase auth token pattern
    const authCookie = allCookies.find(c => 
      c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );
    if (!authCookie) return null;

    const raw = authCookie.value;
    // The cookie value is a JSON-encoded session: { access_token, refresh_token, ... }
    try {
      const session = JSON.parse(raw);
      return session.access_token || null;
    } catch {
      // Fallback: treat the whole value as the token
      return raw || null;
    }
  } catch {
    return null;
  }
}

/** Verify the user is an admin, return the user if so. */
async function getAdminUser(): Promise<any | null> {
  try {
    const token = await getAccessTokenFromCookies();
    if (!token) return null;

    const { data: { user }, error } = await svc.auth.getUser(token);
    if (error || !user) return null;

    const isAdmin = user.email === SUPER_ADMIN_EMAIL || user.user_metadata?.is_admin === true;
    return isAdmin ? user : null;
  } catch {
    return null;
  }
}

/**
 * POST /api/admin/jobs — Create a new job (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

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
 * PATCH /api/admin/jobs?id=xxx — Update a job (admin only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    const updates = await req.json();
    // Only allow specific fields to be updated
    const allowedFields = [
      'title', 'company', 'description', 'salary', 'location',
      'type', 'category', 'deadline', 'experience_level',
      'workplace_type', 'url', 'source'
    ];
    const safeUpdates: any = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        safeUpdates[field] = updates[field] === '' ? null : updates[field];
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { error } = await svc.from('jobs').update(safeUpdates).eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/jobs?id=xxx — Delete a job (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

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
