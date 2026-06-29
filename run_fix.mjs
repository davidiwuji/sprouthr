import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:3001';
const ENDPOINT = BASE + '/api/admin/fix-data';

async function call(action: string, data?: any) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
  });
  const result = await res.json();
  if (result.error) console.error('❌', action, result.error);
  else console.log('✅', result.message || 'ok');
  return result;
}

const catMap: Record<string, string> = {
  'remote': 'job', 'trainings': 'bootcamp', 'training': 'bootcamp',
  'masters-scholarships': 'scholarship', 'undergraduate-scholarships': 'scholarship',
  'undergraduates-scholarships': 'scholarship', 'undergraduates-scholarships-2': 'scholarship',
  'phd-scholarships': 'scholarship',
  'graphics-design': 'job', 'social-media-jobs': 'job', 'customer-service-jobs': 'job',
  'content-creation-jobs': 'job', 'data-entry-jobs': 'job', 'software-engineering-jobs': 'job',
  'digital-marketing-jobs': 'job', 'administrative-assistant': 'job', 'administrative-assitant': 'job',
  'ui-ux-jobs': 'job', 'frontend-development-jobs': 'job', 'product-design-jobs': 'job',
  'marketing-jobs': 'job', 'backend-development-jobs': 'job', 'copywriting-jobs': 'job',
  'writing-jobs': 'job', 'devops-jobs': 'job', 'call-rep': 'job', 'web-design-jobs': 'job',
  'data-analyst-jobs': 'job', 'teaching': 'job', 'fullstack-development-jobs': 'job',
  'digital-marketing': 'job', 'banking-jobs': 'job', 'sales-jobs': 'job', 'data-analyst': 'job',
  'hr-jobs': 'job', 'united-nations': 'fellowship', 'articles': 'job', 'opportunities': 'job',
  'uncategorized': 'job',
};

(async () => {
  // Step 1: Fix all bad categories
  console.log('=== Fixing categories ===');
  for (const [oldCat, newCat] of Object.entries(catMap)) {
    await call('update_category', { old_cat: oldCat, new_cat: newCat });
  }
  await call('update_null_cat');
  console.log('');

  // Step 2: Clear scholarship salaries
  console.log('=== Clearing scholarship salaries ===');
  await call('clear_scholarship_salaries');
  console.log('');

  // Step 3: Get bad salary IDs (via anon query)
  console.log('=== Getting bad salary IDs ===');
  const anonRes = await fetch(BASE + '/api/check-bad-salaries');
  const { bad } = await anonRes.json();
  if (bad && bad.length > 0) {
    console.log('Found', bad.length, 'bad salaries');
    const ids = bad.map((j: any) => j.id);
    await call('batch_update_salaries', { ids });
  } else {
    console.log('No bad salaries found or API not available');
  }
  console.log('\n✅ All fixes complete!');
})();
