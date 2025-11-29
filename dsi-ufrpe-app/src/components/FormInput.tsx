import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type FormInputProps = TextInputProps & {
    icon?: keyof typeof Ionicons.glyphMap;
    error?: string;
    helperText?: string;
    isDarkMode?: boolean;
};

export const FormInput: React.FC<FormInputProps> = ({
    icon,
    error,
    helperText,
    isDarkMode = false,
    multiline = false,
    numberOfLines = 1,
    style,
    ...rest
}) => {
    const colors = isDarkMode ? {
        bg: '#1A2332',
        border: '#2D3B4F',
        text: '#E2E8F0',
        placeholder: '#64748B',
        icon: '#FACC15',
        helper: '#94A3B8',
    } : {
        bg: '#FFFFFF',
        border: '#E2E8F0',
        text: '#1E293B',
        placeholder: '#94A3B8',
        icon: '#64748B',
        helper: '#64748B',
    };

    return (
        <View style={styles.wrapper}>
            <View style={[
                styles.container,
                {
                    backgroundColor: error ? '#FEF2F2' : colors.bg,
                    borderColor: error ? '#EF4444' : colors.border,
                },
                multiline && styles.containerMultiline
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={error ? '#EF4444' : colors.icon}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        multiline && styles.inputMultiline,
                        { height: multiline ? numberOfLines * 20 + 24 : 48 },
                        style
                    ]}
                    placeholderTextColor={colors.placeholder}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...rest}
                />
            </View>
            {error && (
                <View style={styles.messageContainer}>
                    <Ionicons name="alert-circle" size={14} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            {!error && helperText && (
                <Text style={[styles.helperText, { color: colors.helper }]}>{helperText}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        minHeight: 48,
    },
    containerMultiline: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        padding: 0,
    },
    inputMultiline: {
        paddingTop: 4,
        paddingBottom: 4,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '500',
    },
    helperText: {
        fontSize: 12,
        marginTop: 6,
        paddingHorizontal: 4,
    },
});
