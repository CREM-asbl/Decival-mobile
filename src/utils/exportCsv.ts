import { getTestTypeLabel } from '../types/test';

const MODE_LABELS: Record<string, string> = {
  integer: 'Nombres entiers',
  decimal: 'Nombres décimaux'
};

function getModeLabel(mode: string): string {
  return MODE_LABELS[mode] ?? mode;
}

interface HistoryItem {
  isCorrect?: boolean;
}

interface HistoryEntry {
  startTime: number | Date;
  type: string;
  mode: string;
  items: HistoryItem[];
}

interface GlobalStats {
  totalTests: number;
  averageScore: number;
  bestScore: number;
}

export function buildResultsCsv(stats: GlobalStats, history: HistoryEntry[]): string {
  let csv = 'Statistiques globales\n';
  csv += `Tests complétés,${stats.totalTests}\n`;
  csv += `Score moyen,${Math.round(stats.averageScore)}%\n`;
  csv += `Meilleur score,${Math.round(stats.bestScore)}%\n\n`;

  csv += 'Historique des tests\n';
  csv += 'Date,Type,Mode,Score,Questions correctes,Total questions\n';

  for (const test of history) {
    const correct = test.items.filter((i) => i.isCorrect).length;
    const date = new Date(test.startTime).toLocaleDateString();
    const score = test.items.length === 0 ? 0 : Math.round((correct / test.items.length) * 100);
    csv += `${date},${getTestTypeLabel(test.type)},${getModeLabel(test.mode)},${score}%,${correct},${test.items.length}\n`;
  }

  return csv;
}
