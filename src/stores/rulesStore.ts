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