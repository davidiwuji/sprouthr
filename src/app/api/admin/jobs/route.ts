import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

/** Verify admin by reading the Supabase session cookie. */
async function verifyAdminFromRequest(req: NextRequest): Promise<boolean> {
  try {
    // Read cookies via the Cookie header (most reliable in Route Handlers)
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map(c => c.trim().split('=')).filter(p => p.length >= 2);
    const cookieMap = new Map(cookies.map(([k, ...v]) => [k.trim(), v.join('=')]));
    
    // Find Supabase auth session cookie: sb-{project_ref}-auth-token
    let sessionCookie = '';
    for (const [name, value] of cookieMap) {
      if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
        sessionCookie = decodeURIComponent(value);
        break;
      }
    }
    if (!sessionCookie) {
      return false;
    }

    // Parse the session JSON
    let accessToken = '';
    try {
      const session = JSON.parse(sessionCookie);
      accessToken = session.access_token || '';
    } catch {
      accessToken = sessionCookie || '';
    }
    if (!accessToken) return false;

    // Verify with service role client
    const svc = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user }, error } = await svc.auth.getUser(accessToken);
    if (error || !user) return false;

    return user.email === SUPER_ADMIN_EMAIL || user.user_metadata?.is_admin === true;
  } catch (e) {
    console.error('verifyAdmin error:', e);
    return false;
  }
}

/** Create a service client lazily per request. */
function getSvc() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * POST /api/admin/jobs — Create a new job (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminFromRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const job = await req.json();
    if (!job.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const svc = getSvc();
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
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/jobs?id=xxx — Update a job (admin only)
 */
export async function PATCH(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminFromRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    const updates = await req.json();
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

    const svc = getSvc();
    const { error } = await svc.from('jobs').update(safeUpdates).eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/jobs?id=xxx — Delete a job (admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const isAdmin = await verifyAdminFromRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    const svc = getSvc();
    const { error } = await svc.from('jobs').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
