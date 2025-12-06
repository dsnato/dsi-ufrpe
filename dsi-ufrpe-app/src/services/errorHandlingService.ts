// Error types
export type ErrorType = 'network' | 'validation' | 'authentication' | 'server' | 'unknown';

export interface AppError {
    type: ErrorType;
    message: string;
    userMessage: string;
    statusCode?: number;
    timestamp: Date;
}

// Error handler service
class ErrorHandlingService {
    private logs: any[] = [];
    private isDevelopment = __DEV__;

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

    private parseError(error: Error, context?: string): AppError {
        const message = error.message.toLowerCase();
        let type: ErrorType = 'unknown';
        let userMessage = 'Ocorreu um erro inesperado';

        if (message.includes('network') || message.includes('fetch')) {
            type = 'network';
            userMessage = 'Erro de conexão. Verifique sua internet.';
        } else if (message.includes('validation') || message.includes('invalid')) {
            type = 'validation';
            userMessage = 'Os dados fornecidos são inválidos.';
        } else if (message.includes('auth') || message.includes('unauthorized')) {
            type = 'authentication';
            userMessage = 'Erro de autenticação. Por favor, faça login novamente.';
        } else if (message.includes('server') || message.includes('500')) {
            type = 'server';
            userMessage = 'Erro no servidor. Tente novamente mais tarde.';
        }

        return {
            type,
            message: error.message,
            userMessage,
            timestamp: new Date(),
        };
    }

    private logError(error: AppError, context?: string): void {
        const message = `[${context || 'App'}] ${error.message}`;
        this.logs.push({
            message,
            type: error.type,
            timestamp: error.timestamp,
        });

        if (this.isDevelopment) {
            console.error(message, error);
        }
    }

    log(message: string, data?: Record<string, any>): void {
        if (this.isDevelopment) {
            console.log(message, data || '');
        }
    }

    getLogs() {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

export const errorHandler = new ErrorHandlingService();
