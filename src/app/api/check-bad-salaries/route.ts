import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
    const { data: sals } = await supabase.from('jobs').select('id,title,category,salary').not('salary', 'is', null).limit(500);
    const bad = (sals||[]).filter((j: any) => j.salary && (j.salary.length > 50 || /[a-zA-Z]{10,}/.test(j.salary.replace(/[₦Nn$£€,\s.\/()\-]/g,''))));
    const { data: sch } = await supabase.from('jobs').select('id,title,salary').eq('category', 'scholarship').not('salary', 'is', null).limit(100);
    return Response.json({ bad, sch_salaries: sch || [] });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
