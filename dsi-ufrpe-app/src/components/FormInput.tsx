import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

type FormInputProps = TextInputProps & {
    icon?: keyof typeof Ionicons.glyphMap;
    error?: string;
    helperText?: string;
};

export const FormInput: React.FC<FormInputProps> = ({
    icon,
    error,
    helperText,
    multiline = false,
    numberOfLines = 1,
    style,
    ...rest
}) => {
    return (
        <View style={styles.wrapper}>
            <View style={[
                styles.container,
                error && styles.containerError,
                multiline && styles.containerMultiline
            ]}>
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={error ? '#EF4444' : '#64748B'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.inputMultiline,
                        { height: multiline ? numberOfLines * 20 + 24 : 48 },
                        style
                    ]}
                    placeholderTextColor="#94A3B8"
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
                <Text style={styles.helperText}>{helperText}</Text>
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        minHeight: 48,
    },
    containerError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
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
        color: '#1E293B',
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
        color: '#64748B',
        marginTop: 6,
        paddingHorizontal: 4,
    },
});
