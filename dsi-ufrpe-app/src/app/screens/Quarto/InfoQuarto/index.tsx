import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { buscarQuartoPorId, excluirQuarto } from '@/src/services/quartosService';
import type { Quarto } from '@/src/services/quartosService';
import { useToast } from '@/src/components/ToastContext';


const InfoQuarto: React.FC = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { showSuccess, showError } = useToast();

    // Estados
    const [quarto, setQuarto] = useState<Quarto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * ✅ REQUISITO 1: Carregamento dos dados usando ID da URL
     * ✅ REQUISITO 6: Atualização automática após retornar da edição (useFocusEffect)
     */
    const loadQuarto = useCallback(async () => {
        if (!id) {
            setError('ID do quarto não fornecido');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await buscarQuartoPorId(id);
            
            if (!data) {
                setError('Quarto não encontrado');
                setLoading(false);
                return;
            }

            setQuarto(data);
            setLoading(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao carregar quarto');
            setLoading(false);
        }
    }, [id]);

    // Recarrega os dados sempre que a tela receber foco
    useFocusEffect(
        useCallback(() => {
            loadQuarto();
        }, [loadQuarto])
    );

    /**
     * ✅ REQUISITO 5: Modal de confirmação antes de excluir
     */
    const handleDelete = () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este quarto? Esta ação não pode ser desfeita.",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await excluirQuarto(id);
                            showSuccess('Quarto excluído com sucesso!');
                            router.push("/screens/Quarto/ListagemQuarto");
                        } catch (error) {
                            showError(error instanceof Error ? error.message : "Não foi possível excluir o quarto.");
                        }
                    }
                }
            ]
        );
    };

    /**
     * ✅ REQUISITO 2: Exibição de loading durante busca
     */
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/screens/Quarto/ListagemQuarto")} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Quartos</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <ActivityIndicator size="large" color="#4BBAED" />
                    <Text style={{marginTop: 10, color: '#64748B'}}>Carregando quarto...</Text>
                </View>
            </View>
        );
    }

    /**
     * ✅ REQUISITO 3: Mensagem de erro amigável se não encontrado
     */
    if (error || !quarto) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push("/screens/Quarto/ListagemQuarto")} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.breadcrumb}>
                        <Text style={styles.breadcrumbText}>Quartos</Text>
                        <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                        <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                    </View>
                </View>
                <View style={styles.subContainer}>
                    <Text style={{fontSize: 18, color: '#EF4444', marginBottom: 20}}>{error || 'Quarto não encontrado'}</Text>
                    <TouchableOpacity 
                        style={styles.buttonPrimary}
                        onPress={loadQuarto}
                    >
                        <Text style={styles.buttonPrimaryText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.buttonDanger, {marginTop: 10}]}
                        onPress={() => router.push("/screens/Quarto/ListagemQuarto")}
                    >
                        <Text style={styles.buttonDangerText}>Voltar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ✅ REQUISITO 9: Breadcrumb/indicador de navegação */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/screens/Quarto/ListagemQuarto")} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.breadcrumb}>
                    <Text style={styles.breadcrumbText}>Quartos</Text>
                    <Ionicons name="chevron-forward" size={16} color="#E0F2FE" />
                    <Text style={styles.breadcrumbTextActive}>Detalhes</Text>
                </View>
            </View>

            {/* Container branco com informações */}
            <View style={styles.subContainer}>
                <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Título do quarto com badge de disponibilidade */}
                    <View style={styles.roomTitleContainer}>
                        <View style={styles.titleRow}>
                            {/* ✅ REQUISITO 7 e 8: Formatação e tratamento de valores vazios */}
                            <Text style={styles.roomTitle}>
                                Quarto {quarto.numero_quarto || 'S/N'}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: quarto.status === 'Disponível' ? '#10B981' : '#EF4444' }
                            ]}>
                                <Text style={styles.statusText}>
                                    {quarto.status || 'Ocupado'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.roomSubtitle}>Número do quarto</Text>

                        {/* Linha divisória entre título e informações */}
                        <View style={styles.titleSeparator} />
                    </View>

                    {/* ✅ REQUISITO 7 e 8: Informações formatadas com placeholders */}
                    <View style={styles.infoRow}>
                        <Ionicons name="bed-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>TIPO DE QUARTO</Text>
                            <Text style={styles.infoValue}>
                                {quarto.tipo || 'Tipo não informado'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="people-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>CAPACIDADE DO QUARTO</Text>
                            <Text style={styles.infoValue}>
                                {quarto.capacidade} {quarto.capacidade === 1 ? 'pessoa' : 'pessoas'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons name="cash-outline" size={20} color="#0162B3" />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>PREÇO DO QUARTO</Text>
                            <Text style={styles.infoValue}>
                                R$ {quarto.preco_diario?.toFixed(2).replace('.', ',')}
                            </Text>
                        </View>
                    </View>

                    {quarto.foto_quarto && (
                        <View style={styles.infoRow}>
                            <Ionicons name="document-text-outline" size={20} color="#0162B3" />
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>FOTO</Text>
                                <Text style={styles.infoValue}>
                                    {quarto.foto_quarto || 'Sem foto'}
                                </Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Linha divisória */}
                <View style={styles.separator} />

                {/* Botões de ação */}
                <View style={styles.options}>
                    {/* ✅ REQUISITO 4: Botão editar com ID correto */}
                    <TouchableOpacity
                        style={styles.buttonPrimary}
                        onPress={() => router.push({
                            pathname: "/screens/Quarto/EdicaoQuarto",
                            params: { id: quarto.id }
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.buttonPrimaryText}>Editar Quarto</Text>
                    </TouchableOpacity>

                    {/* ✅ REQUISITO 5: Modal de confirmação implementado */}
                    <TouchableOpacity style={styles.buttonDanger} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" style={styles.buttonIcon} />
                        <Text style={styles.buttonDangerText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: '#132F3B',
    },
    backButton: {
        marginRight: 16,
    },
    breadcrumb: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    breadcrumbText: {
        fontSize: 14,
        color: '#E0F2FE',
        opacity: 0.7,
    },
    breadcrumbTextActive: {
        fontSize: 14,
        color: '#FFE157',
        fontWeight: '600',
    },
    subContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 20,
    },
    scrollContent: {
        flex: 1,
    },
    roomTitleContainer: {
        marginBottom: 24,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    roomTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginLeft: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    roomSubtitle: {
        fontSize: 16,
        color: '#64748B',
        textTransform: 'uppercase',
    },
    titleSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginTop: 20,
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 18,
        color: '#1E293B',
        fontWeight: '500',
        lineHeight: 24,
    },
    options: {
        width: '100%',
        gap: 12,
        paddingTop: 16,
        paddingBottom: 8,
    },
    buttonPrimary: {
        width: '100%',
        height: 48,
        backgroundColor: '#0162B3',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    buttonPrimaryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDanger: {
        width: '100%',
        height: 48,
        backgroundColor: 'transparent',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDangerText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonIcon: {
        marginRight: 8,
    },
})


export default InfoQuarto;