import { useState, useCallback } from 'react';

export function useApiCall<T>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err: any) {
            const errorMessage = err?.message || 'Erro ao executar requisição';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return { loading, error, data, execute, reset };
}

export async function batchApiCalls<T>(calls: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(calls.map(call => call()));
}

export async function apiCallWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
        }
    }

    throw lastError;
}

export class ApiCache {
    private cache: Map<string, { data: any; timestamp: number }> = new Map();
    private ttl: number;

    constructor(ttlMs: number = 5 * 60 * 1000) {
        this.ttl = ttlMs;
    }

    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get<T>(key: string): T | null {
        const cached = this.cache.get(key);

        if (!cached) return null;

        if (Date.now() - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clear(): void {
        this.cache.clear();
    }

    remove(key: string): void {
        this.cache.delete(key);
    }
}
