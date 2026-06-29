import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { action, data } = body;

    if (action === 'update_category') {
      const { old_cat, new_cat } = data;
      const { error } = await supabase.from('jobs').update({ category: new_cat }).eq('category', old_cat);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true, message: `Updated ${old_cat} → ${new_cat}` });
    }

    if (action === 'update_null_cat') {
      const { error } = await supabase.from('jobs').update({ category: 'job' }).is('category', null);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true, message: `Updated null categories → job` });
    }

    if (action === 'clear_scholarship_salaries') {
      const { error } = await supabase.from('jobs').update({ salary: null }).eq('category', 'scholarship');
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true, message: 'Cleared scholarship salaries' });
    }

    if (action === 'batch_update_salaries') {
      const { ids } = data;
      let updated = 0;
      for (const id of ids) {
        const { error } = await supabase.from('jobs').update({ salary: null }).eq('id', id);
        if (!error) updated++;
        else console.error('Failed for', id, error.message);
      }
      return Response.json({ success: true, updated });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
