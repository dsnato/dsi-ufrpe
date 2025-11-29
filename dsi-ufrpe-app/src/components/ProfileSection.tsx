import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type ProfileSectionProps = {
    name: string;
    subtitle: string;
    imageSource?: ImageSourcePropType;
    backgroundColor?: string;
    nameColor?: string;
    subtitleColor?: string;
};

export function ProfileSection({
    name,
    subtitle,
    imageSource,
    backgroundColor = '#132F3B',
    nameColor = '#FFE157',
    subtitleColor = '#E0F2FE',
}: ProfileSectionProps) {
    const defaultImage = require('@/assets/images/photo-model.png');

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Image
                source={imageSource || defaultImage}
                style={styles.image}
            />
            <Text style={[styles.name, { color: nameColor }]}>{name}</Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
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
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
    },
});

