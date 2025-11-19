import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/src/components/ToastContext';

import { ButtonSelector } from '@/src/components/ButtonSelector';
import { FormInput } from '@/src/components/FormInput';
import { RiskCard } from '@/src/components/RiskCard';
import { Separator } from '@/src/components/Separator';
import {
    getRiskProfileInfo,
    predictCancellationRisk,
    type PredictionResult,
} from '@/src/services/bookingPredictor';
import { convertUserInputToFeatures } from '@/src/utils/bookingFeatureMapping';

export default function PredicaoScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const { showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

    const [formData, setFormData] = useState({
        hotel: '',
        lead_time: '',
        adr: '',
        previous_cancellations: '',
        deposit_type: '',
        total_of_special_requests: '',
        is_repeated_guest: '',
        market_segment: '',
        adults: '',
        children: '',
        stays_in_weekend_nights: '',
        stays_in_week_nights: '',
    });

    // Funções de formatação
    const formatLeadTime = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers ? `${numbers} dias` : '';
    };

    const formatCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return '';
        const amount = parseFloat(numbers) / 100;
        return `R$ ${amount.toFixed(2).replace('.', ',')}`;
    };

    const parseLeadTime = (formatted: string): string => {
        return formatted.replace(/\D/g, '');
    };

    const parseCurrency = (formatted: string): string => {
        const numbers = formatted.replace(/\D/g, '');
        if (!numbers) return '';
        return (parseFloat(numbers) / 100).toFixed(2);
    };

    const handlePredict = async () => {
        const leadTimeValue = parseLeadTime(formData.lead_time);
        const adrValue = parseCurrency(formData.adr);

        if (!formData.hotel || !leadTimeValue || !adrValue || !formData.deposit_type || !formData.market_segment) {
            showError('Preencha todos os campos obrigatórios (*)');
            return;
        }

        setLoading(true);
        try {
            const numericFeatures = convertUserInputToFeatures({
                hotel: formData.hotel,
                lead_time: parseInt(leadTimeValue),
                adr: parseFloat(adrValue),
                previous_cancellations: parseInt(formData.previous_cancellations || '0'),
                deposit_type: formData.deposit_type,
                total_of_special_requests: parseInt(formData.total_of_special_requests || '0'),
                is_repeated_guest: parseInt(formData.is_repeated_guest || '0'),
                market_segment: formData.market_segment,
                adults: parseInt(formData.adults),
                children: parseInt(formData.children),
                babies: 0,
                stays_in_weekend_nights: parseInt(formData.stays_in_weekend_nights),
                stays_in_week_nights: parseInt(formData.stays_in_week_nights),
                arrival_date_month: 'January',
                distribution_channel: 'TA/TO',
                reserved_room_type: 'A',
                assigned_room_type: 'A',
                booking_changes: 0,
            });

            numericFeatures.total_guests = numericFeatures.adults + numericFeatures.children;
            numericFeatures.total_nights = numericFeatures.stays_in_weekend_nights + numericFeatures.stays_in_week_nights;
            numericFeatures.has_special_request = numericFeatures.total_of_special_requests > 0 ? 1 : 0;
            numericFeatures.is_family = numericFeatures.adults > 0 && numericFeatures.children > 0 ? 1 : 0;

            const result = predictCancellationRisk(numericFeatures);
            setPredictionResult(result);
            setShowResults(true);
            
            // Scroll para o topo após mostrar resultados
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }, 100);
        } catch (error) {
            console.error('Erro:', error);
            showError('Não foi possível realizar a predição');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setShowResults(false);
        setPredictionResult(null);
        setFormData({
            hotel: '',
            lead_time: '',
            adr: '',
            previous_cancellations: '',
            deposit_type: '',
            total_of_special_requests: '',
            is_repeated_guest: '',
            market_segment: '',
            adults: '2',
            children: '0',
            stays_in_weekend_nights: '0',
            stays_in_week_nights: '3',
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#132F3B" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Ionicons name="analytics" size={24} color="#0162B3" />
                    <Text style={styles.headerTitle}>Predição ML</Text>
                </View>
                {showResults && (
                    <TouchableOpacity onPress={handleReset}>
                        <Ionicons name="refresh" size={24} color="#0162B3" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {!showResults ? (
                    <View style={styles.formContainer}>
                        {/* Seção 1: Tipo de Hotel */}
                        <Text style={styles.sectionTitle}>📍 Informações do Hotel</Text>
                        <ButtonSelector
                            label="Tipo de Hotel *"
                            helperText="Selecione o tipo de estabelecimento"
                            value={formData.hotel}
                            options={[
                                { label: 'Resort', value: 'Resort Hotel', icon: 'business' },
                                { label: 'City Hotel', value: 'City Hotel', icon: 'business-outline' },
                            ]}
                            onSelect={(value) => setFormData({ ...formData, hotel: value })}
                        />

                        <Separator marginTop={8} marginBottom={8} />

                        {/* Seção 2: Dados da Reserva */}
                        <Text style={styles.sectionTitle}>📅 Dados da Reserva</Text>
                        
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Lead Time (dias até check-in) *</Text>
                            <Text style={styles.fieldHelper}>Quantos dias de antecedência a reserva foi feita</Text>
                            <FormInput
                                icon="calendar"
                                placeholder="Ex: 30"
                                value={formData.lead_time}
                                onChangeText={(value) => {
                                    const numbers = value.replace(/\D/g, '');
                                    setFormData({ ...formData, lead_time: formatLeadTime(numbers) });
                                }}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Taxa Diária Média (R$) *</Text>
                            <Text style={styles.fieldHelper}>Valor médio da diária cobrada</Text>
                            <FormInput
                                icon="cash"
                                placeholder="Ex: 150,00"
                                value={formData.adr}
                                onChangeText={(value) => {
                                    const numbers = value.replace(/\D/g, '');
                                    setFormData({ ...formData, adr: formatCurrency(numbers) });
                                }}
                                keyboardType="numeric"
                            />
                        </View>

                        <Separator marginTop={8} marginBottom={8} />

                        {/* Seção 3: Tipo de Depósito */}
                        <Text style={styles.sectionTitle}>💳 Pagamento</Text>
                        <ButtonSelector
                            label="Tipo de Depósito *"
                            helperText="Condições de reembolso do depósito"
                            value={formData.deposit_type}
                            options={[
                                { label: 'Sem Depósito', value: 'No Deposit', icon: 'close-circle' },
                                { label: 'Reembolsável', value: 'Refundable', icon: 'checkmark-circle' },
                                { label: 'Não Reembolsável', value: 'Non Refund', icon: 'lock-closed' },
                            ]}
                            onSelect={(value) => setFormData({ ...formData, deposit_type: value })}
                        />

                        <Separator marginTop={8} marginBottom={8} />

                        {/* Seção 4: Segmento de Mercado */}
                        <Text style={styles.sectionTitle}>🎯 Canal de Venda</Text>
                        <ButtonSelector
                            label="Segmento de Mercado *"
                            helperText="Como a reserva foi realizada"
                            value={formData.market_segment}
                            options={[
                                { label: 'Online', value: 'Online TA', icon: 'globe' },
                                { label: 'Agência', value: 'Offline TA/TO', icon: 'briefcase' },
                                { label: 'Direto', value: 'Direct', icon: 'call' },
                                { label: 'Corporativo', value: 'Corporate', icon: 'business' },
                                { label: 'Grupos', value: 'Groups', icon: 'people' },
                            ]}
                            onSelect={(value) => setFormData({ ...formData, market_segment: value })}
                        />

                        <Separator marginTop={8} marginBottom={8} />

                        {/* Seção 5: Histórico do Cliente */}
                        <Text style={styles.sectionTitle}>👤 Perfil do Cliente</Text>
                        
                        <ButtonSelector
                            label="Cliente Repetido?"
                            helperText="Já se hospedou antes neste hotel"
                            value={formData.is_repeated_guest}
                            options={[
                                { label: 'Não', value: '0', icon: 'close' },
                                { label: 'Sim', value: '1', icon: 'checkmark' },
                            ]}
                            onSelect={(value) => setFormData({ ...formData, is_repeated_guest: value })}
                        />

                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Cancelamentos Anteriores</Text>
                            <Text style={styles.fieldHelper}>Quantas vezes cancelou reservas no passado</Text>
                            <FormInput
                                icon="close-circle"
                                placeholder="Digite 0 se for novo cliente"
                                value={formData.previous_cancellations}
                                onChangeText={(value) => setFormData({ ...formData, previous_cancellations: value })}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>Pedidos Especiais</Text>
                            <Text style={styles.fieldHelper}>Quantidade de solicitações extras (café da manhã, vista, etc)</Text>
                            <FormInput
                                icon="star"
                                placeholder="Ex: 2"
                                value={formData.total_of_special_requests}
                                onChangeText={(value) => setFormData({ ...formData, total_of_special_requests: value })}
                                keyboardType="numeric"
                            />
                        </View>

                        <Separator marginTop={8} marginBottom={8} />

                        {/* Seção 6: Composição da Reserva */}
                        <Text style={styles.sectionTitle}>👥 Hóspedes e Estadia</Text>
                        <Text style={styles.fieldHelper}>Composição dos hóspedes</Text>
                        <View style={styles.rowInputs}>
                            <View style={styles.halfInput}>
                                <FormInput
                                    icon="people"
                                    placeholder="Adultos"
                                    value={formData.adults}
                                    onChangeText={(value) => setFormData({ ...formData, adults: value })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <FormInput
                                    icon="person"
                                    placeholder="Crianças"
                                    value={formData.children}
                                    onChangeText={(value) => setFormData({ ...formData, children: value })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <Text style={styles.fieldHelper}>Duração da hospedagem</Text>
                        <View style={styles.rowInputs}>
                            <View style={styles.halfInput}>
                                <FormInput
                                    icon="moon"
                                    placeholder="Noites (FDS)"
                                    value={formData.stays_in_weekend_nights}
                                    onChangeText={(value) => setFormData({ ...formData, stays_in_weekend_nights: value })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <FormInput
                                    icon="sunny"
                                    placeholder="Noites (Semana)"
                                    value={formData.stays_in_week_nights}
                                    onChangeText={(value) => setFormData({ ...formData, stays_in_week_nights: value })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.predictButton, loading && styles.predictButtonDisabled]}
                            onPress={handlePredict}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="analytics-outline" size={24} color="#FFFFFF" />
                                    <Text style={styles.predictButtonText}>Analisar Risco</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.resultsContainer}>
                        {predictionResult && (() => {
                            const profileInfo = getRiskProfileInfo(predictionResult.riskLevel);
                            if (!profileInfo) return null;

                            return (
                                <>
                                    {/* Card Principal de Risco - Expandido */}
                                    <View style={styles.mainRiskCard}>
                                        <RiskCard
                                            riskLevel={predictionResult.riskLevel}
                                            probability={predictionResult.probability}
                                            confidence={predictionResult.confidence}
                                            color={profileInfo.color}
                                            icon={profileInfo.icon}
                                            name={profileInfo.name}
                                        />
                                        
                                        {/* Estatísticas da Simulação */}
                                        {predictionResult.statistics && (
                                            <View style={styles.statsGrid}>
                                                <View style={styles.statBox}>
                                                    <Ionicons name="bar-chart" size={24} color="#0162B3" />
                                                    <Text style={styles.statValue}>{predictionResult.statistics.totalFeatures}</Text>
                                                    <Text style={styles.statLabel}>Features Analisadas</Text>
                                                </View>
                                                <View style={styles.statBox}>
                                                    <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                                                    <Text style={styles.statValue}>{predictionResult.statistics.criticalFactors}</Text>
                                                    <Text style={styles.statLabel}>Fatores Críticos</Text>
                                                </View>
                                                <View style={styles.statBox}>
                                                    <Ionicons name="speedometer" size={24} color="#10B981" />
                                                    <Text style={styles.statValue}>{predictionResult.statistics.adjustmentApplied > 0 ? '+' : ''}{predictionResult.statistics.adjustmentApplied}%</Text>
                                                    <Text style={styles.statLabel}>Ajuste Aplicado</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Similaridade com Perfis */}
                                    {predictionResult.profileDistances && (
                                        <View style={styles.similarityCard}>
                                            <Text style={styles.similarityTitle}>📊 Similaridade com Perfis de Risco</Text>
                                            <Text style={styles.similaritySubtitle}>Distância Euclidiana Normalizada</Text>
                                            {predictionResult.profileDistances.map((dist, idx) => {
                                                const profileNames: Record<string, string> = {
                                                    'low_risk': 'Baixo Risco',
                                                    'medium_risk': 'Médio Risco',
                                                    'high_risk': 'Alto Risco'
                                                };
                                                const colors: Record<string, string> = {
                                                    'low_risk': '#10B981',
                                                    'medium_risk': '#F59E0B',
                                                    'high_risk': '#EF4444'
                                                };
                                                return (
                                                    <View key={idx} style={styles.similarityBar}>
                                                        <View style={styles.similarityBarHeader}>
                                                            <Text style={styles.similarityBarLabel}>{profileNames[dist.profile]}</Text>
                                                            <Text style={[styles.similarityBarValue, { color: colors[dist.profile] }]}>
                                                                {dist.similarity.toFixed(1)}%
                                                            </Text>
                                                        </View>
                                                        <View style={styles.progressBarContainer}>
                                                            <View 
                                                                style={[
                                                                    styles.progressBarFill, 
                                                                    { width: `${dist.similarity}%`, backgroundColor: colors[dist.profile] }
                                                                ]} 
                                                            />
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                            <View style={styles.explainerBox}>
                                                <Ionicons name="information-circle" size={18} color="#64748B" />
                                                <Text style={styles.explainerText}>
                                                    Quanto maior a similaridade, mais confiável é a predição. 
                                                    Valores acima de 70% indicam alta confiança.
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    <View style={styles.recommendationCard}>
                                        <View style={styles.recommendationHeader}>
                                            <Ionicons name="bulb" size={28} color="#F59E0B" />
                                            <Text style={styles.recommendationTitle}>💡 Recomendações Estratégicas</Text>
                                        </View>
                                        <Text style={styles.recommendationText}>
                                            {predictionResult.recommendation}
                                        </Text>
                                    </View>

                                    {predictionResult.factors.length > 0 && (
                                        <View style={styles.factorsSection}>
                                            <Text style={styles.factorsTitle}>🔍 Fatores Críticos Identificados</Text>
                                            <Text style={styles.factorsSubtitle}>Elementos que influenciaram a predição</Text>
                                            {predictionResult.factors.map((factor, index) => (
                                                <View key={index} style={[
                                                    styles.factorCard,
                                                    { borderLeftColor: factor.impact === 'positive' ? '#10B981' : '#EF4444' }
                                                ]}>
                                                    <View style={styles.factorHeader}>
                                                        <View style={[
                                                            styles.factorIconContainer,
                                                            { backgroundColor: factor.impact === 'positive' ? '#D1FAE5' : '#FEE2E2' }
                                                        ]}>
                                                            <Ionicons
                                                                name={factor.impact === 'positive' ? 'checkmark-circle' : 'close-circle'}
                                                                size={24}
                                                                color={factor.impact === 'positive' ? '#10B981' : '#EF4444'}
                                                            />
                                                        </View>
                                                        <View style={styles.factorContent}>
                                                            <Text style={styles.factorDescription}>{factor.description}</Text>
                                                            <View style={styles.factorMeta}>
                                                                <View style={styles.importanceBar}>
                                                                    <View style={[
                                                                        styles.importanceBarFill, 
                                                                        { width: `${factor.importance * 100}%` }
                                                                    ]} />
                                                                </View>
                                                                <Text style={styles.importanceText}>
                                                                    {(factor.importance * 100).toFixed(0)}% importância
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <TouchableOpacity style={styles.newAnalysisButton} onPress={handleReset}>
                                        <Ionicons name="add-circle-outline" size={24} color="#0162B3" />
                                        <Text style={styles.newAnalysisButtonText}>Nova Análise</Text>
                                    </TouchableOpacity>
                                </>
                            );
                        })()}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: {
        padding: 8,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#132F3B',
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#132F3B',
        marginTop: 8,
        marginBottom: 12,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132F3B',
        marginBottom: 4,
    },
    fieldHelper: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 8,
        lineHeight: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    halfInput: {
        flex: 1,
    },
    predictButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0162B3',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 16,
    },
    predictButtonDisabled: {
        opacity: 0.6,
    },
    predictButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    resultsContainer: {
        padding: 16,
        gap: 20,
        paddingBottom: 32,
    },
    mainRiskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        gap: 6,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#132F3B',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
    },
    similarityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    similarityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#132F3B',
        marginBottom: 4,
    },
    similaritySubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16,
    },
    similarityBar: {
        marginBottom: 16,
    },
    similarityBarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    similarityBarLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#132F3B',
    },
    similarityBarValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 12,
        backgroundColor: '#E2E8F0',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    explainerBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        padding: 12,
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        marginTop: 8,
    },
    explainerText: {
        flex: 1,
        fontSize: 12,
        color: '#64748B',
        lineHeight: 16,
    },
    recommendationCard: {
        backgroundColor: '#FEF3C7',
        padding: 20,
        minHeight: 120,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    recommendationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    recommendationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#92400E',
    },
    recommendationText: {
        fontSize: 15,
        color: '#78350F',
        lineHeight: 22,
        marginTop: 4,
    },
    factorsSection: {
        gap: 12,
    },
    factorsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#132F3B',
        marginBottom: 4,
    },
    factorsSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 16,
    },
    factorCard: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    factorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    factorIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    factorContent: {
        flex: 1,
    },
    factorDescription: {
        fontSize: 15,
        fontWeight: '600',
        color: '#132F3B',
        marginBottom: 8,
    },
    factorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    importanceBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    importanceBarFill: {
        height: '100%',
        backgroundColor: '#0162B3',
        borderRadius: 3,
    },
    importanceText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    newAnalysisButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 2,
        borderColor: '#0162B3',
        marginTop: 8,
    },
    newAnalysisButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0162B3',
    },
});
