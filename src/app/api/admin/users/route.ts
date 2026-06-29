import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'davidiwuji1@gmail.com';

/**
 * Admin Users API
 * ===============
 * GET    → list all users
 * DELETE → delete a user (body: { id })
 * PATCH  → update user role (body: { id, is_admin })
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
export async function GET() {
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 403 });
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    // Map to clean user objects
    const users = (data.users || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      isAdmin: (u.user_metadata?.is_admin === true || u.email === 'davidiwuji1@gmail.com'),
      userMetadata: u.user_metadata || {},
    }));

    return NextResponse.json({ users, total: users.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    // Prevent deleting the Super Admin
    const getCheck = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (getCheck.ok) {
      const targetUser = await getCheck.json();
      if (targetUser?.email === SUPER_ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Cannot delete the Super Admin account' }, { status: 403 });
      }
    }

    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 403 });
  }

  try {
    const { id, is_admin } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing user id' }, { status: 400 });

    // Get current user metadata
    const getRes = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!getRes.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = await getRes.json();
    const currentMeta = userData.user_metadata || {};

    // Update user metadata with admin flag
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_metadata: { ...currentMeta, is_admin },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
