import ButtonPoint from '@/src/components/button';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const InitScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleLoginClick = () => {
        navigation.navigate('Login' as never);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('@/assets/images/hotel1.png')}
                    style={styles.iconSmall}
                />
                <Text style={styles.appName}>Hostify</Text>
            </View>
            <Image
                source={require('@/assets/images/hotel1.png')}
                style={styles.iconLarge}
            />
            <Text style={styles.subtitle}>
                Seus dashboards e CRUD’s de forma rápida e simplificada para ver seu rendimento nas alturas
            </Text>
            <ButtonPoint
                label="Prosseguir"
                style={styles.button}
                onPress={handleLoginClick}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Adicionado para centralizar horizontalmente
        marginBottom: 16,
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
    },
    iconSmall: {
        width: 32,
        height: 32,
        marginRight: 8,
        alignSelf: 'center', // Garante alinhamento vertical ao centro
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2176ff',
    },
    iconLarge: {
        width: 200,
        height: 200,
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 20,
        color: '#222',
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#8fa9e6',
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 32,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 40,
        width: '80%',
    },
});

export default InitScreen;