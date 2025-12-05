import { useToast } from '@/src/components/ToastContext';
import { useCallback, useState } from 'react';

// Generic API call wrapper with error handling
export function useApiCall<T>() {
    const { showError } = useToast();
    const [loading, setLoading] = useState(false);

    const execute = useCallback(
        async (apiFunction: () => Promise<T>): Promise<T | null> => {
            try {
                setLoading(true);
                const result = await apiFunction();
                return result;
            } catch (error) {
                console.error('API Error:', error);
                showError(
                    error instanceof Error
                        ? error.message
                        : 'Erro ao processar solicitação. Tente novamente.'
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [showError]
    );

    return { execute, loading };
}

// Batch API calls
export async function batchApiCalls<T>(
    calls: Array<() => Promise<T>>
): Promise<(T | null)[]> {
    return Promise.all(
        calls.map(call =>
            call().catch(error => {
                console.error('Batch call error:', error);
                return null;
            })
        )
    );
}

// API call with retry logic
export async function apiCallWithRetry<T>(
    apiFunction: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T | null> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                console.error('Max retries reached:', error);
                return null;
            }
        }
    }
    return null;
}

// Cache handler for API responses
export class ApiCache<T> {
    private cache: Map<string, { data: T; timestamp: number }> = new Map();
    private ttl: number; // Time to live in milliseconds

    constructor(ttlMinutes: number = 5) {
        this.ttl = ttlMinutes * 60 * 1000;
    }

    set(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    get(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return item.data;
    }

    clear(): void {
        this.cache.clear();
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }
}
