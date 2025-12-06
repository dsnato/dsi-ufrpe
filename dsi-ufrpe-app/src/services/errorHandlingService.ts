import { Platform } from 'react-native';

// Error types
export type ErrorType = 'network' | 'validation' | 'authentication' | 'authorization' | 'server' | 'unknown';

export interface AppError {
    type: ErrorType;
    message: string;
    userMessage: string;
    statusCode?: number;
    originalError?: Error;
    timestamp: Date;
}

// Logging levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
    level: LogLevel;
    message: string;
    data?: Record<string, any>;
    timestamp: Date;
    stack?: string;
}

// Error handler service
class ErrorHandlingService {
    private logs: LogEntry[] = [];
    private maxLogs = 100;
    private isDevelopment = __DEV__;

    // Categorize and format errors
    handleError(error: any, context?: string): AppError {
        let appError: AppError;

        if (error instanceof Error) {
            appError = this.parseError(error, context);
        } else if (typeof error === 'string') {
            appError = {
                type: 'unknown',
                message: error,
                userMessage: 'Ocorreu um erro inesperado',
                timestamp: new Date(),
            };
        } else {
            appError = {
                type: 'unknown',
                message: JSON.stringify(error),
                userMessage: 'Ocorreu um erro inesperado',
                timestamp: new Date(),
            };
        }

        this.logError(appError, context);
        return appError;
    }

    // Parse specific error types
    private parseError(error: Error, context?: string): AppError {
        const message = error.message.toLowerCase();
        let type: ErrorType = 'unknown';
        let userMessage = 'Ocorreu um erro inesperado';

        // Network errors
        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
            type = 'network';
            userMessage = 'Erro de conexão. Verifique sua internet.';
        }
        // Validation errors
        else if (message.includes('validation') || message.includes('invalid')) {
            type = 'validation';
            userMessage = 'Os dados fornecidos são inválidos.';
        }
        // Authentication errors
        else if (message.includes('auth') || message.includes('unauthorized')) {
            type = 'authentication';
            userMessage = 'Erro de autenticação. Por favor, faça login novamente.';
        }
        // Authorization errors
        else if (message.includes('forbidden') || message.includes('permission')) {
            type = 'authorization';
            userMessage = 'Você não tem permissão para executar esta ação.';
        }
        // Server errors
        else if (message.includes('server') || message.includes('500') || message.includes('database')) {
            type = 'server';
            userMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }

        return {
            type,
            message: error.message,
            userMessage,
            originalError: error,
            timestamp: new Date(),
            stack: error.stack,
        };
    }

    // Log error
    private logError(error: AppError, context?: string): void {
        const logEntry: LogEntry = {
            level: 'error',
            message: `[${context || 'App'}] ${error.message}`,
            data: {
                type: error.type,
                userMessage: error.userMessage,
                statusCode: error.statusCode,
            },
            timestamp: error.timestamp,
            stack: error.originalError?.stack,
        };

        this.addLog(logEntry);

        if (this.isDevelopment) {
            console.error(`[ERROR] ${logEntry.message}`, error);
        }
    }

    // Log info
    log(message: string, data?: Record<string, any>, context?: string): void {
        const logEntry: LogEntry = {
            level: 'info',
            message: `[${context || 'App'}] ${message}`,
            data,
            timestamp: new Date(),
        };

        this.addLog(logEntry);

        if (this.isDevelopment) {
            console.log(`[INFO] ${logEntry.message}`, data || '');
        }
    }

    // Log warning
    warn(message: string, data?: Record<string, any>, context?: string): void {
        const logEntry: LogEntry = {
            level: 'warn',
            message: `[${context || 'App'}] ${message}`,
            data,
            timestamp: new Date(),
        };

        this.addLog(logEntry);

        if (this.isDevelopment) {
            console.warn(`[WARN] ${logEntry.message}`, data || '');
        }
    }

    // Log debug info
    debug(message: string, data?: Record<string, any>, context?: string): void {
        if (!this.isDevelopment) return;

        const logEntry: LogEntry = {
            level: 'debug',
            message: `[${context || 'App'}] ${message}`,
            data,
            timestamp: new Date(),
        };

        this.addLog(logEntry);
        console.debug(`[DEBUG] ${logEntry.message}`, data || '');
    }

    // Add log entry
    private addLog(entry: LogEntry): void {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    // Get all logs
    getLogs(level?: LogLevel): LogEntry[] {
        return level ? this.logs.filter(log => log.level === level) : this.logs;
    }

    // Clear logs
    clearLogs(): void {
        this.logs = [];
    }

    // Export logs for debugging
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    // Get user-friendly error message
    getUserMessage(error: any): string {
        if (error instanceof AppError || (error && error.userMessage)) {
            return (error as AppError).userMessage;
        }

        const appError = this.handleError(error);
        return appError.userMessage;
    }

    // Check if error is recoverable
    isRecoverable(error: AppError): boolean {
        return error.type === 'network' || error.type === 'validation' || error.type === 'authentication';
    }
}

// Export singleton instance
export const errorHandler = new ErrorHandlingService();

// Utility function for retry logic with exponential backoff
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            const delay = initialDelay * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

// Utility function to create safe async handlers
export function createAsyncHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    onError?: (error: AppError) => void
) {
    return async (...args: T): Promise<R | undefined> => {
        try {
            return await fn(...args);
        } catch (error) {
            const appError = errorHandler.handleError(error, fn.name);
            onError?.(appError);
            return undefined;
        }
    };
}

// Utility function to wrap promises with error handling
export function withErrorHandling<T>(
    promise: Promise<T>,
    context?: string
): Promise<T | undefined> {
    return promise.catch(error => {
        errorHandler.handleError(error, context);
        return undefined;
    });
}
