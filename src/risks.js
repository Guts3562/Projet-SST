export const risks = [
  {
    icon: 'bi bi-buildings', color: 'red',
    title: 'Chutes de hauteur — BTP',
    subtitle: 'Risque important lié aux travaux en hauteur',
    dangers: [
      'Échafaudages non conformes aux normes NT',
      'Absence de garde-corps et de filets de sécurité',
      'Travaux sur toitures sans EPI adaptés',
      'Sols glissants et surfaces instables',
    ],
    prevention: [
      'Choisir un système de protection contre les chutes adapté au risque et aux exigences applicables',
      'Échafaudages certifiés et vérifiés périodiquement',
      'Évaluer le risque de chute et former les intervenants avant les travaux en hauteur',
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
      'Consulter la FDS et les consignes applicables avant utilisation',
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
      'Exposition au bruit potentiellement dangereux',
    ],
    prevention: [
      'Protecteurs de machines conformes aux normes NT',
      'Bouton d\'arrêt d\'urgence à portée de main',
      'Consignation-déconsignation avant maintenance (LOTO)',
      'Évaluer l’exposition au bruit et choisir une protection auditive adaptée',
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
      'Vérifier et entretenir les équipements de lutte contre l’incendie selon les règles applicables',
      'Prévoir des consignes d’évacuation adaptées au site',
      'Organiser des exercices selon les exigences applicables et les risques du site',
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
      'Prévoir des pauses adaptées à la durée du trajet et aux exigences applicables',
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
      'Évaluer les besoins en ventilation et privilégier le captage à la source',
      'Masques FFP2/FFP3 adaptés aux poussières',
      'Surveillance médicale semestrielle renforcée',
      'Vérifier les procédures de déclaration applicables auprès des organismes compétents',
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
      'Vérifier les qualifications et autorisations nécessaires avant toute intervention électrique',
      'Vérification périodique par électricien agréé',
      'Procédure de consignation avant intervention',
      'Faire vérifier les protections électriques par une personne compétente',
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
