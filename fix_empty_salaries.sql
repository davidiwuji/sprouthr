-- Convert remaining empty-string salaries to NULL
UPDATE jobs SET salary = NULL WHERE salary = '';

-- Verify
SELECT 'Remaining empty string salary' AS check_name, COUNT(*) AS count FROM jobs WHERE salary = '';
SELECT 'Total NULL salary' AS check_name, COUNT(*) AS count FROM jobs WHERE salary IS NULL;
SELECT 'Total filled salary' AS check_name, COUNT(*) AS count FROM jobs WHERE salary IS NOT NULL AND salary != '';
