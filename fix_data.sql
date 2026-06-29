-- ============================================================
-- Fix 1: Map bad categories to valid Browse filter values
-- ============================================================

UPDATE jobs SET category = 'job' WHERE category IN (
  'remote', 'graphics-design', 'social-media-jobs', 'customer-service-jobs',
  'content-creation-jobs', 'data-entry-jobs', 'software-engineering-jobs',
  'digital-marketing-jobs', 'administrative-assistant', 'administrative-assitant',
  'ui-ux-jobs', 'frontend-development-jobs', 'product-design-jobs',
  'marketing-jobs', 'backend-development-jobs', 'copywriting-jobs',
  'writing-jobs', 'devops-jobs', 'call-rep', 'web-design-jobs',
  'data-analyst-jobs', 'teaching', 'fullstack-development-jobs',
  'digital-marketing', 'banking-jobs', 'sales-jobs', 'data-analyst',
  'hr-jobs', 'articles', 'opportunities', 'uncategorized'
);

UPDATE jobs SET category = 'bootcamp' WHERE category IN ('trainings', 'training');

UPDATE jobs SET category = 'scholarship' WHERE category IN (
  'masters-scholarships', 'undergraduate-scholarships',
  'undergraduates-scholarships', 'undergraduates-scholarships-2',
  'phd-scholarships'
);

UPDATE jobs SET category = 'fellowship' WHERE category = 'united-nations';

UPDATE jobs SET category = 'job' WHERE category IS NULL;

-- ============================================================
-- Fix 2: Clear scholarship salaries (scholarships have funding/stipend, not salary)
-- ============================================================

UPDATE jobs SET salary = NULL WHERE category = 'scholarship';

-- ============================================================
-- Fix 3: Clear salary fields that contain full sentences/descriptions
-- These are IDs with salary > 50 chars or containing descriptive text
-- ============================================================

-- Data Engineer Intern at Coinbase (fellowship) - "Competitive Level: Entry-Level / Graduate Department: Data..."
UPDATE jobs SET salary = NULL WHERE id = '04c7b699-d12e-483b-a7aa-77e59ff178ce';

-- Customer Support Agent at BETPAWA - "Your hard work deserves recognition!..."
UPDATE jobs SET salary = NULL WHERE id = '03e44e4b-a57a-43db-bd7b-22435da947f4';

-- Indorama Internship Programme - "Monthly consolidated stipend to support..."
UPDATE jobs SET salary = NULL WHERE id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Indorama Internship%' AND salary IS NOT NULL
);

-- Management Trainee at DM Holdings - "Competitive Key Responsibilities Support..."
UPDATE jobs SET salary = NULL WHERE id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Management Trainee%' AND salary IS NOT NULL AND LENGTH(salary) > 50
);

-- Remote Entry-Level Part-time writer - "$25/hour Flexible Schedule..."
UPDATE jobs SET salary = NULL WHERE id IN (
  SELECT id FROM jobs WHERE title ILIKE '%writer%' AND salary IS NOT NULL AND LENGTH(salary) > 50
);

-- Remote Content Manager at Aquent - "$45/hr The B2C team requires..."
UPDATE jobs SET salary = NULL WHERE id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Content Manager%' AND salary IS NOT NULL AND LENGTH(salary) > 50
);

-- Remote Media Buyer Intern at IMPACT - "€500/month (net) 25 Working Days..."
UPDATE jobs SET salary = NULL WHERE id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Media Buyer%' AND salary IS NOT NULL AND LENGTH(salary) > 50
);

-- Analytics Engineer Intern at Coinbase - "Competitive Level: Entry-Level ..."
UPDATE jobs SET salary = NULL WHERE id = (
  SELECT id FROM jobs WHERE title ILIKE '%Analytics Engineer%' AND salary IS NOT NULL AND LENGTH(salary) > 50
  LIMIT 1
);

-- Also clear any remaining salary fields > 50 chars (descriptive blobs)
UPDATE jobs SET salary = NULL WHERE LENGTH(salary) > 50;

-- ============================================================
-- Verify the fixes
-- ============================================================

-- Check remaining bad categories (should be only: job, internship, scholarship, fellowship, graduate, bootcamp, grant, volunteer)
SELECT category, COUNT(*) FROM jobs GROUP BY category ORDER BY COUNT(*) DESC;

-- Check scholarships with salary (should be 0)
SELECT COUNT(*) AS scholarships_with_salary FROM jobs WHERE category = 'scholarship' AND salary IS NOT NULL;

-- Check any remaining salary > 50 chars (should be 0)
SELECT COUNT(*) AS long_salaries FROM jobs WHERE LENGTH(salary) > 50;
