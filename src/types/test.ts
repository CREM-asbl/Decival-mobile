export const TEST_TYPE_IDS = ['addition', 'subtraction', 'multiplication', 'comparison'] as const;

export type TestTypeId = (typeof TEST_TYPE_IDS)[number];

export const TEST_TYPE_LABELS: Record<TestTypeId, string> = {
  addition: 'addition',
  subtraction: 'soustraction',
  multiplication: 'multiplication',
  comparison: 'comparaison'
};

export function getTestTypeLabel(testType: string): string {
  return (TEST_TYPE_LABELS as Record<string, string>)[testType] ?? testType;
}
