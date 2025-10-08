import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import InputWithText from '@/src/components/TextButton';
import ButtonPoint from '@/src/components/button';

const EditarFuncionario: React.FC = () => {

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { }} style={styles.backButton}>
              <Image source={require("@/assets/images/callback-vector.png")} />
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 40 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                    source={require("@/assets/images/person-photo.png")}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    />
                    <TouchableOpacity onPress={() => { }} style={{
                        position: 'absolute',
                        right: -1, // ajuste para fora ou dentro do círculo
                        bottom: -1, // ajuste para fora ou dentro do círculo
                        backgroundColor: '#fff',
                        borderRadius: 50,
                        padding: 1,
                        elevation: 1,
                    }}>
                    <Image
                        source={require("@/assets/images/edit-pencil.png")}
                        style={{ width: 28, height: 28 }}
                    />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.form}>
                <View style={styles.inputsContainer}>
                    <InputWithText labelText="Nome" placeholder="Digite o nome do funcionário" required={true}/>
                    <InputWithText labelText="CPF" placeholder="Digite o CPF do funcionário" />
                    <InputWithText labelText="Celular" placeholder="Digite o celular do funcionário" required={true}/>
                    <InputWithText labelText="E-mail" placeholder="Digite o e-mail do funcionário" required={true}/>
                </View>
                <ButtonPoint label='Concluir Edição'></ButtonPoint>
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
        justifyContent: 'flex-start',
        // sombra para parecer "cartão"
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginTop: 40,
    },
    inputsContainer: {
      width: '100%',
      gap: 12, // diminua esse valor para aproximar os campos
      marginBottom: 40, // espaço entre inputs e botão
    },
})

export default EditarFuncionario;