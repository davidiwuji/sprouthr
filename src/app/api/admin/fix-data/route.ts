import { createClient } from '@supabase/supabase-js';

// ─── Date extraction patterns ───
const DATE_PATTERNS = [
  // "Application Deadline: 5th March, 2025"
  /(?:deadline|closing\s*date|applications?\s*(?:close|deadline)|apply\s*before|closes?\s*(?:on|by)|closing\s*date|due\s*date)[:\s]*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)[,\s]*(\d{4})/i,
  // "Deadline: March 5, 2025"
  /(?:deadline|closing\s*date|applications?\s*(?:close|deadline)|apply\s*before|closes?\s*(?:on|by)|closing\s*date|due\s*date)[:\s]*([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]*(\d{4})/i,
  // "Deadline: 2025-03-05"
  /(?:deadline|closing\s*date|applications?\s*(?:close|deadline)|apply\s*before|closes?\s*(?:on|by)|closing\s*date|due\s*date)[:\s]*(\d{4})-(\d{2})-(\d{2})/i,
  // "Deadline: 05/03/2025" (try DD/MM/YYYY then MM/DD/YYYY)
  /(?:deadline|closing\s*date|applications?\s*(?:close|deadline)|apply\s*before|closes?\s*(?:on|by)|closing\s*date|due\s*date)[:\s]*(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/i,
  // "Apply before 31st March 2025" (without "deadline:" prefix)
  /apply\s*before\s+(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)[,\s]*(\d{4})/i,
  /apply\s*before\s+([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]*(\d{4})/i,
  // "Closes 31 March 2025"
  /closes?\s+(?:on\s+|by\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)[,\s]*(\d{4})/i,
  /closes?\s+(?:on\s+|by\s+)?([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]*(\d{4})/i,
  // "Ends 31 March 2025"
  /ends?\s+(?:on\s+|by\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)[,\s]*(\d{4})/i,
  /ends?\s+(?:on\s+|by\s+)?([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]*(\d{4})/i,
  // "Submission Deadline: 31 March 2025"
  /submission\s*deadline[:\s]*(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)[,\s]*(\d{4})/i,
  /submission\s*deadline[:\s]*([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?[,\s]*(\d{4})/i,
];

const MONTHS: Record<string, number> = {
  january: 0, jan: 0, february: 1, feb: 1, march: 2, mar: 2, april: 3, apr: 3,
  may: 4, june: 5, jun: 5, july: 6, jul: 6, august: 7, aug: 7,
  september: 8, sep: 8, sept: 8, october: 9, oct: 9, november: 10, nov: 10,
  december: 11, dec: 11,
};

function parseDeadline(description: string): string | null {
  if (!description) return null;
  const text = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 3000);

  for (const pattern of DATE_PATTERNS) {
    const m = text.match(pattern);
    if (!m) continue;

    try {
      let day: number, month: number, year: number;

      // Determine which capture group positions based on pattern structure
      // Patterns either capture (day, month, year) or (month, day, year) or (year, month, day)
      if (/^\d{4}$/.test(m[1])) {
        // YYYY-MM-DD format
        year = parseInt(m[1]);
        month = parseInt(m[2]) - 1;
        day = parseInt(m[3]);
      } else if (/^\d{1,2}$/.test(m[1]) && !/^[a-z]+$/i.test(m[2])) {
        // DD/MM/YYYY or MM/DD/YYYY - try both
        year = parseInt(m[3]);
        const a = parseInt(m[1]), b = parseInt(m[2]);
        if (a > 12) { day = a; month = b - 1; }
        else if (b > 12) { day = b; month = a - 1; }
        else { day = a; month = b - 1; } // default DD/MM
      } else if (/^[a-z]+$/i.test(m[1])) {
        // "Month Day, Year"
        month = MONTHS[m[1].toLowerCase()];
        day = parseInt(m[2]);
        year = parseInt(m[3]);
      } else if (/^[a-z]+$/i.test(m[2])) {
        // "Day Month Year"
        day = parseInt(m[1]);
        month = MONTHS[m[2].toLowerCase()];
        year = parseInt(m[3]);
      } else {
        continue;
      }

      if (month === undefined || isNaN(month) || isNaN(day) || isNaN(year)) continue;
      if (day < 1 || day > 31 || month < 0 || month > 11) continue;

      const date = new Date(year, month, day, 23, 59, 59);
      if (date.getTime() > Date.now() + 50 * 365 * 24 * 60 * 60 * 1000) continue; // sanity: max 50 years out
      return date.toISOString();
    } catch { continue; }
  }
  return null;
}

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

    if (action === 'extract_deadlines') {
      const { limit = 100, offset = 0 } = data || {};
      // Fetch jobs with null deadline
      const { data: jobs, error: fetchError } = await supabase
        .from('jobs')
        .select('id, title, description')
        .is('deadline', null)
        .not('description', 'is', null)
        .range(offset, offset + limit - 1);

      if (fetchError) return Response.json({ error: fetchError.message }, { status: 500 });

      let extracted = 0, scanned = 0;
      for (const job of jobs || []) {
        scanned++;
        const deadline = parseDeadline(job.description);
        if (deadline) {
          const { error: updateError } = await supabase
            .from('jobs')
            .update({ deadline })
            .eq('id', job.id);
          if (!updateError) extracted++;
        }
      }

      return Response.json({
        success: true,
        scanned,
        extracted,
        message: `Scanned ${scanned} jobs, extracted ${extracted} deadlines`,
      });
    }

    if (action === 'extract_all_deadlines') {
      // Get total count
      const { count, error: countError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .is('deadline', null)
        .not('description', 'is', null);

      if (countError) return Response.json({ error: countError.message }, { status: 500 });
      const total = count || 0;
      const batchSize = 100;
      let totalExtracted = 0, totalScanned = 0;

      for (let offset = 0; offset < total; offset += batchSize) {
        const { data: jobs, error: fetchError } = await supabase
          .from('jobs')
          .select('id, title, description')
          .is('deadline', null)
          .not('description', 'is', null)
          .range(offset, offset + batchSize - 1);

        if (fetchError) {
          console.error('Fetch error at offset', offset, fetchError.message);
          continue;
        }

        for (const job of jobs || []) {
          totalScanned++;
          const deadline = parseDeadline(job.description);
          if (deadline) {
            const { error: updateError } = await supabase
              .from('jobs')
              .update({ deadline })
              .eq('id', job.id);
            if (!updateError) totalExtracted++;
          }
        }
      }

      return Response.json({
        success: true,
        scanned: totalScanned,
        extracted: totalExtracted,
        message: `Scanned ${totalScanned} jobs, extracted ${totalExtracted} deadlines`,
      });
    }

    if (action === 'rescan_smartyacad') {
      const { batch = 50, offset = 0 } = data || {};
      const apiBase = process.env.API_BASE || 'http://localhost:3001';
      
      const res = await fetch(`${apiBase}/api/admin/rescan-smartyacad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch, offset, delay: 300 }),
      });
      
      const result = await res.json();
      if (!res.ok) return Response.json({ error: result.error }, { status: 500 });
      return Response.json(result);
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
