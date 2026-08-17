export const risks = [
  {
    icon: 'bi bi-buildings', color: 'red',
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
    icon: 'bi bi-tree', color: 'amber',
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
    icon: 'bi bi-building', color: 'blue',
    title: 'Machines industrielles — Textile & Mécanique',
    subtitle: 'Coupures, écrasements, amputations',
    dangers: [
      'Accès aux parties mobiles des machines',
      'Absence de protecteurs ou de carter',
      'Manque d\'arrêt d\'urgence accessible',
      'Exposition au bruit intense (>85 dB)',
    ],
    prevention: [
      'Protecteurs de machines conformes aux normes NT',
      'Bouton d\'arrêt d\'urgence à portée de main',
      'Consignation-déconsignation avant maintenance (LOTO)',
      'Port de protection auditive obligatoire',
    ]
  },
  {
    icon: 'bi bi-fire', color: 'red',
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
    icon: 'bi bi-truck', color: 'amber',
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
    icon: 'bi bi-wind', color: 'blue',
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
    icon: 'bi bi-lightning', color: 'red',
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
    icon: 'bi bi-droplet', color: 'amber',
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
