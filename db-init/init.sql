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

-- Password reset tokens are stored hashed and expire after a short period.
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash CHAR(64) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
  ON password_reset_tokens(user_id);

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
  category VARCHAR(100) NOT NULL,
  source_url TEXT,
  source_reference TEXT,
  verified_at DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'published'
    CHECK (status IN ('draft', 'published', 'archived'))
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
('Quel principe de prévention des risques professionnels consiste à éliminer la source du danger ?', ARRAY['Fournir des EPI', 'Éviter les risques à la source', 'Adapter le travail à l''homme', 'Former les secouristes'], 1, 'Prévention'),
('Quel est le numéro de la Protection Civile en Tunisie (pompiers + secours médicaux) ?', ARRAY['190','197','198','193'], 2, 'Urgences'),
('Selon la loi tunisienne, quel délai maximum l''employeur a-t-il pour déclarer un accident du travail à la CNSS ?', ARRAY['24 heures','48 heures','72 heures','7 jours ouvrables'], 1, 'Législation'),
('Quel EPI est obligatoire pour les travaux en hauteur (>2m) sur les chantiers tunisiens ?', ARRAY['Un simple casque de chantier','Un gilet de signalisation jaune','Un harnais de sécurité avec point d''ancrage certifié NT 09.12','Des gants anti-coupure'], 2, 'EPI'),
('Quel organisme est chargé de la gestion des risques professionnels en Tunisie ?', ARRAY['Le ministère de la Santé','La CNSS — Caisse Nationale de Sécurité Sociale','L''UTICA','La Banque Centrale de Tunisie'], 1, 'Institutions'),
('Dans le contexte de ce site, que signifie le sigle SST ?', ARRAY['Santé et sécurité au travail','Sauveteur Secouriste du Travail','Service Santé Travail','Sécurité Systématique au Travail'], 0, 'Formation'),
('Selon les statistiques tunisiennes, quel secteur concentre le plus d''accidents du travail ?', ARRAY['Le secteur textile','L''agriculture','Le BTP — Bâtiment et Travaux Publics','Le secteur tertiaire (services)'], 2, 'Statistiques'),
('Quel numéro composer en cas d''intoxication chimique ou médicamenteuse en Tunisie ?', ARRAY['190','198','71 335 500','55 590 228'], 2, 'Urgences'),
('Quelle procédure doit être appliquée avant toute intervention de maintenance sur une machine industrielle ?', ARRAY['Prévenir l''équipe et continuer','La procédure de consignation-déconsignation (LOTO)','Éteindre uniquement l''interrupteur principal','Poser une affiche d''avertissement'], 1, 'Prévention'),
('À quelle fréquence minimale les exercices d''évacuation incendie sont-ils obligatoires en Tunisie ?', ARRAY['Une fois tous les 2 ans','Une fois par an minimum','Tous les 6 mois obligatoirement','Uniquement lors de la création de l''entreprise'], 1, 'Législation'),
('Selon les normes tunisiennes, à partir de quel niveau sonore les protections auditives deviennent-elles obligatoires ?', ARRAY['À partir de 70 dB','À partir de 80 dB','À partir de 85 dB','À partir de 100 dB'], 2, 'EPI'),
('Que doit contenir obligatoirement un poste de travail exposé à des produits chimiques dangereux en Tunisie ?', ARRAY['Un extincteur CO2 uniquement','Une Fiche de Données de Sécurité (FDS) accessible','Un registre d''entrée et de sortie','Une caméra de surveillance'], 1, 'Prévention'),
('Quelle loi constitue la base du Code du Travail tunisien ?', ARRAY['Loi n°66-27 du 30 avril 1966','Décret n°2000-389','Loi n°94-28 du 21 février 1994','Décret n°2001-641'], 0, 'Législation'),
('Quelle maladie professionnelle respiratoire est fréquente dans les cimenteries et carrières tunisiennes ?', ARRAY['L''asthme allergique','La silicose','La légionellose','La bronchite chronique obstructive liée au tabac'], 1, 'Risques'),
('Quel numéro appeler pour un secours en mer en Tunisie ?', ARRAY['190','193','194','198'], 2, 'Urgences'),
('Quel type de masque est recommandé pour travailler avec des produits phytosanitaires (pesticides) en agriculture ?', ARRAY['Un masque chirurgical jetable','Un masque FFP1 simple','Un masque FFP2 ou FFP3 avec filtre adapté','Un simple foulard en tissu'], 2, 'EPI'),
('Qui est responsable de la mise en place des mesures de sécurité au travail dans une entreprise tunisienne ?', ARRAY['Le salarié lui-même uniquement','L''employeur, avec le concours du CHSCT','Le médecin du travail exclusivement','L''inspection du travail'], 1, 'Prévention'),
('Quel organisme délivre l''agrément officiel pour les formations SST (Sauveteur Secouriste du Travail) en Tunisie ?', ARRAY['Le ministère de l''Éducation Nationale','La CNSS en partenariat avec le ministère des Affaires Sociales','L''UGTT exclusivement','L''UTICA'], 1, 'Formation'),
('Dans le secteur du BTP en Tunisie, quelle est la distance minimale de sécurité à respecter par rapport à une ligne électrique aérienne de haute tension lors des travaux ?', ARRAY['1 mètre','3 mètres','5 mètres','10 mètres'], 2, 'Risques'),
('Dans une entreprise tunisienne de plus de 40 salariés, quel organe est obligatoire pour la gestion de la sécurité ?', ARRAY['Un délégué syndical uniquement','Le CHSCT — Comité d''Hygiène, de Sécurité et des Conditions de Travail','Un service de sécurité externalisé','Un agent de sécurité incendie'], 1, 'Législation'),
('Quelle est la première action à effectuer face à un collègue victime d''un arrêt cardiaque au travail ?', ARRAY['Appeler immédiatement la famille','Alerter les secours (190/198) et commencer la RCP si formé','Lui donner de l''eau et attendre','Le déplacer immédiatement vers un endroit plus confortable'], 1, 'Prévention'),
('Qu''est-ce qu''un "triangle du feu" en matière de prévention incendie ?', ARRAY['Un panneau de signalisation triangulaire d''alerte incendie','Les trois éléments nécessaires à la combustion : combustible, comburant et énergie d''activation','Le nom d''un extincteur à usage professionnel','Une procédure d''évacuation en triangle'], 1, 'Prévention')
ON CONFLICT (id) DO NOTHING;

UPDATE questions
SET status = 'draft'
WHERE id IN (1, 2, 5, 7, 12, 13, 16, 19, 20, 25, 27, 28, 29);

UPDATE questions
SET status = 'archived'
WHERE id IN (11, 17);

UPDATE questions
SET text = 'Dans le contexte de ce site, que signifie le sigle SST ?',
    options = ARRAY['Santé et sécurité au travail','Sauveteur Secouriste du Travail','Service Santé Travail','Sécurité Systématique au Travail'],
    correct = 0,
    category = 'Formation'
WHERE id = 15;

-- Seed demo users
INSERT INTO users (id, email, password_hash, created_at) VALUES
(1, 'mr.hafyen@gmail.com', '$2a$10$LwN5f3NuO1rZu.IgjwO.h.9cTm714hmd/C5E/y3JH8bIqS5zBYcAa', '2026-05-01 20:44:00.347473+01'),
(2, 'louayhafyen1@gmail.com', '$2a$10$HjIZYPxa30z7QqDvxGUNNee0mRCaWL9MB3TpRd3d5J1fUyqB6O0X.', '2026-05-02 07:09:27.80955+01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, email, full_name, role, company, phone) VALUES
(1, 'mr.hafyen@gmail.com', 'Louay', 'student', NULL, NULL),
(2, 'louayhafyen1@gmail.com', 'EL HAFYEN Louây', 'student', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed demo quiz results
INSERT INTO quiz_results (user_id, noun, role, score, total, created_at) VALUES
(1, 'Louay', 'student', 2, 10, '2026-05-01 21:06:37.420685+01'),
(1, 'Louay', 'student', 5, 10, '2026-05-01 21:28:54.314883+01'),
(1, 'Louay', 'student', 4, 10, '2026-05-23 19:18:14.901096+01'),
(1, 'Louay', 'student', 3, 10, '2026-06-12 18:59:01.2172+01')
ON CONFLICT DO NOTHING;

-- Fix sequences
SELECT pg_catalog.setval('public.users_id_seq', (SELECT MAX(id) FROM public.users), true);
SELECT pg_catalog.setval('public.quiz_results_id_seq', (SELECT MAX(id) FROM public.quiz_results), true);
SELECT pg_catalog.setval('public.questions_id_seq', (SELECT MAX(id) FROM public.questions), true);
