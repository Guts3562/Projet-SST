export const risks = [
  {
    icon: '🏗️', color: 'red',
    title: 'Chutes de hauteur — BTP',
    subtitle: 'Premier cause de mortalité au travail en Tunisie',
    dangers: [
      'Échafaudages non conformes aux normes NT',
      'Absence de garde-corps et de filets de sécurité',
      'Travaux sur toitures sans EPI adaptés',
      'Sols glissants et surfaces instables',
    ],
    prevention: [
      'Port obligatoire du harnais de sécurité (NT 09.12)',
      'Échafaudages certifiés et vérifiés périodiquement',
      'Formation aux travaux en hauteur (h > 2m)',
      'Permis de travail en hauteur signé par le chef de chantier',
    ]
  },
  {
    icon: '🌾', color: 'amber',
    title: 'Pesticides et produits phytosanitaires',
    subtitle: 'Intoxications aiguës et maladies chroniques en agriculture',
    dangers: [
      'Intoxications aiguës lors de l\'application',
      'Troubles neurologiques et cancers professionnels',
      'Contamination des eaux et des sols',
      'Non-respect des délais de réentrée',
    ],
    prevention: [
      'Port des EPI complets (combinaison, gants, masque FFP2)',
      'Lecture obligatoire de la FDS avant utilisation',
      'Respect strict des délais de réentrée post-traitement',
      'Formation agréée à la manipulation des pesticides',
    ]
  },
  {
    icon: '🏭', color: 'blue',
    title: 'Machines industrielles — Textile & Mécanique',
    subtitle: 'Coupures, écrasements, amputations',
    dangers: [
      'Accès aux parties mobiles des machines',
      'Absence de protecteurs ou de carter',
      'Manque d\'arrêt d\'urgence accessible',
      'Exposition au bruit intense (&gt;85 dB)',
    ],
    prevention: [
      'Protecteurs de machines conformes aux normes NT',
      'Bouton d\'arrêt d\'urgence à portée de main',
      'Consignation-déconsignation avant maintenance (LOTO)',
      'Port de protection auditive obligatoire',
    ]
  },
  {
    icon: '🧯', color: 'red',
    title: 'Incendie et explosion',
    subtitle: 'Stockage inapproprié, installations électriques vétustes',
    dangers: [
      'Stockage inadapté de produits inflammables',
      'Installations électriques non conformes',
      'Absence ou insuffisance d\'extincteurs',
      'Non-affichage des plans d\'évacuation',
    ],
    prevention: [
      'Extincteurs vérifiés tous les 12 mois',
      'Plans d\'évacuation affichés à chaque étage',
      'Exercice d\'évacuation au moins 1 fois/an',
      'Mise aux normes électriques par professionnel agréé',
    ]
  },
  {
    icon: '🚚', color: 'amber',
    title: 'Accidents de la route professionnels',
    subtitle: 'Transport de marchandises et déplacements professionnels',
    dangers: [
      'Fatigue au volant lors de longs trajets',
      'Non-respect des temps de repos réglementaires',
      'Surcharge des véhicules de transport',
      'Manque de formation à la conduite défensive',
    ],
    prevention: [
      'Respect du Code de la Route tunisien',
      'Formation à la conduite défensive et préventive',
      'Pauses obligatoires toutes les 2h de conduite',
      'Vérification régulière des véhicules professionnels',
    ]
  },
  {
    icon: '💨', color: 'blue',
    title: 'Poussières et maladies respiratoires',
    subtitle: 'Silicose, pneumoconioses — Cimenteries & mines',
    dangers: [
      'Exposition à la silice cristalline (silicose)',
      'Poussières de ciment et d\'amiante',
      'Absence de ventilation adéquate',
      'Maladies professionnelles à apparition retardée',
    ],
    prevention: [
      'Ventilation locale aspirante obligatoire',
      'Masques FFP2/FFP3 adaptés aux poussières',
      'Surveillance médicale semestrielle renforcée',
      'Déclaration obligatoire des maladies professionnelles à la CNSS',
    ]
  },
  {
    icon: '⚡', color: 'red',
    title: 'Risques électriques',
    subtitle: 'Électrisation, électrocution, incendies d\'origine électrique',
    dangers: [
      'Installations électriques vétustes ou non conformes',
      'Travaux sous tension sans habilitation',
      'Absence de mise à la terre',
      'Utilisation de matériel électrique endommagé',
    ],
    prevention: [
      'Habilitation électrique obligatoire (B1, B2, BR…)',
      'Vérification périodique par électricien agréé',
      'Procédure de consignation avant intervention',
      'Disjoncteurs différentiels 30mA obligatoires',
    ]
  },
  {
    icon: '🧪', color: 'amber',
    title: 'Produits chimiques dangereux',
    subtitle: 'Industries chimique, pharmaceutique, nettoyage',
    dangers: [
      'Brûlures chimiques par acides et bases',
      'Inhalation de vapeurs toxiques',
      'Mélanges incompatibles de produits',
      'Stockage non conforme (absence d\'étiquetage)',
    ],
    prevention: [
      'FDS (Fiches de Données de Sécurité) accessibles à tous',
      'EPI chimiques : gants nitrile, lunettes étanches, tablier',
      'Stockage séparé des produits incompatibles',
      'Douches de sécurité à proximité immédiate',
    ]
  },
];

export const QUESTION_BANK = [
  {
    category: 'Urgences',
    text: 'Quel est le numéro de la Protection Civile en Tunisie (pompiers + secours médicaux) ?',
    options: ['190', '197', '198', '193'],
    correct: 2,
    explanation: 'Le 198 est le numéro de la Protection Civile tunisienne. Il couvre les pompiers et le secours médical d\'urgence. Le 190 est le SAMU, le 197 la Police, le 193 la Garde Nationale.'
  },
  {
    category: 'Législation',
    text: 'Selon la loi tunisienne, quel délai maximum l\'employeur a-t-il pour déclarer un accident du travail à la CNSS ?',
    options: ['24 heures', '48 heures', '72 heures', '7 jours ouvrables'],
    correct: 1,
    explanation: 'L\'employeur doit déclarer tout accident du travail à la CNSS dans un délai maximum de 48 heures (jours ouvrables), sous peine de sanctions administratives.'
  },
  {
    category: 'EPI',
    text: 'Quel EPI est obligatoire pour les travaux en hauteur (>2m) sur les chantiers tunisiens ?',
    options: ['Un simple casque de chantier', 'Un gilet de signalisation jaune', 'Un harnais de sécurité avec point d\'ancrage certifié NT 09.12', 'Des gants anti-coupure'],
    correct: 2,
    explanation: 'Le harnais de sécurité avec point d\'ancrage conforme à la norme NT 09.12 est obligatoire pour tous travaux en hauteur supérieure à 2 mètres, conformément au Code du Travail tunisien.'
  },
  {
    category: 'Institutions',
    text: 'Quel organisme est chargé de la gestion des risques professionnels en Tunisie ?',
    options: ['Le ministère de la Santé', 'La CNSS — Caisse Nationale de Sécurité Sociale', 'L\'UTICA', 'La Banque Centrale de Tunisie'],
    correct: 1,
    explanation: 'La CNSS (Caisse Nationale de Sécurité Sociale) gère les accidents du travail, les maladies professionnelles et coordonne la prévention des risques professionnels en Tunisie.'
  },
  {
    category: 'Formation',
    text: 'Que signifie le sigle SST dans le contexte professionnel tunisien ?',
    options: ['Sécurité et Sauvetage au Travail', 'Sauveteur Secouriste du Travail', 'Service Santé Travail', 'Sécurité Systématique au Travail'],
    correct: 1,
    explanation: 'Le SST (Sauveteur Secouriste du Travail) est une formation reconnue par la CNSS, permettant d\'intervenir en premiers secours et de contribuer à la prévention des risques en entreprise.'
  },
  {
    category: 'Statistiques',
    text: 'Selon les statistiques tunisiennes, quel secteur concentre le plus d\'accidents du travail ?',
    options: ['Le secteur textile', 'L\'agriculture', 'Le BTP — Bâtiment et Travaux Publics', 'Le secteur tertiaire (services)'],
    correct: 2,
    explanation: 'Le BTP est le secteur le plus accidentogène en Tunisie, représentant environ 35% des accidents déclarés à la CNSS, suivi de l\'agriculture et de l\'industrie textile.'
  },
  {
    category: 'Urgences',
    text: 'Quel numéro composer en cas d\'intoxication chimique ou médicamenteuse en Tunisie ?',
    options: ['190', '198', '71 335 500', '55 590 228'],
    correct: 2,
    explanation: 'Le Centre Anti-Poison de Tunis est joignable au 71 335 500. Il offre une assistance 24h/24 en cas d\'intoxication par pesticides, produits chimiques ou médicaments en surdose.'
  },
  {
    category: 'Prévention',
    text: 'Quelle procédure doit être appliquée avant toute intervention de maintenance sur une machine industrielle ?',
    options: ['Prévenir l\'équipe et continuer', 'La procédure de consignation-déconsignation (LOTO)', 'Éteindre uniquement l\'interrupteur principal', 'Poser une affiche d\'avertissement'],
    correct: 1,
    explanation: 'La procédure LOTO (Lockout-Tagout / Consignation-Déconsignation) garantit que les machines sont complètement isolées de leurs sources d\'énergie avant toute opération de maintenance, évitant les démarrages accidentels.'
  },
  {
    category: 'Législation',
    text: 'À quelle fréquence minimale les exercices d\'évacuation incendie sont-ils obligatoires en Tunisie ?',
    options: ['Une fois tous les 2 ans', 'Une fois par an minimum', 'Tous les 6 mois obligatoirement', 'Uniquement lors de la création de l\'entreprise'],
    correct: 1,
    explanation: 'La réglementation tunisienne impose au minimum un exercice d\'évacuation incendie par an. Les établissements à risques élevés (chimie, BTP) doivent en effectuer deux par an.'
  },
  {
    category: 'EPI',
    text: 'Selon les normes tunisiennes, à partir de quel niveau sonore les protections auditives deviennent-elles obligatoires ?',
    options: ['À partir de 70 dB', 'À partir de 80 dB', 'À partir de 85 dB', 'À partir de 100 dB'],
    correct: 2,
    explanation: 'Conformément à la norme NT 09.09 et à la réglementation tunisienne, le port de protections auditives (bouchons ou coquilles) est obligatoire dès 85 décibels d\'exposition sonore.'
  },
  {
    category: 'Prévention',
    text: 'Que doit contenir obligatoirement un poste de travail exposé à des produits chimiques dangereux en Tunisie ?',
    options: ['Un extincteur CO2 uniquement', 'Une Fiche de Données de Sécurité (FDS) accessible', 'Un registre d\'entrée et de sortie', 'Une caméra de surveillance'],
    correct: 1,
    explanation: 'La Fiche de Données de Sécurité (FDS) doit être accessible à tout moment pour chaque produit chimique utilisé. Elle indique les risques, les EPI requis et les conduites à tenir en cas d\'accident.'
  },
  {
    category: 'Législation',
    text: 'Quelle loi constitue la base du Code du Travail tunisien ?',
    options: ['Loi n°66-27 du 30 avril 1966', 'Décret n°2000-389', 'Loi n°94-28 du 21 février 1994', 'Décret n°2001-641'],
    correct: 0,
    explanation: 'Le Code du Travail tunisien est fondé sur la Loi n°66-27 du 30 avril 1966. Il a été complété par plusieurs décrets dont le n°2000-389 sur les conditions de travail et le n°2001-641 sur la médecine du travail.'
  },
  {
    category: 'Risques',
    text: 'Quelle maladie professionnelle respiratoire est fréquente dans les cimenteries et carrières tunisiennes ?',
    options: ['L\'asthme allergique', 'La silicose', 'La légionellose', 'La bronchite chronique obstructive liée au tabac'],
    correct: 1,
    explanation: 'La silicose est une maladie professionnelle grave causée par l\'inhalation de poussières de silice cristalline. Elle est fréquente dans les cimenteries, carrières et mines tunisiennes et est reconnue et indemnisée par la CNSS.'
  },
  {
    category: 'Urgences',
    text: 'Quel numéro appeler pour un secours en mer en Tunisie ?',
    options: ['190', '193', '194', '198'],
    correct: 2,
    explanation: 'Le 194 est le numéro de la Garde Maritime tunisienne, responsable des secours et interventions en mer. Pour les noyades sur plage, le 198 (Protection Civile) peut également être contacté.'
  },
  {
    category: 'EPI',
    text: 'Quel type de masque est recommandé pour travailler avec des produits phytosanitaires (pesticides) en agriculture ?',
    options: ['Un masque chirurgical jetable', 'Un masque FFP1 simple', 'Un masque FFP2 ou FFP3 avec filtre adapté', 'Un simple foulard en tissu'],
    correct: 2,
    explanation: 'Pour la manipulation de pesticides, un masque de protection respiratoire de niveau FFP2 minimum (ou FFP3 pour les produits très toxiques) avec filtre adapté aux vapeurs organiques est indispensable pour protéger les voies respiratoires.'
  },
  {
    category: 'Prévention',
    text: 'Qui est responsable de la mise en place des mesures de sécurité au travail dans une entreprise tunisienne ?',
    options: ['Le salarié lui-même uniquement', 'L\'employeur, avec le concours du CHSCT', 'Le médecin du travail exclusivement', 'L\'inspection du travail'],
    correct: 1,
    explanation: 'Selon le Code du Travail tunisien, l\'employeur est le premier responsable de la sécurité au travail. Il doit mettre en place les mesures nécessaires avec le Comité d\'Hygiène, de Sécurité et des Conditions de Travail (CHSCT) dans les entreprises de plus de 40 salariés.'
  },
  {
    category: 'Formation',
    text: 'Quel organisme délivre l\'agrément officiel pour les formations SST (Sauveteur Secouriste du Travail) en Tunisie ?',
    options: ['Le ministère de l\'Éducation Nationale', 'La CNSS en partenariat avec le ministère des Affaires Sociales', 'L\'UGTT exclusivement', 'L\'UTICA'],
    correct: 1,
    explanation: 'En Tunisie, l\'agrément des formations SST est délivré par la CNSS en coordination avec le ministère des Affaires Sociales. Les formateurs doivent être accrédités et les formations régulièrement renouvelées.'
  },
  {
    category: 'Risques',
    text: 'Dans le secteur du BTP en Tunisie, quelle est la distance minimale de sécurité à respecter par rapport à une ligne électrique aérienne de haute tension lors des travaux ?',
    options: ['1 mètre', '3 mètres', '5 mètres', '10 mètres'],
    correct: 2,
    explanation: 'La réglementation tunisienne impose une distance minimale de sécurité de 5 mètres par rapport aux lignes électriques aériennes de haute tension lors de travaux de BTP ou de levage. Cette distance passe à 3 mètres pour la basse tension.'
  },
  {
    category: 'Législation',
    text: 'Dans une entreprise tunisienne de plus de 40 salariés, quel organe est obligatoire pour la gestion de la sécurité ?',
    options: ['Un délégué syndical uniquement', 'Le CHSCT — Comité d\'Hygiène, de Sécurité et des Conditions de Travail', 'Un service de sécurité externalisé', 'Un agent de sécurité incendie'],
    correct: 1,
    explanation: 'Selon le Code du Travail tunisien, tout établissement de plus de 40 salariés doit mettre en place un CHSCT (Comité d\'Hygiène, de Sécurité et des Conditions de Travail), qui se réunit au moins une fois par trimestre.'
  },
  {
    category: 'Prévention',
    text: 'Quelle est la première action à effectuer face à un collègue victime d\'un arrêt cardiaque au travail ?',
    options: ['Appeler immédiatement la famille', 'Alerter les secours (190/198) et commencer la RCP si formé', 'Lui donner de l\'eau et attendre', 'Le déplacer immédiatement vers un endroit plus confortable'],
    correct: 1,
    explanation: 'En cas d\'arrêt cardiaque, la chaîne de survie recommande : 1) Alerter les secours (190 ou 198), 2) Commencer la réanimation cardio-pulmonaire (RCP) si formé, 3) Utiliser un défibrillateur si disponible. Chaque minute compte — la survie diminue de 10% par minute sans réanimation.'
  },
  {
    category: 'Risques',
    text: 'Qu\'est-ce qu\'un "triangle du feu" en matière de prévention incendie ?',
    options: ['Un panneau de signalisation triangulaire d\'alerte incendie', 'Les trois éléments nécessaires à la combustion : combustible, comburant et énergie d\'activation', 'Le nom d\'un extincteur à usage professionnel', 'Une procédure d\'évacuation en triangle'],
    correct: 1,
    explanation: 'Le triangle du feu représente les trois conditions nécessaires à la combustion : un combustible (matière inflammable), un comburant (oxygène de l\'air) et une énergie d\'activation (chaleur, étincelle). Supprimer l\'un de ces éléments éteint le feu — c\'est le principe des extincteurs.'
  },
  {
    category: 'Statistiques',
    text: 'Selon les données CNSS, quel pourcentage des accidents du travail tunisiens sont considérés comme évitables grâce à la prévention ?',
    options: ['30%', '50%', '70%', '90%'],
    correct: 2,
    explanation: 'Les études et rapports de la CNSS estiment que 70% des accidents du travail en Tunisie sont évitables grâce à des mesures de prévention adéquates : port des EPI, formation, organisation du travail et respect des consignes de sécurité.'
  },
  {
    category: 'EPI',
    text: 'Quelle est la durée de validité maximale recommandée d\'un casque de chantier (norme NT 09.02) avant remplacement obligatoire ?',
    options: ['1 an', '3 ans', '5 ans', '10 ans'],
    correct: 1,
    explanation: 'Selon la norme NT 09.02, un casque de chantier doit être remplacé au maximum tous les 3 ans, même s\'il n\'a subi aucun choc visible. Les UV, la chaleur et la sueur dégradent les matériaux et réduisent leur capacité de protection. Tout casque ayant subi un impact doit être immédiatement remplacé.'
  },
  {
    category: 'Risques',
    text: 'Qu\'est-ce que le "stress thermique" en milieu de travail en Tunisie, particulièrement en été ?',
    options: [
      'Un bruit excessif causé par la chaleur des machines',
      'Une surcharge électrique due aux climatiseurs',
      'Un état de détresse physiologique causé par une exposition prolongée à une chaleur excessive',
      'Une réaction allergique aux produits chimiques exposés à la chaleur'
    ],
    correct: 2,
    explanation: 'Le stress thermique survient lorsque le corps ne peut plus maintenir sa température normale face à une chaleur excessive. En Tunisie, les travailleurs en plein air (BTP, agriculture) sont particulièrement exposés en été avec des températures dépassant 40°C. Il peut mener à un coup de chaleur, urgence médicale mortelle.'
  },
  {
    category: 'Législation',
    text: 'Selon le Code du Travail tunisien, à quel âge minimum peut-on légalement employer un jeune dans un travail industriel ?',
    options: ['14 ans', '16 ans', '18 ans', '15 ans'],
    correct: 1,
    explanation: 'Le Code du Travail tunisien fixe à 16 ans l\'âge minimum d\'admission à l\'emploi dans les travaux industriels. En dessous de 18 ans, les jeunes travailleurs bénéficient de protections renforcées : interdiction de travaux dangereux, nuit et heures supplémentaires.'
  },
  {
    category: 'Prévention',
    text: 'Quelle est la règle des "3P" appliquée lors d\'une inspection de sécurité en entreprise ?',
    options: [
      'Prévenir, Protéger, Punir',
      'Planifier, Prévenir, Protéger',
      'Prévoir, Préparer, Perfectionner',
      'Produire, Prévenir, Publier'
    ],
    correct: 1,
    explanation: 'La règle des 3P — Planifier, Prévenir, Protéger — structure la démarche de prévention des risques professionnels : identifier les dangers en amont (Planifier), mettre en place des mesures préventives (Prévenir) et équiper les travailleurs exposés (Protéger).'
  },
  {
    category: 'Risques',
    text: 'Dans le secteur textile tunisien, quel risque lié à la posture est le plus fréquent chez les couturières ?',
    options: [
      'Les brûlures thermiques par vapeur',
      'Les troubles musculo-squelettiques (TMS) du membre supérieur',
      'Les intoxications par colorants chimiques',
      'La perte auditive due aux machines à coudre'
    ],
    correct: 1,
    explanation: 'Les Troubles Musculo-Squelettiques (TMS) — notamment les tendinites, le syndrome du canal carpien et les douleurs cervicales — sont la première maladie professionnelle dans le textile tunisien. Ils résultent de gestes répétitifs, de postures statiques prolongées et d\'une organisation du travail inadaptée.'
  },
  {
    category: 'EPI',
    text: 'Quel type d\'extincteur est interdit d\'utiliser sur un feu électrique (classe E) en Tunisie ?',
    options: [
      'L\'extincteur CO2 (dioxyde de carbone)',
      'L\'extincteur à poudre polyvalente',
      'L\'extincteur à eau pulvérisée',
      'L\'extincteur à mousse (AFFF)'
    ],
    correct: 2,
    explanation: 'Un extincteur à eau (y compris eau pulvérisée) ne doit jamais être utilisé sur un feu électrique : l\'eau conduit l\'électricité et expose l\'utilisateur à un risque d\'électrocution mortel. Pour les feux électriques, le CO2 ou la poudre sont recommandés — après avoir coupé l\'alimentation si possible.'
  },
  {
    category: 'Institutions',
    text: 'Que signifie le sigle INRSST en Tunisie ?',
    options: [
      'Institut National de Réglementation et de Surveillance de la Sécurité au Travail',
      'Institut National de Recherche et de Sécurité en Santé au Travail',
      'Inspection Nationale des Risques et de la Sécurité en Secteur Tunisien',
      'Instance Nationale de Réhabilitation et de Soutien Social au Travail'
    ],
    correct: 1,
    explanation: 'L\'INRSST — Institut National de Recherche et de Sécurité en Santé au Travail — est l\'organisme tunisien de référence pour la recherche, l\'expertise, la documentation et la formation en matière de santé et sécurité professionnelle, sous tutelle du ministère des Affaires Sociales.'
  },
  {
    category: 'Formation',
    text: 'Quelle est la durée standard d\'une formation SST (Sauveteur Secouriste du Travail) initiale agréée en Tunisie ?',
    options: ['4 heures (une demi-journée)', '14 heures (2 jours)', '35 heures (une semaine)', '7 heures (une journée)'],
    correct: 1,
    explanation: 'La formation SST initiale agréée par la CNSS dure 14 heures réparties sur 2 jours. Elle comprend les gestes de premiers secours, la prévention des risques et la conduite à tenir en cas d\'accident. Un recyclage de 7 heures est ensuite requis tous les 24 mois pour maintenir la certification.'
  },
  {
    category: 'Statistiques',
    text: 'Parmi les causes suivantes, laquelle est identifiée comme la première cause d\'accidents mortels du travail en Tunisie selon la CNSS ?',
    options: [
      'Les intoxications aux produits chimiques',
      'Les chutes de hauteur',
      'Les accidents de trajet',
      'Les maladies cardiovasculaires au poste de travail'
    ],
    correct: 1,
    explanation: 'Les chutes de hauteur (échafaudages, toits, tranchées, échelles) constituent la première cause de décès par accident du travail en Tunisie, concentrés principalement dans le secteur BTP. C\'est pourquoi le port du harnais de sécurité et la mise en place de garde-corps sont strictement obligatoires.'
  },
];

export const QUIZ_SIZE = 10;