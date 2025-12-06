export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

export interface BaseEntity {
    id: string | number;
    createdAt: Date;
    updatedAt: Date;
}

export interface StatusEntity extends BaseEntity {
    status: 'active' | 'inactive' | 'deleted';
}

export interface ListFilter {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FormState<T> {
    data: T;
    errors: Partial<Record<keyof T, string>>;
    isLoading: boolean;
    isDirty: boolean;
}

export interface UserProfile extends BaseEntity {
    name: string;
    email: string;
    avatar?: string;
    role: string;
}

export interface CrudOperationResult<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface NotificationData {
    title: string;
    body: string;
    data?: Record<string, any>;
}

export interface DialogOptions {
    title: string;
    message: string;
    buttons?: Array<{ label: string; onPress: () => void }>;
}
