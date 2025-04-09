import { atom } from 'nanostores';
import type { RuleType } from '../types/rules';

// Définir l'interface Rule directement dans ce fichier pour éviter les problèmes d'hydratation
interface Rule {
  id: string;
  type: 'addition' | 'subtraction' | 'multiplication' | 'comparison' | 'decimal';
  title: string;
  description: string;
  examples: Array<{
    problem: string;
    solution: string;
    explanation: string;
  }>;
  steps: string[];
  tips: string[];
}

const defaultRules: Record<RuleType, Rule[]> = {
  addition: [
    {
      id: 'add-1',
      type: 'addition',
      title: 'Addition simple',
      description: 'Comment additionner deux nombres',
      steps: [
        'Aligner les nombres verticalement en faisant correspondre les unités',
        'Commencer par additionner les unités',
        'Si la somme dépasse 9, garder l\'unité et retenir la dizaine',
        'Passer aux dizaines en ajoutant la retenue',
        'Continuer ainsi jusqu\'au dernier chiffre'
      ],
      examples: [
        {
          problem: '24 + 13',
          solution: '37',
          explanation: 'Additionner 4 et 3 (unités) = 7, puis 2 et 1 (dizaines) = 3'
        }
      ],
      tips: [
        'Toujours commencer par les unités',
        'Ne pas oublier les retenues'
      ]
    },
    {
      id: 'add-dec-1',
      type: 'decimal',
      title: 'Addition de nombres décimaux - Principes généraux',
      description: 'Comment additionner des nombres décimaux',
      steps: [
        'Aligner les nombres verticalement en faisant correspondre les virgules',
        'Ajouter des zéros après la virgule si nécessaire pour avoir le même nombre de décimales',
        'Additionner comme avec des nombres entiers',
        'Placer la virgule dans le résultat à la même position que dans les nombres'
      ],
      examples: [
        {
          problem: '3,5 + 2,7',
          solution: '6,2',
          explanation: 'Additionner 5 et 7 dixièmes = 12 dixièmes = 1 unité et 2 dixièmes, puis 3 + 2 + 1 = 6 unités'
        }
      ],
      tips: [
        'La virgule doit être alignée verticalement',
        'Un nombre peut être complété avec des zéros après la virgule',
        'Le nombre de décimales du résultat est le même que celui des nombres avec le plus de décimales'
      ]
    },
    {
      id: 'add-dec-2',
      type: 'decimal',
      title: 'Addition de dixièmes sans retenue',
      description: 'Comment additionner des nombres décimaux avec un chiffre après la virgule',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Additionner les dixièmes entre eux',
        'Additionner les unités entre elles',
        'Placer la virgule dans le résultat'
      ],
      examples: [
        {
          problem: '0,2 + 0,3',
          solution: '0,5',
          explanation: 'Additionner 2 dixièmes et 3 dixièmes = 5 dixièmes, soit 0,5'
        }
      ],
      tips: [
        'Les dixièmes sont les chiffres juste après la virgule',
        'Si la somme des dixièmes est inférieure à 10, il n\'y a pas de retenue'
      ]
    },
    {
      id: 'add-dec-3',
      type: 'decimal',
      title: 'Addition de centièmes sans retenue',
      description: 'Comment additionner des nombres avec deux chiffres après la virgule',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Additionner les centièmes entre eux',
        'Additionner les dixièmes entre eux',
        'Additionner les unités entre elles',
        'Placer la virgule dans le résultat'
      ],
      examples: [
        {
          problem: '0,02 + 0,03',
          solution: '0,05',
          explanation: 'Additionner 2 centièmes et 3 centièmes = 5 centièmes, soit 0,05'
        }
      ],
      tips: [
        'Les centièmes sont le deuxième chiffre après la virgule',
        'Attention à bien placer les zéros avant les chiffres significatifs'
      ]
    },
    {
      id: 'add-dec-4',
      type: 'decimal',
      title: 'Addition avec précisions différentes',
      description: 'Comment additionner des nombres qui n\'ont pas le même nombre de décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Ajouter des zéros pour que les deux nombres aient le même nombre de décimales',
        'Additionner comme avec des nombres entiers',
        'Placer la virgule dans le résultat'
      ],
      examples: [
        {
          problem: '0,2 + 0,04',
          solution: '0,24',
          explanation: 'Transformer 0,2 en 0,20, puis additionner 0,20 + 0,04 = 0,24'
        }
      ],
      tips: [
        'Vous pouvez ajouter autant de zéros que nécessaire après la virgule d\'un nombre',
        'Le résultat doit avoir autant de décimales que le nombre qui en a le plus'
      ]
    },
    {
      id: 'add-dec-5',
      type: 'decimal',
      title: 'Addition de dixièmes avec retenue',
      description: 'Comment gérer la retenue lors de l\'addition de décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Additionner les dixièmes entre eux',
        'Si la somme des dixièmes est supérieure ou égale à 10, conserver les unités et reporter la dizaine',
        'Additionner les unités en incluant la retenue'
      ],
      examples: [
        {
          problem: '0,5 + 0,8',
          solution: '1,3',
          explanation: '5 dixièmes + 8 dixièmes = 13 dixièmes = 1 unité et 3 dixièmes, soit 1,3'
        }
      ],
      tips: [
        'La somme de deux dixièmes peut donner une unité',
        'Ne pas oublier de reporter la retenue dans la colonne des unités'
      ]
    },
    {
      id: 'add-dec-6',
      type: 'decimal',
      title: 'Addition de centièmes avec retenue',
      description: 'Comment gérer la retenue lors de l\'addition de centièmes',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Additionner les centièmes entre eux',
        'Si la somme des centièmes est supérieure ou égale à 10, conserver les unités et reporter la dizaine aux dixièmes',
        'Additionner les dixièmes en incluant la retenue',
        'Continuer avec les unités'
      ],
      examples: [
        {
          problem: '0,05 + 0,08',
          solution: '0,13',
          explanation: '5 centièmes + 8 centièmes = 13 centièmes = 1 dixième et 3 centièmes, soit 0,13'
        }
      ],
      tips: [
        'La retenue se propage de droite à gauche',
        'La somme des centièmes peut donner un dixième'
      ]
    },
    {
      id: 'add-dec-7',
      type: 'decimal',
      title: 'Addition avec nombre à plusieurs décimales',
      description: 'Comment additionner quand l\'un des nombres a plusieurs décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Ajouter des zéros si nécessaire pour avoir le même nombre de décimales',
        'Additionner colonne par colonne en commençant par la droite',
        'Gérer les retenues comme d\'habitude'
      ],
      examples: [
        {
          problem: '0,1 + 0,77',
          solution: '0,87',
          explanation: 'Transformer 0,1 en 0,10, puis additionner 0,10 + 0,77 = 0,87'
        }
      ],
      tips: [
        'Il est essentiel d\'aligner correctement les virgules',
        'Les retenues fonctionnent de la même manière que pour les nombres entiers'
      ]
    },
    {
      id: 'add-dec-8',
      type: 'decimal',
      title: 'Addition d\'entier et décimal',
      description: 'Comment additionner un nombre entier et un nombre décimal',
      steps: [
        'Écrire le nombre entier avec une virgule suivie de zéros si nécessaire',
        'Aligner les nombres en faisant correspondre les virgules',
        'Additionner comme d\'habitude'
      ],
      examples: [
        {
          problem: '6 + 0,1',
          solution: '6,1',
          explanation: 'Transformer 6 en 6,0 puis additionner 6,0 + 0,1 = 6,1'
        }
      ],
      tips: [
        'Un nombre entier peut être écrit avec une virgule suivie de zéros',
        'Par exemple, 6 = 6,0 = 6,00 = 6,000 etc.'
      ]
    }
  ], subtraction: [
    {
      id: 'sub-1',
      type: 'subtraction',
      title: 'Soustraction simple',
      description: 'Comment soustraire deux nombres',
      steps: [
        'Aligner les nombres verticalement',
        'Commencer par les unités',
        'Si le chiffre du haut est plus petit, emprunter une dizaine',
        'Soustraire chaque chiffre',
      ],
      examples: [
        {
          problem: '52 - 31',
          solution: '21',
          explanation: 'Soustraire 1 de 2 (unités) = 1, puis 3 de 5 (dizaines) = 2'
        }
      ],
      tips: [
        'Le plus grand nombre doit toujours être en haut',
        'Bien gérer les emprunts'
      ]
    },
    {
      id: 'sub-dec-1',
      type: 'decimal',
      title: 'Soustraction de nombres décimaux - Principes généraux',
      description: 'Comment soustraire des nombres décimaux',
      steps: [
        'Aligner les nombres verticalement en faisant correspondre les virgules',
        'Ajouter des zéros après la virgule si nécessaire',
        'Soustraire comme avec des nombres entiers',
        'Placer la virgule dans le résultat à la même position'
      ],
      examples: [
        {
          problem: '5,8 - 2,3',
          solution: '3,5',
          explanation: 'Soustraire 3 dixièmes de 8 dixièmes = 5 dixièmes, puis 2 de 5 = 3'
        }
      ],
      tips: [
        'La virgule doit être alignée verticalement',
        'On peut ajouter des zéros après la virgule sans changer la valeur du nombre',
        'Le résultat garde le même nombre de décimales que les nombres de départ'
      ]
    },
    {
      id: 'sub-dec-2',
      type: 'decimal',
      title: 'Soustraction de dixièmes sans emprunt',
      description: 'Comment soustraire des nombres décimaux avec des dixièmes sans avoir besoin d\'emprunter',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Vérifier que le dixième du haut est plus grand que celui du bas',
        'Soustraire les dixièmes entre eux',
        'Soustraire les unités entre elles'
      ],
      examples: [
        {
          problem: '4,9 - 2,3',
          solution: '2,6',
          explanation: '9 dixièmes > 3 dixièmes, donc 9 - 3 = 6 dixièmes, puis 4 - 2 = 2 unités'
        }
      ],
      tips: [
        'Vérifiez d\'abord si un emprunt est nécessaire',
        'Cette méthode fonctionne quand le chiffre des dixièmes du premier nombre est supérieur à celui du second'
      ]
    },
    {
      id: 'sub-dec-3',
      type: 'decimal',
      title: 'Soustraction de centièmes sans emprunt',
      description: 'Comment soustraire des nombres décimaux avec des centièmes sans avoir besoin d\'emprunter',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Vérifier que le centième du haut est plus grand que celui du bas',
        'Soustraire les centièmes entre eux',
        'Soustraire les dixièmes entre eux',
        'Soustraire les unités entre elles'
      ],
      examples: [
        {
          problem: '3,84 - 1,62',
          solution: '2,22',
          explanation: '4 centièmes > 2 centièmes, donc 4 - 2 = 2 centièmes; puis 8 dixièmes > 6 dixièmes, donc 8 - 6 = 2 dixièmes; puis 3 - 1 = 2 unités'
        }
      ],
      tips: [
        'S\'assurer que chaque position du premier nombre est supérieure ou égale à celle du second',
        'Ce cas est le plus simple car il n\'y a pas d\'emprunt à gérer'
      ]
    },
    {
      id: 'sub-dec-4',
      type: 'decimal',
      title: 'Soustraction avec précisions différentes',
      description: 'Comment soustraire des nombres qui n\'ont pas le même nombre de décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Ajouter des zéros pour que les deux nombres aient le même nombre de décimales',
        'Soustraire comme d\'habitude en gérant les emprunts si nécessaire'
      ],
      examples: [
        {
          problem: '5,2 - 3,15',
          solution: '2,05',
          explanation: 'Transformer 5,2 en 5,20, puis soustraire 5,20 - 3,15 = 2,05'
        }
      ],
      tips: [
        'Ajoutez des zéros après la virgule pour égaliser le nombre de décimales',
        'Vérifiez que votre résultat a le bon nombre de décimales'
      ]
    },
    {
      id: 'sub-dec-5',
      type: 'decimal',
      title: 'Soustraction de dixièmes avec emprunt',
      description: 'Comment gérer l\'emprunt lors de la soustraction de décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Si le dixième du haut est plus petit que celui du bas, emprunter une unité',
        'Une unité empruntée vaut 10 dixièmes',
        'Effectuer la soustraction avec la nouvelle valeur'
      ],
      examples: [
        {
          problem: '5,3 - 2,8',
          solution: '2,5',
          explanation: '3 dixièmes < 8 dixièmes, donc on emprunte 1 à 5, ce qui donne 4 unités et 13 dixièmes; 13 - 8 = 5 dixièmes, puis 4 - 2 = 2 unités'
        }
      ],
      tips: [
        'Quand on emprunte une unité, elle devient 10 dixièmes',
        'Toujours vérifier si un emprunt est nécessaire avant de soustraire'
      ]
    },
    {
      id: 'sub-dec-6',
      type: 'decimal',
      title: 'Soustraction de centièmes avec emprunt',
      description: 'Comment gérer l\'emprunt lors de la soustraction de centièmes',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Si le centième du haut est plus petit, emprunter un dixième',
        'Un dixième emprunté vaut 10 centièmes',
        'Effectuer la soustraction avec la nouvelle valeur'
      ],
      examples: [
        {
          problem: '3,45 - 2,18',
          solution: '1,27',
          explanation: '5 centièmes < 8 centièmes, donc on emprunte 1 à 4 dixièmes, ce qui donne 3 dixièmes et 15 centièmes; 15 - 8 = 7 centièmes, puis 3 - 1 = 2 dixièmes, puis 3 - 2 = 1 unité'
        }
      ],
      tips: [
        'Un dixième = 10 centièmes',
        'Les emprunts se propagent de droite à gauche comme pour les nombres entiers'
      ]
    },
    {
      id: 'sub-dec-7',
      type: 'decimal',
      title: 'Soustraction de nombres mixtes',
      description: 'Comment soustraire des nombres mixtes avec différentes précisions décimales',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'Ajouter des zéros au besoin pour équilibrer les décimales',
        'Vérifier si des emprunts sont nécessaires et les gérer',
        'Soustraire en commençant par les plus petites positions'
      ],
      examples: [
        {
          problem: '0,27 - 0,09',
          solution: '0,18',
          explanation: '7 centièmes < 9 centièmes, donc on emprunte 1 à 2 dixièmes, ce qui donne 1 dixième et 17 centièmes; 17 - 9 = 8 centièmes, puis 1 - 0 = 1 dixième'
        }
      ],
      tips: [
        'Dans les nombres mixtes, on peut avoir besoin d\'emprunts à plusieurs niveaux',
        'Traitez toujours les positions de droite à gauche'
      ]
    },
    {
      id: 'sub-dec-8',
      type: 'decimal',
      title: 'Soustraction d\'un entier et d\'un décimal',
      description: 'Comment soustraire un nombre entier d\'un nombre décimal ou vice versa',
      steps: [
        'Écrire le nombre entier avec une virgule suivie de zéros',
        'Aligner les nombres en faisant correspondre les virgules',
        'Soustraire comme d\'habitude en gérant les emprunts si nécessaire'
      ],
      examples: [
        {
          problem: '8 - 2,5',
          solution: '5,5',
          explanation: 'Transformer 8 en 8,0, puis soustraire 8,0 - 2,5 = 5,5'
        }
      ],
      tips: [
        'Un nombre entier peut être écrit avec une virgule suivie de zéros',
        'Par exemple, 8 = 8,0 = 8,00 = 8,000 etc.',
        'Faire attention aux emprunts entre l\'unité et les dixièmes'
      ]
    }
  ],
  multiplication: [
    {
      id: 'mult-1',
      type: 'multiplication',
      title: 'Tables de multiplication',
      description: 'Comment utiliser les tables de multiplication',
      steps: [
        'Apprendre les tables de 1 à 12',
        'Pour une multiplication à plusieurs chiffres, commencer par les unités',
        'Multiplier chaque chiffre en gérant les retenues',
        'Additionner les résultats intermédiaires'
      ],
      examples: [
        {
          problem: '6 × 7',
          solution: '42',
          explanation: 'Utiliser la table de 6 ou de 7 pour trouver le résultat'
        }
      ],
      tips: [
        'Réviser régulièrement les tables',
        'Utiliser les doubles pour faciliter les calculs'
      ]
    },
    {
      id: 'mult-dec-1',
      type: 'decimal',
      title: 'Multiplication de nombres décimaux - Principes généraux',
      description: 'Comment multiplier des nombres décimaux',
      steps: [
        'Compter le nombre total de chiffres après la virgule dans les deux nombres',
        'Multiplier comme avec des nombres entiers (en ignorant la virgule)',
        'Dans le résultat, placer la virgule en comptant depuis la droite autant de chiffres qu\'il y en avait au total'
      ],
      examples: [
        {
          problem: '2,5 × 1,2',
          solution: '3,0',
          explanation: 'Au total 2 chiffres après la virgule (1 + 1), multiplier 25 × 12 = 300, donc 3,0'
        }
      ],
      tips: [
        'Compter le nombre total de décimales dans les deux nombres',
        'Multiplier comme des entiers puis replacer la virgule',
        'Le résultat a autant de décimales que la somme des décimales des nombres'
      ]
    },
    {
      id: 'mult-dec-2',
      type: 'decimal',
      title: 'Multiplication d\'un entier par un décimal',
      description: 'Comment multiplier un nombre entier par un nombre décimal',
      steps: [
        'Repérer le nombre de chiffres après la virgule dans le nombre décimal',
        'Multiplier comme si les deux nombres étaient entiers',
        'Placer la virgule dans le résultat en comptant depuis la droite autant de chiffres qu\'il y avait de décimales'
      ],
      examples: [
        {
          problem: '3 × 0,3',
          solution: '0,9',
          explanation: 'Un chiffre après la virgule dans 0,3, multiplier 3 × 3 = 9, donc 0,9 (1 décimale)'
        }
      ],
      tips: [
        'Le résultat aura autant de décimales que le nombre décimal',
        'On peut écrire l\'entier avec une virgule (3 = 3,0) pour faciliter la visualisation'
      ]
    },
    {
      id: 'mult-dec-3',
      type: 'decimal',
      title: 'Multiplication avec changement de position de virgule',
      description: 'Comment gérer la virgule lors de multiplications avec des grands nombres',
      steps: [
        'Compter le nombre de décimales dans les deux facteurs',
        'Multiplier comme avec des entiers, en tenant compte des retenues',
        'Placer la virgule en comptant depuis la droite le nombre total de décimales'
      ],
      examples: [
        {
          problem: '6 × 0,7',
          solution: '4,2',
          explanation: 'Un chiffre après la virgule dans 0,7, multiplier 6 × 7 = 42, donc 4,2 (1 décimale)'
        }
      ],
      tips: [
        'Quand le résultat a plusieurs chiffres, faire attention à bien placer la virgule',
        'Vérifier que l\'ordre de grandeur du résultat est logique'
      ]
    },
    {
      id: 'mult-dec-4',
      type: 'decimal',
      title: 'Multiplication de deux nombres décimaux',
      description: 'Comment multiplier deux nombres qui ont chacun une décimale',
      steps: [
        'Compter le nombre total de décimales (1+1=2)',
        'Multiplier les nombres comme s\'ils étaient entiers',
        'Placer la virgule en comptant 2 chiffres depuis la droite'
      ],
      examples: [
        {
          problem: '0,2 × 0,3',
          solution: '0,06',
          explanation: 'Au total 2 chiffres après la virgule (1+1), multiplier 2 × 3 = 6, donc 0,06 (2 décimales)'
        }
      ],
      tips: [
        'Le résultat a souvent un chiffre de plus que les facteurs',
        'Attention au nombre de zéros nécessaires avant le premier chiffre significatif'
      ]
    },
    {
      id: 'mult-dec-5',
      type: 'decimal',
      title: 'Multiplication de décimaux avec retenue',
      description: 'Comment gérer les retenues lors de la multiplication de décimaux',
      steps: [
        'Compter le nombre total de décimales dans les facteurs',
        'Multiplier comme avec des entiers en gérant les retenues',
        'Placer la virgule dans le résultat'
      ],
      examples: [
        {
          problem: '0,5 × 0,8',
          solution: '0,40',
          explanation: 'Au total 2 chiffres après la virgule (1+1), multiplier 5 × 8 = 40, donc 0,40 (2 décimales)'
        }
      ],
      tips: [
        'Ne pas oublier les retenues comme pour les nombres entiers',
        'Vérifier en fin de calcul que le nombre de décimales correspond bien à la somme des décimales des facteurs'
      ]
    },
    {
      id: 'mult-dec-6',
      type: 'decimal',
      title: 'Multiplication avec différentes précisions',
      description: 'Comment multiplier des nombres avec différents nombres de décimales',
      steps: [
        'Compter précisément le nombre de décimales dans chaque facteur',
        'Additionner ces nombres pour savoir combien de décimales aura le résultat',
        'Multiplier comme avec des entiers',
        'Placer la virgule dans le résultat en comptant le bon nombre de décimales depuis la droite'
      ],
      examples: [
        {
          problem: '0,5 × 0,03',
          solution: '0,015',
          explanation: 'Au total 3 chiffres après la virgule (1+2), multiplier 5 × 3 = 15, donc 0,015 (3 décimales)'
        }
      ],
      tips: [
        'Bien vérifier le nombre de décimales dans chaque facteur',
        'Ajouter des zéros à droite si nécessaire pour obtenir le bon nombre de décimales',
        'Le résultat aura souvent besoin de zéros à gauche des chiffres significatifs'
      ]
    },
    {
      id: 'mult-dec-7',
      type: 'decimal',
      title: 'Multiplication par 10, 100, 1000',
      description: 'Comment multiplier des nombres décimaux par des puissances de 10',
      steps: [
        'Pour multiplier par 10, déplacer la virgule d\'un rang vers la droite',
        'Pour multiplier par 100, déplacer la virgule de deux rangs vers la droite',
        'Pour multiplier par 1000, déplacer la virgule de trois rangs vers la droite',
        'Ajouter des zéros si nécessaire'
      ],
      examples: [
        {
          problem: '0,48 × 10',
          solution: '4,8',
          explanation: 'Déplacer la virgule d\'un rang vers la droite : 0,48 → 4,8'
        },
        {
          problem: '0,3 × 100',
          solution: '30',
          explanation: 'Déplacer la virgule de deux rangs vers la droite : 0,3 → 3,0 → 30'
        }
      ],
      tips: [
        'Le nombre de rangs à déplacer correspond au nombre de zéros dans la puissance de 10',
        'Si on déplace la virgule au-delà du dernier chiffre, on ajoute des zéros'
      ]
    },
    {
      id: 'mult-dec-8',
      type: 'decimal',
      title: 'Multiplication par 0,1, 0,01, 0,001',
      description: 'Comment multiplier des nombres décimaux par des puissances négatives de 10',
      steps: [
        'Pour multiplier par 0,1, déplacer la virgule d\'un rang vers la gauche',
        'Pour multiplier par 0,01, déplacer la virgule de deux rangs vers la gauche',
        'Pour multiplier par 0,001, déplacer la virgule de trois rangs vers la gauche',
        'Ajouter des zéros si nécessaire'
      ],
      examples: [
        {
          problem: '4,8 × 0,1',
          solution: '0,48',
          explanation: 'Déplacer la virgule d\'un rang vers la gauche : 4,8 → 0,48'
        },
        {
          problem: '3 × 0,01',
          solution: '0,03',
          explanation: 'Déplacer la virgule de deux rangs vers la gauche : 3 → 0,3 → 0,03'
        }
      ],
      tips: [
        'Le nombre de rangs à déplacer correspond au nombre de zéros après le chiffre 1 dans le décimal',
        'Si on déplace la virgule au-delà du premier chiffre, on ajoute des zéros après le 0,'
      ]
    },
    {
      id: 'mult-dec-9',
      type: 'decimal',
      title: 'Multiplication à deux chiffres avec décimales',
      description: 'Comment multiplier un nombre décimal par un nombre à deux chiffres',
      steps: [
        'Décomposer le multiplicateur en dizaines et unités',
        'Multiplier le nombre décimal par les unités',
        'Multiplier le nombre décimal par les dizaines (et multiplier par 10)',
        'Additionner les deux résultats intermédiaires',
        'Placer la virgule en fonction du nombre total de décimales'
      ],
      examples: [
        {
          problem: '0,72 × 25',
          solution: '18,00',
          explanation: '0,72 × 5 = 3,60 puis 0,72 × 20 = 14,40 et enfin 3,60 + 14,40 = 18,00'
        }
      ],
      tips: [
        'On peut aussi multiplier comme d\'habitude et placer la virgule à la fin',
        'Vérifier que l\'ordre de grandeur du résultat est cohérent'
      ]
    }
  ],
  comparison: [
    {
      id: 'comp-1',
      type: 'comparison',
      title: 'Comparaison de nombres',
      description: 'Comment comparer deux nombres',
      steps: [
        'Comparer d\'abord le nombre de chiffres',
        'Si même nombre de chiffres, comparer chiffre par chiffre de gauche à droite',
        'Utiliser le symbole < (plus petit que) ou > (plus grand que)'
      ],
      examples: [
        {
          problem: '45 ? 32',
          solution: '45 > 32',
          explanation: 'En comparant les dizaines : 4 > 3, donc 45 > 32'
        }
      ],
      tips: [
        'Le symbole < ressemble à un L pour "Less than"',
        'Le symbole > pointe vers le plus grand nombre'
      ]
    },
    {
      id: 'comp-dec-1',
      type: 'decimal',
      title: 'Comparaison de nombres décimaux',
      description: 'Comment comparer des nombres décimaux',
      steps: [
        'Si besoin, ajouter des zéros après la virgule pour avoir le même nombre de décimales',
        'Comparer d\'abord les parties entières',
        'Si les parties entières sont égales, comparer chiffre par chiffre après la virgule'
      ],
      examples: [
        {
          problem: '3,14 ? 3,2',
          solution: '3,14 < 3,20',
          explanation: 'En ajoutant un zéro : 3,20 > 3,14 car après 3, 20 > 14'
        }
      ],
      tips: [
        'On peut ajouter des zéros après la virgule sans changer la valeur',
        '0,20 est égal à 0,2',
        'Comparer les nombres de gauche à droite'
      ]
    }
  ],
  decimal: [
    {
      id: 'dec-1',
      type: 'decimal',
      title: 'Structure des nombres décimaux',
      description: 'Comment comprendre la structure des nombres décimaux',
      steps: [
        'Identifier la partie entière (à gauche de la virgule)',
        'Identifier la partie décimale (à droite de la virgule)',
        'Reconnaître que le premier chiffre après la virgule représente les dixièmes',
        'Le deuxième chiffre représente les centièmes',
        'Le troisième chiffre représente les millièmes, etc.'
      ],
      examples: [
        {
          problem: '23,456',
          solution: '23 unités, 4 dixièmes, 5 centièmes, 6 millièmes',
          explanation: '23 est la partie entière, 4 est en position des dixièmes, 5 est en position des centièmes, 6 est en position des millièmes'
        }
      ],
      tips: [
        'La virgule sépare la partie entière de la partie décimale',
        'Plus on s\'éloigne de la virgule vers la droite, plus la valeur du chiffre est petite',
        'Chaque position décimale est 10 fois plus petite que la précédente'
      ]
    },
    {
      id: 'dec-2',
      type: 'decimal',
      title: 'Lecture des nombres décimaux',
      description: 'Comment lire et énoncer correctement un nombre décimal',
      steps: [
        'Lire d\'abord la partie entière',
        'Dire "virgule"',
        'Lire les chiffres après la virgule un par un ou sous forme de nombre entier suivi de l\'unité décimale'
      ],
      examples: [
        {
          problem: '5,23',
          solution: 'Cinq virgule vingt-trois ou cinq unités et vingt-trois centièmes',
          explanation: '5 est la partie entière, 23 représente les centièmes'
        }
      ],
      tips: [
        'On peut dire "5 virgule 2 3" ou "5 unités et 23 centièmes"',
        'Ne jamais dire "5 virgule 23" comme "cinq virgule deux trois"',
        'Pour les mesures, on spécifie souvent l\'unité : 5,23 mètres'
      ]
    },
    {
      id: 'dec-3',
      type: 'decimal',
      title: 'Valeur des chiffres dans un nombre décimal',
      description: 'Comment déterminer la valeur de chaque chiffre dans un nombre décimal',
      steps: [
        'Identifier la position de chaque chiffre par rapport à la virgule',
        'Attribuer la valeur correspondante : unités, dixièmes, centièmes, etc.',
        'Calculer la valeur réelle de chaque chiffre en fonction de sa position'
      ],
      examples: [
        {
          problem: '12,345',
          solution: '1 dizaine = 10, 2 unités = 2, 3 dixièmes = 0,3, 4 centièmes = 0,04, 5 millièmes = 0,005',
          explanation: 'Chaque chiffre a une valeur qui dépend de sa position'
        }
      ],
      tips: [
        'Un chiffre en position des dixièmes vaut 1/10 de sa valeur faciale',
        'Un chiffre en position des centièmes vaut 1/100 de sa valeur faciale',
        'La valeur d\'un nombre peut s\'écrire comme somme des valeurs de ses chiffres'
      ]
    },
    {
      id: 'dec-4',
      type: 'decimal',
      title: 'Équivalence des nombres décimaux',
      description: 'Comment reconnaître des nombres décimaux équivalents',
      steps: [
        'Comparer les parties entières des nombres',
        'Comparer les parties décimales en tenant compte de la position',
        'Reconnaître que l\'ajout de zéros à la fin d\'un nombre décimal ne change pas sa valeur'
      ],
      examples: [
        {
          problem: '0,5 et 0,50',
          solution: '0,5 = 0,50',
          explanation: 'Ajouter un zéro à la fin d\'un nombre décimal ne change pas sa valeur'
        }
      ],
      tips: [
        '0,5 = 0,50 = 0,500 = 0,5000 etc.',
        'En revanche, ajouter un zéro entre la virgule et les autres chiffres change la valeur : 0,5 ≠ 0,05',
        'Ajouter un zéro avant la virgule ne change pas la valeur : 0,5 = 00,5'
      ]
    },
    {
      id: 'dec-5',
      type: 'decimal',
      title: 'Conversion de fractions en nombres décimaux',
      description: 'Comment convertir une fraction en nombre décimal',
      steps: [
        'Diviser le numérateur par le dénominateur',
        'Le résultat est le nombre décimal équivalent',
        'La division peut donner un nombre décimal exact ou périodique'
      ],
      examples: [
        {
          problem: '3/4',
          solution: '0,75',
          explanation: 'En divisant 3 par 4 : 3 ÷ 4 = 0,75'
        }
      ],
      tips: [
        'Les fractions dont le dénominateur est 10, 100, 1000, etc. sont faciles à convertir',
        'Certaines fractions donnent des décimaux périodiques (ex: 1/3 = 0,333...)',
        'Pour les fractions complexes, utiliser la division posée'
      ]
    },
    {
      id: 'dec-6',
      type: 'decimal',
      title: 'Conversion de nombres décimaux en fractions',
      description: 'Comment convertir un nombre décimal en fraction',
      steps: [
        'Écrire le nombre décimal sous forme de numérateur divisé par 1',
        'Multiplier par 10, 100, 1000, etc. pour éliminer la virgule',
        'Simplifier la fraction si possible'
      ],
      examples: [
        {
          problem: '0,75',
          solution: '75/100 = 3/4',
          explanation: '0,75 = 75/100, qui peut se simplifier en 3/4'
        }
      ],
      tips: [
        'Pour un nombre avec 1 décimale, le dénominateur est 10',
        'Pour un nombre avec 2 décimales, le dénominateur est 100',
        'Ne pas oublier de simplifier la fraction finale'
      ]
    },
    {
      id: 'dec-7',
      type: 'decimal',
      title: 'Arrondir les nombres décimaux',
      description: 'Comment arrondir un nombre décimal à une position donnée',
      steps: [
        'Identifier la position à laquelle il faut arrondir',
        'Observer le chiffre suivant cette position',
        'Si ce chiffre est inférieur à 5, on conserve le nombre tel quel',
        'Si ce chiffre est supérieur ou égal à 5, on augmente de 1 le chiffre de la position visée'
      ],
      examples: [
        {
          problem: 'Arrondir 3,46 au dixième',
          solution: '3,5',
          explanation: 'Le chiffre suivant le dixième est 6, qui est supérieur à 5, donc on arrondit à 3,5'
        }
      ],
      tips: [
        'La règle d\'arrondi la plus courante est "inférieur à 5, on conserve ; supérieur ou égal à 5, on augmente"',
        'Après avoir arrondi, tous les chiffres à droite de la position d\'arrondi sont supprimés',
        'L\'arrondi permet de simplifier un nombre tout en gardant une approximation précise'
      ]
    },
    {
      id: 'dec-8',
      type: 'decimal',
      title: 'Ordre de grandeur des nombres décimaux',
      description: 'Comment estimer l\'ordre de grandeur d\'un nombre décimal',
      steps: [
        'Identifier la partie entière du nombre',
        'Observer la première décimale pour déterminer si on arrondit à l\'entier supérieur ou inférieur',
        'Utiliser cette approximation comme ordre de grandeur'
      ],
      examples: [
        {
          problem: 'Ordre de grandeur de 23,7',
          solution: 'Environ 24',
          explanation: 'La partie entière est 23, et comme la première décimale est 7 (supérieure à 5), on arrondit à 24'
        }
      ],
      tips: [
        'L\'ordre de grandeur sert à avoir une idée approximative de la taille du nombre',
        'Utile pour estimer rapidement un résultat ou vérifier si un calcul est cohérent',
        'On peut aussi arrondir à la dizaine, centaine ou autre puissance de 10 proche'
      ]
    },
    {
      id: 'dec-9',
      type: 'decimal',
      title: 'Encadrement de nombres décimaux',
      description: 'Comment encadrer un nombre décimal entre deux entiers ou deux décimaux',
      steps: [
        'Pour un encadrement par des entiers, identifier l\'entier immédiatement inférieur et supérieur',
        'Pour un encadrement par des dixièmes, identifier les dixièmes immédiatement inférieurs et supérieurs',
        'Écrire l\'encadrement sous la forme "a < x < b"'
      ],
      examples: [
        {
          problem: 'Encadrer 3,47 par des entiers',
          solution: '3 < 3,47 < 4',
          explanation: '3,47 est compris entre 3 et 4'
        }
      ],
      tips: [
        'Un nombre décimal est toujours encadré par deux entiers consécutifs',
        'Pour encadrer par des dixièmes, centièmes, etc., le principe est le même',
        'L\'encadrement peut être de plus en plus précis selon les besoins'
      ]
    },
    {
      id: 'dec-10',
      type: 'decimal',
      title: 'Positionnement sur une droite graduée',
      description: 'Comment placer des nombres décimaux sur une droite graduée',
      steps: [
        'Identifier l\'échelle de la droite graduée',
        'Repérer les graduations principales (souvent des entiers)',
        'Estimer la position du nombre décimal entre ces graduations',
        'Placer le nombre proportionnellement à sa valeur'
      ],
      examples: [
        {
          problem: 'Placer 2,7 sur une droite graduée',
          solution: 'Position aux 7 dixièmes entre 2 et 3',
          explanation: '2,7 est placé à 7/10 de la distance entre 2 et 3'
        }
      ],
      tips: [
        'Visualiser les dixièmes comme des divisions régulières entre deux entiers',
        'Plus la partie décimale est grande, plus le point est proche de l\'entier supérieur',
        'Utile pour comparer visuellement des nombres décimaux'
      ]
    },
    {
      id: 'dec-11',
      type: 'decimal',
      title: 'Nombres décimaux et mesures',
      description: 'Comment utiliser les nombres décimaux dans les mesures',
      steps: [
        'Associer chaque unité de mesure à sa sous-unité (m et cm, kg et g, etc.)',
        'Comprendre le rapport entre les unités (souvent des puissances de 10)',
        'Exprimer les mesures sous forme décimale avec l\'unité principale'
      ],
      examples: [
        {
          problem: '3 m 45 cm',
          solution: '3,45 m',
          explanation: '45 cm = 0,45 m, donc 3 m 45 cm = 3,45 m'
        }
      ],
      tips: [
        'Le système métrique est basé sur les puissances de 10, ce qui facilite les conversions',
        '1 m = 100 cm, donc 1 cm = 0,01 m',
        'Les nombres décimaux permettent d\'exprimer des mesures précises avec une seule unité'
      ]
    },
    {
      id: 'dec-12',
      type: 'decimal',
      title: 'Déplacement de la virgule - Multiplication',
      description: 'Comment comprendre l\'effet du déplacement de la virgule lors d\'une multiplication',
      steps: [
        'Multiplier par 10 : déplacer la virgule d\'un rang vers la droite',
        'Multiplier par 100 : déplacer la virgule de deux rangs vers la droite',
        'Multiplier par 1000 : déplacer la virgule de trois rangs vers la droite',
        'Ajouter des zéros si nécessaire'
      ],
      examples: [
        {
          problem: '3,45 × 10',
          solution: '34,5',
          explanation: 'Déplacer la virgule d\'un rang vers la droite : 3,45 → 34,5'
        }
      ],
      tips: [
        'Le nombre de rangs à déplacer correspond au nombre de zéros de la puissance de 10',
        'Cette règle s\'applique à toutes les puissances de 10 (10, 100, 1000, etc.)',
        'Cette propriété simplifie grandement certains calculs'
      ]
    },
    {
      id: 'dec-13',
      type: 'decimal',
      title: 'Déplacement de la virgule - Division',
      description: 'Comment comprendre l\'effet du déplacement de la virgule lors d\'une division',
      steps: [
        'Diviser par 10 : déplacer la virgule d\'un rang vers la gauche',
        'Diviser par 100 : déplacer la virgule de deux rangs vers la gauche',
        'Diviser par 1000 : déplacer la virgule de trois rangs vers la gauche',
        'Ajouter des zéros si nécessaire'
      ],
      examples: [
        {
          problem: '34,5 ÷ 10',
          solution: '3,45',
          explanation: 'Déplacer la virgule d\'un rang vers la gauche : 34,5 → 3,45'
        }
      ],
      tips: [
        'Le nombre de rangs à déplacer correspond au nombre de zéros de la puissance de 10',
        'Ajouter un zéro à gauche si nécessaire (ex : 0,3 ÷ 10 = 0,03)',
        'Cette propriété simplifie grandement certains calculs'
      ]
    }
  ]
};

export const rules = atom(defaultRules);

export function getRulesByType(type: RuleType): Rule[] {
  return rules.get()[type];
}

export function getRuleById(id: string): Rule | undefined {
  const allRules = Object.values(rules.get()).flat();
  return allRules.find(rule => rule.id === id);
}

// Exporter le type Rule pour que d'autres fichiers puissent l'utiliser
export type { Rule };

