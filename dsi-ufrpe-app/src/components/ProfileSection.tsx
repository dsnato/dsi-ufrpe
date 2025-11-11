import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type ProfileSectionProps = {
    name: string;
    subtitle: string;
    imageSource?: ImageSourcePropType;
};

export function ProfileSection({ name, subtitle, imageSource }: ProfileSectionProps) {
    const defaultImage = require('@/assets/images/photo-model.png');

    return (
        <View style={styles.container}>
            <Image
                source={imageSource || defaultImage}
                style={styles.image}
            />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#132F3B',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFE157',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        color: '#E0F2FE',
        textAlign: 'center',
    },
});
