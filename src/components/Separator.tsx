import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface SeparatorProps {
    /**
     * Cor da linha separadora
     * @default '#E2E8F0'
     */
    color?: string;

    /**
     * Altura da linha separadora
     * @default 1
     */
    height?: number;

    /**
     * Margem superior
     * @default 0
     */
    marginTop?: number;

    /**
     * Margem inferior
     * @default 20
     */
    marginBottom?: number;

    /**
     * Estilos customizados adicionais
     */
    style?: ViewStyle;
}

/**
 * Componente Separator - Linha divisória horizontal reutilizável
 * 
 * Utilizado para separar visualmente seções de conteúdo nas telas Info
 * 
 * @example
 * ```tsx
 * <Separator />
 * <Separator color="#CBD5E1" marginTop={16} marginBottom={16} />
 * <Separator height={2} />
 * ```
 */
export const Separator: React.FC<SeparatorProps> = ({
    color = '#E2E8F0',
    height = 1,
    marginTop = 0,
    marginBottom = 20,
    style,
}) => {
    return (
        <View
            style={[
                styles.separator,
                {
                    backgroundColor: color,
                    height,
                    marginTop,
                    marginBottom,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    separator: {
        width: '100%',
    },
});
