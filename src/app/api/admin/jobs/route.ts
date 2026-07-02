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
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing job id' }, { status: 400 });
    }

    // Try parsing as number if the id is numeric, otherwise treat as UUID string
    const isNumeric = /^\d+$/.test(id);
    const query = svc.from('jobs').delete();
    if (isNumeric) {
      query.eq('id', parseInt(id));
    } else {
      query.eq('id', id);
    }

    const { error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}
