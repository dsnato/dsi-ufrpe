import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import InfoText from '@/src/components/InfoText';
import InfoCard from '@/src/components/InfoCard';


const InfoAtividade: React.FC = () => {


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { }} style={styles.img}>
                <Image source={require("@/assets/images/callback-vector.png")}></Image>
            </TouchableOpacity>
            <View style={styles.headContainer}>
                <Text style={styles.textAt}>Nome da Atividade</Text>
            </View>
            <View style={styles.subContainer}>
                <View style={styles.subSubContainer}>
                    <View style={{ width: '100%', marginBottom: 20 }}>
                        <InfoText text='Número do quarto' title='110'></InfoText>
                        <InfoText text='Tipo de quarto' title='Solteiro'></InfoText>
                        <InfoText text='Capacidade do quarto' title='2 pessoas'></InfoText>
                        <InfoText text='Preço do quarto' title='R$150,00'></InfoText>
                    </View>
                </View>
                <View style={styles.options}>
                    <InfoCard title='Editar Informação'></InfoCard>
                    <InfoCard title='Excluir'/>
                </View>
            </View>


        </View>
    )
}


const styles = StyleSheet.create({
    headContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textAt: {
        fontSize: 20,
        color: '#FFE157',
        marginTop: 60,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    img: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#132F3B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subContainer: {
        flex: 1,                   // ocupa todo o espaço disponível
        width: '100%',             // vai de ponta a ponta
        backgroundColor: '#EFEFF0',// cor do retângulo
        borderTopLeftRadius: 20,   // arredonda só em cima
        borderTopRightRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // sombra para parecer "cartão"
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // marginTop: 100,
    },
    subSubContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        width: '100%',
        columnGap: 10
    }
})


export default InfoAtividade;