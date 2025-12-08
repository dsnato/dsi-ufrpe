/**
 * Serviço de Predição de Cancelamento de Reservas
 * 
 * SIMULAÇÃO DE CANCELAMENTO:
 * Este serviço simula o comportamento de um modelo ML treinado, calculando
 * o risco de cancelamento através de:
 * 
 * 1. DISTÂNCIA EUCLIDIANA: Mede a similaridade entre as características da
 *    reserva atual e perfis de risco históricos (low/medium/high risk)
 * 
 * 2. CONFIANÇA: Calculada como inverso da distância normalizada.
 *    - Distância pequena = alta confiança (reserva muito similar ao perfil)
 *    - Distância grande = baixa confiança (características atípicas)
 *    - Fórmula: confidence = (1 - distance/maxDistance) * 100
 * 
 * 3. PROBABILIDADE: Valor base do perfil mais próximo (15%, 50%, 85%)
 *    ajustado por fatores críticos (+/- até 30 pontos)
 * 
 * Similar ao modelo Python (pisi3-ufrpe) que usa K-Means clustering e
 * classificação baseada em distância para simular predições.
 */

import modelData from '@/assets/data/booking_cancellation_model.json';
import { normalizeValue } from '@/src/utils/bookingFeatureMapping';

export interface PredictionResult {
  riskLevel: 'low_risk' | 'medium_risk' | 'high_risk';
  probability: number;
  confidence: number;
  factors: RiskFactor[];
  recommendation: string;
  profileDistances?: { profile: string; similarity: number }[];
  statistics?: {
    totalFeatures: number;
    criticalFactors: number;
    adjustmentApplied: number;
  };
}

export interface RiskFactor {
  feature: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  importance: number;
}

export interface RiskProfile {
  id: number;
  name: string;
  color: string;
  icon: string;
  description: string;
  characteristics: Record<string, any>;
}

/**
 * Calcula a distância euclidiana entre features do usuário e perfil de risco
 */
function calculateDistance(
  userFeatures: Record<string, number>,
  profileFeatures: Record<string, any>
): number {
  let sum = 0;
  let count = 0;
  
  for (const [feature, profileValue] of Object.entries(profileFeatures)) {
    if (feature in userFeatures) {
      const userValue = normalizeValue(feature, userFeatures[feature]);
      const profValue = normalizeValue(feature, 
        typeof profileValue === 'number' ? profileValue : 
        (modelData.qualitative_mappings[feature as keyof typeof modelData.qualitative_mappings] as Record<string, number>)?.[profileValue as string] || 0
      );
      
      const diff = userValue - profValue;
      sum += diff * diff;
      count++;
    }
  }
  
  return count > 0 ? Math.sqrt(sum / count) : 1;
}

/**
 * Prediz o risco de cancelamento baseado nas features fornecidas
 */
export function predictCancellationRisk(
  userFeatures: Record<string, number>
): PredictionResult {
  // Calcular distâncias para cada perfil de risco
  const profiles = modelData.risk_profiles;
  const distances: { profile: string; distance: number }[] = [];
  
  for (const [profileKey, profileInfo] of Object.entries(profiles)) {
    const distance = calculateDistance(userFeatures, profileInfo.characteristics);
    distances.push({ profile: profileKey, distance });
  }
  
  // Ordenar por distância (menor = mais similar)
  distances.sort((a, b) => a.distance - b.distance);
  
  // Perfil mais próximo
  const closestProfile = distances[0].profile as keyof typeof profiles;
  const profileInfo = profiles[closestProfile];
  
  // Calcular CONFIANÇA baseada na distância euclidiana normalizada
  // Similaridade com perfis de risco = confiança na classificação
  // maxDistance = diagonal do espaço N-dimensional (pior caso)
  const maxDistance = Math.sqrt(Object.keys(userFeatures).length);
  const normalizedDistance = distances[0].distance / maxDistance;
  const confidence = Math.max(0, Math.min(100, (1 - normalizedDistance) * 100));
  
  // Distância relativa para cada perfil (para mostrar no resultado)
  const distancePercentages = distances.map(d => ({
    profile: d.profile,
    similarity: Math.max(0, Math.min(100, (1 - d.distance / maxDistance) * 100))
  }));
  
  // Probabilidade de cancelamento
  let probability = 0;
  if (closestProfile === 'low_risk') probability = 15;
  else if (closestProfile === 'medium_risk') probability = 50;
  else probability = 85;
  
  // Ajustar probabilidade baseado em features críticas
  const criticalFactors = analyzeCriticalFactors(userFeatures);
  probability += criticalFactors.adjustment;
  probability = Math.max(0, Math.min(100, probability));
  
  // Gerar recomendação
  const recommendation = generateRecommendation(closestProfile, userFeatures, criticalFactors);
  
  return {
    riskLevel: closestProfile,
    probability,
    confidence,
    factors: criticalFactors.factors,
    recommendation,
    profileDistances: distancePercentages,
    statistics: {
      totalFeatures: Object.keys(userFeatures).length,
      criticalFactors: criticalFactors.factors.length,
      adjustmentApplied: criticalFactors.adjustment
    }
  };
}

/**
 * Analisa fatores críticos que influenciam o cancelamento
 */
function analyzeCriticalFactors(features: Record<string, number>): {
  factors: RiskFactor[];
  adjustment: number;
} {
  const factors: RiskFactor[] = [];
  let adjustment = 0;
  
  // Lead time muito alto (>180 dias)
  if (features.lead_time && features.lead_time > 180) {
    factors.push({
      feature: 'lead_time',
      description: 'Reserva feita com muita antecedência',
      impact: 'negative',
      importance: 0.85
    });
    adjustment += 10;
  }
  
  // Histórico de cancelamentos
  if (features.previous_cancellations && features.previous_cancellations > 0) {
    factors.push({
      feature: 'previous_cancellations',
      description: `${features.previous_cancellations} cancelamento(s) anterior(es)`,
      impact: 'negative',
      importance: 0.90
    });
    adjustment += 15;
  }
  
  // Cliente repetido (fator positivo)
  if (features.is_repeated_guest === 1) {
    factors.push({
      feature: 'is_repeated_guest',
      description: 'Cliente já se hospedou antes',
      impact: 'positive',
      importance: 0.70
    });
    adjustment -= 10;
  }
  
  // Pedidos especiais (fator positivo)
  if (features.total_of_special_requests && features.total_of_special_requests > 0) {
    factors.push({
      feature: 'total_of_special_requests',
      description: `${features.total_of_special_requests} pedido(s) especial(is)`,
      impact: 'positive',
      importance: 0.65
    });
    adjustment -= 5;
  }
  
  // Depósito não reembolsável (fator positivo)
  if (features.deposit_type === 2) { // Non Refund
    factors.push({
      feature: 'deposit_type',
      description: 'Depósito não reembolsável',
      impact: 'positive',
      importance: 0.80
    });
    adjustment -= 20;
  }
  
  // ADR muito baixo (pode indicar promoção = maior chance de cancelamento)
  if (features.adr && features.adr < 50) {
    factors.push({
      feature: 'adr',
      description: 'Taxa diária muito baixa',
      impact: 'negative',
      importance: 0.60
    });
    adjustment += 5;
  }
  
  return { factors, adjustment };
}

/**
 * Gera recomendação baseada no perfil de risco
 */
function generateRecommendation(
  riskLevel: string,
  features: Record<string, number>,
  criticalFactors: { factors: RiskFactor[] }
): string {
  if (riskLevel === 'low_risk') {
    return 'Cliente com baixo risco de cancelamento. Mantenha a qualidade do atendimento e confirme a reserva próximo à data de check-in.';
  }
  
  if (riskLevel === 'medium_risk') {
    let rec = 'Cliente com risco moderado. Recomendações: ';
    const tips = [];
    
    if (features.previous_cancellations > 0) {
      tips.push('Entre em contato para confirmar a reserva');
    }
    if (!features.total_of_special_requests) {
      tips.push('Ofereça upgrades ou serviços adicionais');
    }
    if (features.lead_time > 90) {
      tips.push('Envie lembretes periódicos');
    }
    
    return rec + tips.join(', ') + '.';
  }
  
  // high_risk
  return 'ATENÇÃO: Alto risco de cancelamento! Ações urgentes: (1) Confirmar reserva por telefone, (2) Oferecer taxa flexível de cancelamento, (3) Destacar diferenciais do hotel, (4) Considerar política de depósito.';
}

/**
 * Obtém informações sobre um perfil de risco
 */
export function getRiskProfileInfo(riskLevel: string): RiskProfile | null {
  const profile = modelData.risk_profiles[riskLevel as keyof typeof modelData.risk_profiles];
  if (!profile) return null;
  
  return profile as RiskProfile;
}

/**
 * Obtém todos os perfis de risco disponíveis
 */
export function getAllRiskProfiles(): string[] {
  return Object.keys(modelData.risk_profiles);
}

/**
 * Valida se todas as features necessárias foram fornecidas
 */
export function validateFeatures(features: Record<string, number>): {
  isValid: boolean;
  missingFeatures: string[];
} {
  const topFeatures = modelData.features.top;
  const missingFeatures = topFeatures.filter(f => !(f in features));
  
  return {
    isValid: missingFeatures.length === 0,
    missingFeatures,
  };
}
