import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SelectOption {
    label: string;
    value: string;
}

type FormSelectProps = {
    icon?: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    options: SelectOption[];
    onSelect: (value: string) => void;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    isDarkMode?: boolean;
};

export const FormSelect: React.FC<FormSelectProps> = ({
    icon,
    placeholder,
    value,
    options,
    onSelect,
    error,
    helperText,
    disabled = false,
    isDarkMode = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    const handleSelect = (optionValue: string) => {
        onSelect(optionValue);
        setIsOpen(false);
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[
                    styles.container,
                    isDarkMode && styles.containerDark,
                    error && styles.containerError,
                    disabled && styles.containerDisabled
                ]}
                onPress={() => !disabled && setIsOpen(true)}
                activeOpacity={0.7}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={error ? '#EF4444' : disabled ? '#CBD5E1' : isDarkMode ? '#60A5FA' : '#64748B'}
                        style={styles.icon}
                    />
                )}
                <Text
                    style={[
                        styles.text,
                        isDarkMode && styles.textDark,
                        !selectedOption && styles.placeholder,
                        disabled && styles.textDisabled
                    ]}
                    numberOfLines={1}
                >
                    {displayText}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={error ? '#EF4444' : disabled ? '#CBD5E1' : isDarkMode ? '#60A5FA' : '#64748B'}
                />
            </TouchableOpacity>

            {error && (
                <View style={styles.messageContainer}>
                    <Ionicons name="alert-circle" size={14} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            {!error && helperText && (
                <Text style={styles.helperText}>{helperText}</Text>
            )}

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
                        <View style={[styles.modalHeader, isDarkMode && styles.modalHeaderDark]}>
                            <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>Selecione uma opção</Text>
                            <TouchableOpacity
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color={isDarkMode ? '#60A5FA' : '#64748B'} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.optionsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.option,
                                        isDarkMode && styles.optionDark,
                                        option.value === value && (isDarkMode ? styles.optionSelectedDark : styles.optionSelected)
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isDarkMode && styles.optionTextDark,
                                            option.value === value && (isDarkMode ? styles.optionTextSelectedDark : styles.optionTextSelected)
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {option.value === value && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={22}
                                            color={isDarkMode ? '#60A5FA' : '#0162B3'}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        height: 48,
    },
    containerError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    containerDisabled: {
        backgroundColor: '#F8FAFC',
        opacity: 0.6,
    },
    containerDark: {
        backgroundColor: 'rgba(26, 35, 50, 0.4)',
        borderColor: 'rgba(45, 59, 79, 0.6)',
    },
    icon: {
        marginRight: 12,
    },
    text: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '500',
    },
    textDark: {
        color: '#E2E8F0',
    },
    placeholder: {
        color: '#94A3B8',
        fontWeight: '400',
    },
    textDisabled: {
        color: '#CBD5E1',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '70%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#132F3B',
    },
    closeButton: {
        padding: 4,
    },
    optionsList: {
        maxHeight: 400,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    optionSelected: {
        backgroundColor: '#EFF6FF',
    },
    optionText: {
        fontSize: 15,
        color: '#334155',
        fontWeight: '500',
        flex: 1,
    },
    optionTextSelected: {
        color: '#0162B3',
        fontWeight: '600',
    },
    modalContentDark: {
        backgroundColor: '#0B1624',
        shadowColor: '#000',
        shadowOpacity: 0.4,
    },
    modalHeaderDark: {
        borderBottomColor: 'rgba(45, 59, 79, 0.6)',
    },
    modalTitleDark: {
        color: '#F1F5F9',
    },
    optionDark: {
        borderBottomColor: 'rgba(45, 59, 79, 0.3)',
    },
    optionSelectedDark: {
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
    },
    optionTextDark: {
        color: '#E2E8F0',
    },
    optionTextSelectedDark: {
        color: '#60A5FA',
        fontWeight: '600',
    },
});

