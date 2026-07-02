import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const SYSTEM_PROMPT = `You are a job parser. Extract structured job information from raw text (like WhatsApp messages).

Return ONLY valid JSON (no markdown, no code fences) with these fields:
{
  "title": "Job Title",
  "company": "Company Name",
  "description": "Full job description (keep all details, but remove irrelevant chatter like 'Good morning' etc.)",
  "salary": "Salary info if present, otherwise empty string",
  "location": "Location if present, otherwise empty string",
  "type": "Type: usually 'Full Time', 'Part Time', 'Contract', 'Remote', 'Internship', 'Graduate Program' etc.",
  "category": "Opportunity type: 'job', 'internship', 'scholarship', 'fellowship', 'graduate', 'bootcamp', 'grant', 'volunteer'",
  "deadline": "Application deadline in YYYY-MM-DD format if present, otherwise null",
  "experience_level": "'entry', 'intermediate', 'senior', 'lead', or 'all'",
  "workplace_type": "'remote', 'hybrid', 'onsite', or empty string",
  "url": "External apply URL if present, otherwise empty string"
}

Rules:
- If the text is not a job/opportunity post, set title to null and leave a message in description
- Be concise but capture all key details in description
- Nigerian context: most salaries are in Naira, preserve as-is
- Normalize dates to YYYY-MM-DD`;

export async function POST(req: NextRequest) {
  try {
    // Auth check — allow any admin (SuperAdmin or users with is_admin metadata)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAdmin = user.email === 'davidiwuji1@gmail.com' || user.user_metadata?.is_admin === true;
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
    }

    const { text } = await req.json();
    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: 'Text too short' }, { status: 400 });
    }

    // Call Groq
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Groq API error: ${errText}` }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try to extract JSON from code fences
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        const braceMatch = content.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          parsed = JSON.parse(braceMatch[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      }
    }

    return NextResponse.json({ parsed, raw: content });
  } catch (error: any) {
    console.error('Paste-job parse error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
