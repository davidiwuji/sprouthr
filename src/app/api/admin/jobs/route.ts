import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const svc = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/admin/jobs — Create a new job
 */
export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/jobs?id=xxx — Update a job
 */
export async function PATCH(req: NextRequest) {
  try {
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
 * DELETE /api/admin/jobs?id=xxx — Delete a job
 *
 * Uses the Supabase REST API directly (via fetch) instead of the JS client,
 * to avoid any SDK chaining issues with DELETE.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Build the filter — handle both numeric and UUID ids
    const filter = /^\d+$/.test(id) ? `id=eq.${id}` : `id=eq.${id}`;

    const res = await fetch(`${supabaseUrl}/rest/v1/jobs?${filter}`, {
      method: 'DELETE',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Supabase REST DELETE failed (${res.status}):`, text);
      return NextResponse.json({ error: `Delete failed: ${text || res.statusText}` }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('DELETE handler error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
