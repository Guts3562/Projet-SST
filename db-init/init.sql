-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Utilisateur',
  company VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token VARCHAR(500) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  noun VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL
);

-- Seed default SST Tunis questions
INSERT INTO questions (text, options, correct, category) VALUES
('Quel est le numéro d''urgence de la Caisse Nationale de Sécurité Sociale (CNSS) en Tunisie ?', ARRAY['190', '198', '55 590 228', '71 335 500'], 2, 'Législation'),
('En Tunisie, pour quelle hauteur de chute de travail un harnais de sécurité est-il obligatoirement exigé par la réglementation ?', ARRAY['Supérieure à 1 mètre', 'Supérieure à 2 mètres', 'Supérieure à 3 mètres', 'Supérieure à 5 mètres'], 1, 'EPI'),
('Quelle est la principale loi régissant la Santé et la Sécurité au Travail en Tunisie ?', ARRAY['La Loi Constitutionnelle', 'Le Décret n°2000-389', 'Le Code du Travail (Loi n°66-27)', 'La Norme NT 09.01'], 2, 'Législation'),
('Quel est le numéro d''urgence pour contacter la Protection Civile en Tunisie ?', ARRAY['197', '193', '190', '198'], 3, 'Urgences'),
('Quel est le rôle principal de l''INRSST en Tunisie ?', ARRAY['Payer les indemnités de licenciement', 'Assurer la recherche, la formation et l''expertise technique en SST', 'Sanctionner financièrement les entreprises en infraction', 'Inspecter les véhicules de transport de marchandises'], 1, 'Législation'),
('Quel numéro d''urgence doit être composé en Tunisie en cas d''empoisonnement ou d''intoxication chimique ?', ARRAY['198 (Protection Civile)', '71 335 500 (Centre Anti-Poison)', '190 (SAMU)', '197 (Police)'], 1, 'Urgences'),
('Quelle norme tunisienne régit l''utilisation des casques de protection individuelle sur les chantiers du BTP ?', ARRAY['NT 09.01', 'NT 09.02', 'NT 09.08', 'NT 09.12'], 1, 'EPI'),
('Pour contacter le SAMU (secours médicaux d''urgence) en Tunisie, quel numéro composez-vous ?', ARRAY['190', '198', '197', '193'], 0, 'Urgences'),
('En cas d''exposition à la poussière de ciment ou de silice, quel type de masque est préconisé par la prévention ?', ARRAY['Masque chirurgical simple', 'Masque FFP2 ou FFP3 adapté', 'Masque anti-gaz lourd', 'Visière transparente de protection'], 1, 'EPI'),
('Quel principe de prévention des risques professionnels consiste à éliminer la source du danger ?', ARRAY['Fournir des EPI', 'Éviter les risques à la source', 'Adapter le travail à l''homme', 'Former les secouristes'], 1, 'Prévention')
ON CONFLICT DO NOTHING;
