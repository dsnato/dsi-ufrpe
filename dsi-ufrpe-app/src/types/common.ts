// Common response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

// Common entity types
export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface StatusEntity extends BaseEntity {
    status: 'ativo' | 'inativo';
}

export interface AuditableEntity extends BaseEntity {
    created_by?: string;
    updated_by?: string;
}

// Common filter types
export interface ListFilter {
    search?: string;
    status?: string;
    sort?: 'asc' | 'desc';
    sortBy?: string;
    page?: number;
    limit?: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}

// Common form types
export interface FormState {
    loading: boolean;
    error?: string;
    success: boolean;
}

export interface FormValidation {
    isValid: boolean;
    errors: Record<string, string>;
}

// Notification types
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// User types
export interface UserProfile extends BaseEntity {
    user_id: string;
    full_name: string;
    avatar_url?: string;
    preferred_theme?: 'light' | 'dark';
}

// Generic CRUD operations response
export interface CrudOperationResult<T> extends ApiResponse<T> {
    operation: 'create' | 'read' | 'update' | 'delete';
}

// Error details
export interface ErrorDetail {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
}
