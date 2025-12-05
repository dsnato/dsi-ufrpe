// Array utilities
export function removeDuplicates<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

export function removeById<T extends { id: any }>(
    arr: T[],
    id: T['id']
): T[] {
    return arr.filter(item => item.id !== id);
}

export function updateById<T extends { id: any }>(
    arr: T[],
    id: T['id'],
    updates: Partial<T>
): T[] {
    return arr.map(item =>
        item.id === id ? { ...item, ...updates } : item
    );
}

export function replaceItem<T extends { id: any }>(
    arr: T[],
    newItem: T
): T[] {
    const hasItem = arr.some(item => item.id === newItem.id);
    return hasItem ? updateById(arr, newItem.id, newItem) : [...arr, newItem];
}

export function sortBy<T>(
    arr: T[],
    key: keyof T,
    order: 'asc' | 'desc' = 'asc'
): T[] {
    return [...arr].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return order === 'asc' ? comparison : -comparison;
    });
}

export function groupBy<T>(
    arr: T[],
    key: keyof T
): Record<string, T[]> {
    return arr.reduce((groups, item) => {
        const groupKey = String(item[key]);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<string, T[]>);
}

export function unique<T>(
    arr: T[],
    key: keyof T
): T[] {
    const seen = new Set<T[keyof T]>();
    return arr.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
    });
}

// Object utilities
export function pickProperties<T, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        result[key] = obj[key];
    });
    return result;
}

export function omitProperties<T, K extends keyof T>(
    obj: T,
    ...keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}

export function mergeObjects<T>(
    ...objects: Partial<T>[]
): Partial<T> {
    return objects.reduce((merged, obj) => ({ ...merged, ...obj }), {});
}

export function isEmptyObject(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
}

export function hasProperty<T>(
    obj: T,
    key: PropertyKey
): key is keyof T {
    return key in (obj as object);
}

// Null/undefined utilities
export function isNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined;
}

export function getOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return isNullOrUndefined(value) ? defaultValue : value;
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
