import { useRouter } from 'expo-router';

// Common handler for back navigation
export function useBackNavigation() {
    const router = useRouter();
    
    return {
        goBack: () => router.back(),
        navigateToList: (path: string) => router.push(path),
    };
}

// Common handler for form submission
export function useFormSubmission() {
    const handleSuccess = (callback: () => void, delayMs: number = 1500) => {
        setTimeout(callback, delayMs);
    };

    return {
        handleSuccess,
    };
}

// Common error handling
export function formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return 'Ocorreu um erro desconhecido. Tente novamente.';
}

// Common data transformation
export function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
}

// Common array operations
export function findById<T extends { id: string | number }>(
    items: T[],
    id: string | number
): T | undefined {
    return items.find(item => item.id === id);
}

export function filterByStatus<T extends { status: string }>(
    items: T[],
    status: string
): T[] {
    return items.filter(item => item.status === status);
}
