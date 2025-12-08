/**
 * Mapeamento de Features Qualitativas para Numéricas
 * Sistema de predição de cancelamento de reservas
 */

import modelData from '@/assets/data/booking_cancellation_model.json';

export type FeatureName = keyof typeof modelData.qualitative_mappings;

export type QualitativeValue<T extends FeatureName> = 
  keyof typeof modelData.qualitative_mappings[T];

/**
 * Converte um valor qualitativo para numérico
 */
export function qualitativeToNumeric<T extends FeatureName>(
  feature: T,
  value: string
): number {
  const mapping = modelData.qualitative_mappings[feature];
  return mapping[value as keyof typeof mapping] as number;
}

/**
 * Converte um objeto de valores qualitativos para numéricos
 */
export function convertUserInputToFeatures(
  userInput: Partial<Record<string, string | number>>
): Record<string, number> {
  const numericFeatures: Record<string, number> = {};
  
  for (const [feature, value] of Object.entries(userInput)) {
    if (value === undefined || value === null) continue;
    
    // Se já é numérico, usa direto
    if (typeof value === 'number') {
      numericFeatures[feature] = value;
      continue;
    }
    
    // Se é qualitativo e tem mapeamento, converte
    if (feature in modelData.qualitative_mappings) {
      numericFeatures[feature] = qualitativeToNumeric(
        feature as FeatureName,
        value as any
      );
    }
  }
  
  return numericFeatures;
}

/**
 * Obtém as opções qualitativas para uma feature
 */
export function getQualitativeOptions(feature: FeatureName): string[] {
  const mapping = modelData.qualitative_mappings[feature];
  return Object.keys(mapping);
}

/**
 * Obtém a descrição de uma feature
 */
export function getFeatureDescription(feature: string): string {
  return modelData.feature_descriptions[feature as keyof typeof modelData.feature_descriptions] || feature;
}

/**
 * Normaliza um valor numérico baseado nas estatísticas do dataset
 */
export function normalizeValue(feature: string, value: number): number {
  const stats = modelData.stats[feature as keyof typeof modelData.stats];
  if (!stats) return value;
  
  // Normalização min-max
  return (value - stats.min) / (stats.max - stats.min);
}

/**
 * Retorna todas as features principais
 */
export function getTopFeatures(): string[] {
  return modelData.features.top;
}

/**
 * Retorna a importância de uma feature (0-1)
 */
export function getFeatureImportance(feature: string): number {
  return modelData.features.importances[feature as keyof typeof modelData.features.importances] || 0;
}

export { modelData };
