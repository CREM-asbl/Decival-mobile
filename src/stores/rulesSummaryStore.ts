import { atom } from 'nanostores';
import type { RuleType } from '../types/rules';
import { getAllProgress, getRuleProgress } from './ruleProgressStore';
import { getRuleById, getRulesByType } from './rulesStore';

export interface RuleTypeStats {
  totalRules: number;
  masteredRules: number;
  currentStreak: number;
}

export interface ProgressSnapshot {
  date: Date;
  masteredRules: Record<RuleType, number>;
  totalSuccessCount: Record<RuleType, number>;
  totalFailureCount: Record<RuleType, number>;
  streaks: Record<RuleType, number>;
}

export interface Recommendation {
  type: 'strength' | 'weakness' | 'opportunity' | 'tip';
  message: string;
  ruleId?: string;
  priority: number; // 1-10, 10 étant la plus haute priorité
}

export interface RulesSummaryState {
  typeStats: Record<RuleType, RuleTypeStats>;
  typeLabels: Record<RuleType, string>;
  history: ProgressSnapshot[];
  recommendations: Recommendation[]; // Nouvelles recommandations
}

// Labels pour les différents types de règles
const typeLabels = {
  addition: "Additions",
  subtraction: "Soustractions",
  multiplication: "Multiplications",
  comparison: "Comparaisons",
};

// Store pour les données résumées
export const rulesSummary = atom<RulesSummaryState>({
  typeStats: {
    addition: { totalRules: 0, masteredRules: 0, currentStreak: 0 },
    subtraction: { totalRules: 0, masteredRules: 0, currentStreak: 0 },
    multiplication: { totalRules: 0, masteredRules: 0, currentStreak: 0 },
    comparison: { totalRules: 0, masteredRules: 0, currentStreak: 0 },
  },
  typeLabels,
  history: [],
  recommendations: []
});

// Types de règles disponibles
export const ruleTypes: RuleType[] = [
  "addition",
  "subtraction",
  "multiplication",
  "comparison",
];

// Calculer les statistiques pour tous les types de règles
export function computeRulesSummary(): RulesSummaryState {
  const progress = getAllProgress();

  const typeStats = ruleTypes.reduce(
    (acc, type) => {
      const rules = getRulesByType(type);
      const ruleIds = rules.map((r) => r.id);
      const typeProgress = ruleIds.map((id) => progress.progress[id]);

      const totalRules = rules.length;
      const masteredRules = typeProgress.filter((p) => p?.mastered).length;
      const currentStreak = progress.currentStreak[type];

      acc[type] = {
        totalRules,
        masteredRules,
        currentStreak,
      };

      return acc;
    },
    {} as Record<RuleType, RuleTypeStats>
  );

  const currentState = rulesSummary.get();
  const snapshot = createProgressSnapshot();
  const recommendations = generateRecommendations();

  return {
    typeStats,
    typeLabels,
    history: [...currentState.history, snapshot],
    recommendations
  };
}

// Créer un snapshot de la progression actuelle
export function createProgressSnapshot(): ProgressSnapshot {
  const progress = getAllProgress();
  const snapshot: ProgressSnapshot = {
    date: new Date(),
    masteredRules: {} as Record<RuleType, number>,
    totalSuccessCount: {} as Record<RuleType, number>,
    totalFailureCount: {} as Record<RuleType, number>,
    streaks: { ...progress.currentStreak }
  };

  ruleTypes.forEach(type => {
    const rules = getRulesByType(type);
    const ruleIds = rules.map(r => r.id);

    let masteredCount = 0;
    let successCount = 0;
    let failureCount = 0;

    ruleIds.forEach(id => {
      const ruleProgress = progress.progress[id];
      if (ruleProgress) {
        if (ruleProgress.mastered) masteredCount++;
        successCount += ruleProgress.successCount;
        failureCount += ruleProgress.failureCount;
      }
    });

    snapshot.masteredRules[type] = masteredCount;
    snapshot.totalSuccessCount[type] = successCount;
    snapshot.totalFailureCount[type] = failureCount;
  });

  return snapshot;
}

// Fonction pour obtenir les données résumées
export function getRulesSummary(): RulesSummaryState {
  const summary = computeRulesSummary();
  rulesSummary.set(summary);
  return summary;
}

// Obtenir l'évolution des règles maîtrisées sur une période
export function getMasteredRulesTrend(
  type: RuleType,
  days: number = 30
): { date: Date; value: number }[] {
  const summary = rulesSummary.get();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Filtrer les snapshots par date et trier chronologiquement
  const relevantSnapshots = summary.history
    .filter(snapshot => snapshot.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Extraire les valeurs de règles maîtrisées pour le type spécifié
  return relevantSnapshots.map(snapshot => ({
    date: snapshot.date,
    value: snapshot.masteredRules[type]
  }));
}

// Obtenir l'évolution des séries de succès sur une période
export function getStreakTrend(
  type: RuleType,
  days: number = 30
): { date: Date; value: number }[] {
  const summary = rulesSummary.get();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const relevantSnapshots = summary.history
    .filter(snapshot => snapshot.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return relevantSnapshots.map(snapshot => ({
    date: snapshot.date,
    value: snapshot.streaks[type]
  }));
}

// Obtenir le taux de réussite (succès / total des tentatives) sur une période
export function getSuccessRateTrend(
  type: RuleType,
  days: number = 30
): { date: Date; value: number }[] {
  const summary = rulesSummary.get();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const relevantSnapshots = summary.history
    .filter(snapshot => snapshot.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return relevantSnapshots.map(snapshot => {
    const success = snapshot.totalSuccessCount[type];
    const total = success + snapshot.totalFailureCount[type];
    const rate = total > 0 ? (success / total) * 100 : 0;

    return {
      date: snapshot.date,
      value: parseFloat(rate.toFixed(2)) // Arrondir à 2 décimales
    };
  });
}

// Obtenir la vitesse d'apprentissage (nombre de nouvelles règles maîtrisées par période)
export function getLearningSpeed(
  type: RuleType,
  periodDays: number = 7,
  totalDays: number = 30
): { period: string; newMastered: number }[] {
  const summary = rulesSummary.get();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - totalDays);

  const relevantSnapshots = summary.history
    .filter(snapshot => snapshot.date >= cutoffDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (relevantSnapshots.length <= 1) {
    return [];
  }

  const result: { period: string; newMastered: number }[] = [];

  // Regrouper par périodes
  for (let i = periodDays; i <= totalDays; i += periodDays) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (totalDays - i));

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - periodDays);

    // Trouver les snapshots les plus proches de ces dates
    const startSnapshot = findClosestSnapshot(relevantSnapshots, startDate);
    const endSnapshot = findClosestSnapshot(relevantSnapshots, endDate);

    if (startSnapshot && endSnapshot) {
      const startMastered = startSnapshot.masteredRules[type];
      const endMastered = endSnapshot.masteredRules[type];
      const newMastered = Math.max(0, endMastered - startMastered);

      const periodStr = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      result.push({
        period: periodStr,
        newMastered
      });
    }
  }

  return result;
}

// Fonction utilitaire pour trouver le snapshot le plus proche d'une date
function findClosestSnapshot(
  snapshots: ProgressSnapshot[],
  targetDate: Date
): ProgressSnapshot | null {
  if (snapshots.length === 0) return null;

  return snapshots.reduce((closest, current) => {
    const currentDiff = Math.abs(current.date.getTime() - targetDate.getTime());
    const closestDiff = Math.abs(closest.date.getTime() - targetDate.getTime());
    return currentDiff < closestDiff ? current : closest;
  });
}

// Formatter une date au format DD/MM
function formatDate(date: Date): string {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

// Générer des recommandations basées sur l'analyse des performances
export function generateRecommendations(): Recommendation[] {
  const progress = getAllProgress();
  const recommendations: Recommendation[] = [];

  // 1. Identifier les règles les moins maîtrisées (points faibles)
  const weakRules: { ruleId: string; type: RuleType; ratio: number }[] = [];

  ruleTypes.forEach(type => {
    const rules = getRulesByType(type);

    rules.forEach(rule => {
      const ruleProgress = getRuleProgress(rule.id);

      if (ruleProgress) {
        const total = ruleProgress.successCount + ruleProgress.failureCount;

        if (total >= 3) { // Assez de tentatives pour une analyse fiable
          const successRatio = ruleProgress.successCount / total;

          // Considérer comme faible si le taux de réussite est inférieur à 70%
          if (successRatio < 0.7) {
            weakRules.push({
              ruleId: rule.id,
              type,
              ratio: successRatio
            });
          }
        }
      }
    });
  });

  // Trier les règles faibles par ratio de réussite (ascendant)
  weakRules.sort((a, b) => a.ratio - b.ratio);

  // Ajouter des recommandations pour les 3 règles les plus faibles
  weakRules.slice(0, 3).forEach(weak => {
    const rule = getRuleById(weak.ruleId);
    if (rule) {
      recommendations.push({
        type: 'weakness',
        message: `Vous semblez avoir des difficultés avec "${rule.title}". Revoyez cette règle et entraînez-vous davantage.`,
        ruleId: weak.ruleId,
        priority: 10 - Math.floor(weak.ratio * 10) // Plus le ratio est faible, plus la priorité est élevée
      });
    }
  });

  // 2. Identifier les points forts
  const strongRules: { ruleId: string; type: RuleType; streak: number }[] = [];

  ruleTypes.forEach(type => {
    const rules = getRulesByType(type);

    rules.forEach(rule => {
      const ruleProgress = getRuleProgress(rule.id);

      if (ruleProgress && ruleProgress.mastered) {
        strongRules.push({
          ruleId: rule.id,
          type,
          streak: ruleProgress.consecutiveSuccesses
        });
      }
    });
  });

  // Trier par série consécutive (descendant)
  strongRules.sort((a, b) => b.streak - a.streak);

  // Mettre en avant les points forts
  if (strongRules.length > 0) {
    const topRule = getRuleById(strongRules[0].ruleId);
    if (topRule) {
      recommendations.push({
        type: 'strength',
        message: `Vous maîtrisez parfaitement "${topRule.title}" avec ${strongRules[0].streak} succès consécutifs. Bravo !`,
        ruleId: strongRules[0].ruleId,
        priority: 7
      });
    }
  }

  // 3. Identifier des opportunités d'apprentissage
  const opportunities: { ruleId: string; type: RuleType }[] = [];

  ruleTypes.forEach(type => {
    const rules = getRulesByType(type);
    const ruleIds = rules.map(r => r.id);

    // Règles avec peu ou pas de tentatives
    ruleIds.forEach(id => {
      const ruleProgress = getRuleProgress(id);

      if (!ruleProgress || (ruleProgress.successCount + ruleProgress.failureCount < 3)) {
        opportunities.push({
          ruleId: id,
          type
        });
      }
    });
  });

  // Ajout aléatoire d'une opportunité
  if (opportunities.length > 0) {
    const randomIndex = Math.floor(Math.random() * opportunities.length);
    const opportunity = opportunities[randomIndex];
    const rule = getRuleById(opportunity.ruleId);

    if (rule) {
      recommendations.push({
        type: 'opportunity',
        message: `Essayez de pratiquer "${rule.title}" pour progresser dans votre apprentissage.`,
        ruleId: opportunity.ruleId,
        priority: 8
      });
    }
  }

  // 4. Analyser les tendances de progression
  const history = rulesSummary.get().history;

  if (history.length >= 3) {
    // Analyser la progression sur les 3 derniers snapshots
    const recentSnapshots = history.slice(-3);

    ruleTypes.forEach(type => {
      const progressValues = recentSnapshots.map(s => s.masteredRules[type]);
      const isProgressing = progressValues[2] > progressValues[0];

      if (isProgressing) {
        recommendations.push({
          type: 'tip',
          message: `Vous progressez bien en ${typeLabels[type].toLowerCase()}. Continuez sur cette lancée !`,
          priority: 6
        });
      } else if (progressValues[2] === progressValues[0] && progressValues[0] > 0) {
        recommendations.push({
          type: 'tip',
          message: `Votre progression en ${typeLabels[type].toLowerCase()} stagne. Essayez de nouveaux exercices pour débloquer la situation.`,
          priority: 7
        });
      }
    });
  }

  // 5. Recommandations générales basées sur les séries actuelles
  ruleTypes.forEach(type => {
    const currentStreak = progress.currentStreak[type];

    if (currentStreak >= 5) {
      recommendations.push({
        type: 'tip',
        message: `Votre série de ${currentStreak} en ${typeLabels[type].toLowerCase()} est impressionnante. C'est le moment d'essayer des exercices plus difficiles !`,
        priority: 5
      });
    } else if (currentStreak === 0) {
      const rules = getRulesByType(type);
      if (rules.length > 0) {
        recommendations.push({
          type: 'tip',
          message: `Vous n'avez pas de série en cours pour les ${typeLabels[type].toLowerCase()}. Commencez avec des exercices simples pour reprendre confiance.`,
          priority: 6
        });
      }
    }
  });

  // Trier les recommandations par priorité (descendant)
  recommendations.sort((a, b) => b.priority - a.priority);

  // Limiter le nombre de recommandations
  return recommendations.slice(0, 5);
}

// Obtenir les recommandations actuelles
export function getRecommendations(): Recommendation[] {
  return rulesSummary.get().recommendations;
}