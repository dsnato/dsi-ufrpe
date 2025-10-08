import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import InfoCard from '@/src/components/InfoCard';
import TextInputRounded from '@/src/components/TextInputRounded';
import InfoCardLong from '@/src/components/InfoCardLong';

interface Atividade {
    id: string;
    nome: string;
    icone: string;
    hora: string;
    destaque?: boolean;
}

const atividadesHoje: Atividade[] = [
    { id: '1', nome: 'Música', icone: 'musical-note', hora: '18:00', destaque: true },
    { id: '2', nome: 'Manutenção nos Quartos', icone: 'settings-outline', hora: '23:59' },
    { id: '3', nome: 'Manutenção da Piscina', icone: 'settings-outline', hora: '23:09' },
];

const atividadesAmanha: Atividade[] = [
    { id: '3', nome: 'Limpeza dos Quartos', icone: 'broom', hora: '15:00' },
    { id: '4', nome: 'Café da Manhã', icone: 'cafe', hora: '22:00' },
    { id: '5', nome: 'Reunião de Equipe', icone: 'people', hora: '09:00' },
];

const ListagemAtividade: React.FC = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { }} style={styles.backButton}>
                <Image source={require("@/assets/images/callback-vector.png")} />
            </TouchableOpacity>

            <View style={styles.topContainer}>
                <InfoCard title="Adicionar Atividade" elevate={false} />
                <TextInputRounded placeholder="Pesquisar por nome..." />
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Hoje, {'{data}'}</Text>
                    <ScrollView
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        {atividadesHoje.map((item) => (
                            <InfoCardLong
                                key={item.id}
                                iconName={item.icone as any}
                                title={item.nome}
                                time={item.hora}
                                highlight={item.destaque}
                            />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Amanhã, {'{data}'}</Text>
                    <ScrollView
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                        {atividadesAmanha.map((item) => (
                            <InfoCardLong
                                key={item.id}
                                iconName={item.icone as any}
                                title={item.nome}
                                time={item.hora}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

export default ListagemAtividade;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    topContainer: {
        paddingTop: 80,
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: '#EFEFF0',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingVertical: 25,
        paddingHorizontal: 20,
    },
    sectionContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
    },
    scrollContainer: {
        width: '100%',
        flexGrow: 0, // evita que o scroll empurre os outros elementos
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4BBAED',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
});
