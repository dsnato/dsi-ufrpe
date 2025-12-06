// Array utilities
export function removeDuplicates<T>(arr: T[], key?: keyof T): T[] {
    if (!key) return [...new Set(arr)];
    const seen = new Set();
    return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

export function removeById<T extends { id: any }>(arr: T[], id: any): T[] {
    return arr.filter(item => item.id !== id);
}

export function updateById<T extends { id: any }>(arr: T[], id: any, updates: Partial<T>): T[] {
    return arr.map(item => (item.id === id ? { ...item, ...updates } : item));
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce((acc, item) => {
        const k = String(item[key]);
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}

export function sortBy<T>(arr: T[], key: keyof T, ascending = true): T[] {
    return [...arr].sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
}

export function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

export function flatten<T>(arr: T[][]): T[] {
    return arr.reduce((acc, val) => acc.concat(val), []);
}

// Object utilities
export function pickProperties<T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[]
): Partial<T> {
    return keys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {} as Partial<T>);
}

export function omitProperties<T extends Record<string, any>>(
    obj: T,
    keys: (keyof T)[]
): Partial<T> {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

export function mergeObjects<T extends Record<string, any>>(
    ...objects: Partial<T>[]
): T {
    return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T);
}

export function deepMergeObjects<T extends Record<string, any>>(
    target: T,
    source: Partial<T>
): T {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMergeObjects(target[key] || {}, source[key]);
        } else {
            result[key] = source[key] as any;
        }
    }
    return result;
}

// Type guards
export function isArray(value: any): value is any[] {
    return Array.isArray(value);
}

export function isObject(value: any): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isNumber(value: any): value is number {
    return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return value === undefined;
}

// Null/undefined utilities
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export function coalesce<T>(...values: (T | null | undefined)[]): T | null {
    return values.find(isDefined) ?? null;
}

export function defaultValue<T>(value: T | null | undefined, defaultVal: T): T {
    return isDefined(value) ? value : defaultVal;
}
