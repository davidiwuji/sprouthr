-- ============================================================
-- SALARY CLEANUP
-- ============================================================

-- 1. Fix N prefix (old Naira format) → ₦
--    e.g. "N70,000", "N250,000", "N150" → "₦70,000", "₦250,000", "₦150"
UPDATE jobs SET salary = '₦' || SUBSTRING(salary FROM 2)
WHERE salary ~ '^N\d';

-- 2. Fix # prefix → ₦ (e.g. "#150,000" → "₦150,000")
UPDATE jobs SET salary = '₦' || SUBSTRING(salary FROM 2)
WHERE salary ~ '^#';

-- 3. Fix "NGN " → "₦" (e.g. "NGN 70,000" → "₦70,000")
UPDATE jobs SET salary = '₦' || SUBSTRING(salary FROM 5)
WHERE salary ILIKE 'NGN %';

-- 4. Remove trailing .00 from ₦ amounts (₦150,000.00 → ₦150,000)
UPDATE jobs SET salary = REPLACE(salary, '.00', '')
WHERE salary LIKE '₦%.00' OR salary LIKE '₦%,%.00';

-- 5. Fix values where ₦ is followed by just 2-3 digits (likely truncated from thousands)
--    e.g. "₦150" → "₦150,000" when the value looks like it lost its trailing ",000"
--    Only apply where the numeric part is between 30 and 999 (likely salary truncations)
UPDATE jobs SET salary = salary || ',000'
WHERE salary ~ '^₦\d{2,3}$' AND CAST(SUBSTRING(salary FROM 2) AS INTEGER) BETWEEN 30 AND 999;

-- 6. Fix "N##" format without comma (e.g. N250 → ₦250,000)
UPDATE jobs SET salary = '₦' || CAST(CAST(SUBSTRING(salary FROM 2) AS INTEGER) * 1000 AS TEXT)
WHERE salary ~ '^N\d{3}$' AND CAST(SUBSTRING(salary FROM 2) AS INTEGER) BETWEEN 30 AND 999;

-- 7. Fix values like "Up to ₦250,000" → clean "₦250,000"
UPDATE jobs SET salary = TRIM(SUBSTRING(salary FROM POSITION('₦' IN salary)))
WHERE salary ILIKE 'up to %';

-- 8. Remove text descriptions from salary (anything with "Other Benefits", "Deadline:", "Key Responsibilities", etc.)
UPDATE jobs SET salary = NULL
WHERE salary ILIKE '%other benefits%'
   OR salary ILIKE '%deadline%'
   OR salary ILIKE '%competitive%'
   OR salary ILIKE '%key responsibilities%'
   OR salary ILIKE '%your hard work deserves%'
   OR salary ILIKE '%hands-on training%'
   OR salary ILIKE '%flexible schedule%'
   OR salary ILIKE '%team adventures%'
   OR salary ILIKE '%b2c team%'
   OR salary ILIKE '%paid holidays%'
   OR salary ILIKE '%working days%'
   OR salary ILIKE '%stipend%'
   OR salary ILIKE '%support living%';

-- 9. Restore scholarship amounts from description where possible
--    These are known scholarship values that should show as funding amount
UPDATE jobs SET salary = '$15,147'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Samsung SDI Scholarship%'
);

UPDATE jobs SET salary = '$70,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Yale University Scholarship%'
);

UPDATE jobs SET salary = '₦700,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Bridge Foundation%University Undergraduate%'
);

UPDATE jobs SET salary = '£26,500'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%University of Exeter LME%'
);

UPDATE jobs SET salary = '$20,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Miami University of Ohio%Graduate%'
);

UPDATE jobs SET salary = '¥32,000/month'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%UNESCO Great Wall%'
);

UPDATE jobs SET salary = '$27,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%University of Toledo Scholarship%'
);

UPDATE jobs SET salary = '₦1,000,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Dreamrite College Scholarship%'
);

UPDATE jobs SET salary = '€14,760'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%LASOMA Scholarship%'
);

UPDATE jobs SET salary = '₦70,000'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Wilson and Yinka Badejo Foundation%'
);

UPDATE jobs SET salary = '$15,608'
WHERE category = 'scholarship' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Seoul National University Scholarship 2027%'
);

-- Grant amounts (from description extraction)
UPDATE jobs SET salary = '₦500,000'
WHERE category = 'grant' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Tony Elumelu Foundation%'
);

UPDATE jobs SET salary = '$5,000'
WHERE category = 'grant' AND id IN (
  SELECT id FROM jobs WHERE title ILIKE '%Visa Everywhere%'
);

-- 10. Set salary to NULL for remaining scholarships without a clean amount
UPDATE jobs SET salary = NULL
WHERE category IN ('scholarship', 'grant') AND salary IS NOT NULL AND salary != '';

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
SELECT 'Scholarship salaries' AS check_name, COUNT(*) AS count FROM jobs WHERE category = 'scholarship' AND salary IS NOT NULL AND salary != '';
SELECT 'Grant salaries' AS check_name, COUNT(*) AS count FROM jobs WHERE category = 'grant' AND salary IS NOT NULL AND salary != '';
SELECT 'Remaining bad N prefix' AS check_name, COUNT(*) AS count FROM jobs WHERE salary ~ '^N\d';
SELECT 'Remaining bad # prefix' AS check_name, COUNT(*) AS count FROM jobs WHERE salary ~ '^#';
SELECT 'Remaining bad NGN prefix' AS check_name, COUNT(*) AS count FROM jobs WHERE salary ILIKE 'NGN %';
SELECT 'Remaining salary > 50 chars' AS check_name, COUNT(*) AS count FROM jobs WHERE LENGTH(salary) > 50;
SELECT 'Remaining empty string salary' AS check_name, COUNT(*) AS count FROM jobs WHERE salary = '';
SELECT 'Sample scholarship/grant salaries' AS label, id, title, salary, category FROM jobs WHERE category IN ('scholarship', 'grant') AND salary IS NOT NULL AND salary != '' LIMIT 20;
