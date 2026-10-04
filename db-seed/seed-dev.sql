-- Optional local-development sample data.
-- This file is deliberately outside db-init/ and is never run automatically.
-- Never use this demo account in a shared or production environment.
BEGIN;

WITH demo_user AS (
  INSERT INTO users (email, password_hash, system_role)
  VALUES (
    'demo-client@example.invalid',
    '$2a$10$1EL5LOHBvOxfuIBiVWLqm.jJVBNYBp1iC4sCk4/j7D1M65C7qSSYO',
    'client'
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id, email
)
INSERT INTO profiles (id, email, full_name, role)
SELECT id, email, 'Compte de démonstration', 'worker'
FROM demo_user
ON CONFLICT (id) DO NOTHING;

INSERT INTO quiz_results (user_id, noun, role, score, total, created_at)
SELECT id, 'Compte de démonstration', 'worker', sample.score, 10, sample.created_at
FROM users
CROSS JOIN (
  VALUES
    (6, TIMESTAMP '2026-01-10 10:00:00'),
    (8, TIMESTAMP '2026-01-17 10:00:00')
) AS sample(score, created_at)
WHERE users.email = 'demo-client@example.invalid'
  AND NOT EXISTS (
    SELECT 1
    FROM quiz_results
    WHERE quiz_results.user_id = users.id
      AND quiz_results.created_at = sample.created_at
  );

COMMIT;
