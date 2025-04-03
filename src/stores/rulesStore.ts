import { atom } from 'nanostores';
import { Rule, RuleType } from '../types/rules';

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
    }
  ],
  subtraction: [
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
    }
  ],
  decimal: [
    {
      id: 'dec-1',
      type: 'decimal',
      title: 'Nombres décimaux',
      description: 'Comment travailler avec les nombres à virgule',
      steps: [
        'Aligner les nombres en faisant correspondre les virgules',
        'S\'assurer que les nombres ont le même nombre de décimales (ajouter des zéros si nécessaire)',
        'Procéder comme pour une addition normale',
        'Placer la virgule au même endroit dans le résultat'
      ],
      examples: [
        {
          problem: '3.5 + 2.7',
          solution: '6.2',
          explanation: 'Additionner 5 et 7 dixièmes = 12 dixièmes = 1 unité et 2 dixièmes, puis 3 + 2 + 1 = 6 unités'
        }
      ],
      tips: [
        'La virgule sépare la partie entière de la partie décimale',
        'Les chiffres après la virgule représentent des fractions de l\'unité',
        'Le premier chiffre après la virgule représente les dixièmes, le deuxième les centièmes, etc.'
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