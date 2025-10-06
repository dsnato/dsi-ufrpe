import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import InputWithText from '@/src/components/TextButton';
import ButtonPoint from '@/src/components/button';

const EditarAtividade: React.FC = () => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { }} style={styles.backButton}>
                <Image source={require("@/assets/images/callback-vector.png")}></Image>
            </TouchableOpacity>
            <View style={styles.form}>
                < InputWithText labelText="Nome da Atividade" placeholder="Digite o nome da Atividade" required={true} />
                < InputWithText labelText="Descrição da Atividade" placeholder="Digite a descrição da Atividade" />
                < InputWithText labelText="Local da Atividade" placeholder="Digite o local da Atividade" />
                < InputWithText labelText="Data da Atividade" placeholder="Digite a data da Atividade" required={true} />
                < InputWithText labelText="Hora da Atividade" placeholder="Digite o horário da Atividade" required={true} />
                <ButtonPoint label='Confirmar Alteração'></ButtonPoint>
            </View>
        </View>

    );

}


const styles = StyleSheet.create({
    backButton: {
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
    form: {
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
        marginTop: 100,
    }
})

export default EditarAtividade;