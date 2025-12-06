import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

export function useCommonHandlers() {
    const navigation = useNavigation();

    const useBackNavigation = useCallback(() => {
        return () => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        };
    }, [navigation]);

    const formatErrorMessage = useCallback((error: any): string => {
        if (typeof error === 'string') return error;
        if (error?.message) return error.message;
        return 'Ocorreu um erro inesperado';
    }, []);

    const removeUndefinedFields = useCallback((obj: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(obj).filter(([, value]) => value !== undefined)
        );
    }, []);

    const findById = useCallback((arr: any[], id: string | number) => {
        return arr.find(item => item.id === id);
    }, []);

    const filterByStatus = useCallback((arr: any[], status: string) => {
        return arr.filter(item => item.status === status);
    }, []);

    const sortByField = useCallback((arr: any[], field: string, ascending: boolean = true) => {
        return [...arr].sort((a, b) => {
            if (a[field] < b[field]) return ascending ? -1 : 1;
            if (a[field] > b[field]) return ascending ? 1 : -1;
            return 0;
        });
    }, []);

    return {
        useBackNavigation,
        formatErrorMessage,
        removeUndefinedFields,
        findById,
        filterByStatus,
        sortByField,
        navigation,
    };
}
