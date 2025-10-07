import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import InputWithText from '@/src/components/TextButton';
import ButtonPoint from '@/src/components/button';
import SelectInput from '@/src/components/SelectInput';

const CriarAtividade: React.FC = () => {
    const [roomType, setRoomType] = useState<string>('');

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { }} style={styles.backButton}>
                <Image source={require("@/assets/images/callback-vector.png")}></Image>
            </TouchableOpacity>
            <View style={styles.form}>
                < InputWithText labelText="Data de Check-in" placeholder="Digite a Data do Check-in" required={true} />
                < InputWithText labelText="Data de Check-out" placeholder="Digite a Data de Check-out" />
                <SelectInput
                    labelText="Tipo de Quarto"
                    options={[
                        { label: 'Solteiro', value: 'solteiro' },
                        { label: 'Casal', value: 'casal' },
                        { label: 'Triplo', value: 'triplo' },
                        { label: 'Quadruplo', value: 'quadruplo' },
                    ]}
                    selectedValue={roomType}
                    onValueChange={(v) => setRoomType(v)}
                    placeholder="Selecione o tipo de quarto"
                />
                < InputWithText labelText="Data da Atividade" placeholder="Digite a data da Atividade" required={true} />
                < InputWithText labelText="Hora da Atividade" placeholder="Digite o horário da Atividade" required={true} />
                <ButtonPoint label='Confirmar Atividade'></ButtonPoint>
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

export default CriarAtividade;