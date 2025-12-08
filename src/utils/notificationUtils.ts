import { useCallback } from 'react';

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top' | 'bottom' | 'center';

// Notification interface
export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    position: NotificationPosition;
    duration?: number;
    action?: {
        label: string;
        onPress: () => void;
    };
    autoClose?: boolean;
    timestamp: Date;
}

// Toast queue to manage multiple notifications
class NotificationManager {
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];
    private nextId = 0;

    // Add notification
    show(
        message: string,
        type: NotificationType = 'info',
        duration: number = 3000,
        position: NotificationPosition = 'top'
    ): string {
        const id = `notification-${this.nextId++}`;
        const notification: Notification = {
            id,
            message,
            type,
            position,
            duration,
            autoClose: true,
            timestamp: new Date(),
        };

        this.notifications.push(notification);
        this.notifyListeners();

        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }

        return id;
    }

    // Show success notification
    success(message: string, duration?: number): string {
        return this.show(message, 'success', duration);
    }

    // Show error notification
    error(message: string, duration?: number): string {
        return this.show(message, 'error', duration || 4000);
    }

    // Show warning notification
    warning(message: string, duration?: number): string {
        return this.show(message, 'warning', duration || 3500);
    }

    // Show info notification
    info(message: string, duration?: number): string {
        return this.show(message, 'info', duration);
    }

    // Show notification with action
    showWithAction(
        message: string,
        actionLabel: string,
        onAction: () => void,
        type: NotificationType = 'info',
        position: NotificationPosition = 'bottom'
    ): string {
        const id = `notification-${this.nextId++}`;
        const notification: Notification = {
            id,
            message,
            type,
            position,
            action: {
                label: actionLabel,
                onPress: () => {
                    onAction();
                    this.dismiss(id);
                },
            },
            autoClose: false,
            timestamp: new Date(),
        };

        this.notifications.push(notification);
        this.notifyListeners();

        return id;
    }

    // Dismiss notification
    dismiss(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    // Dismiss all notifications
    dismissAll(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    // Get all notifications
    getAll(): Notification[] {
        return [...this.notifications];
    }

    // Get notifications by type
    getByType(type: NotificationType): Notification[] {
        return this.notifications.filter(n => n.type === type);
    }

    // Get notifications by position
    getByPosition(position: NotificationPosition): Notification[] {
        return this.notifications.filter(n => n.position === position);
    }

    // Subscribe to changes
    subscribe(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getAll()));
    }

    // Clear old notifications (older than 10 minutes)
    clearOldNotifications(): void {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        this.notifications = this.notifications.filter(n => n.timestamp > tenMinutesAgo);
    }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Hook for using notification manager in components
export function useNotification() {
    const showSuccess = useCallback((message: string, duration?: number) => {
        return notificationManager.success(message, duration);
    }, []);

    const showError = useCallback((message: string, duration?: number) => {
        return notificationManager.error(message, duration);
    }, []);

    const showWarning = useCallback((message: string, duration?: number) => {
        return notificationManager.warning(message, duration);
    }, []);

    const showInfo = useCallback((message: string, duration?: number) => {
        return notificationManager.info(message, duration);
    }, []);

    const show = useCallback(
        (message: string, type: NotificationType = 'info', duration?: number) => {
            return notificationManager.show(message, type, duration);
        },
        []
    );

    const showWithAction = useCallback(
        (
            message: string,
            actionLabel: string,
            onAction: () => void,
            type: NotificationType = 'info'
        ) => {
            return notificationManager.showWithAction(message, actionLabel, onAction, type);
        },
        []
    );

    const dismiss = useCallback((id: string) => {
        notificationManager.dismiss(id);
    }, []);

    const dismissAll = useCallback(() => {
        notificationManager.dismissAll();
    }, []);

    return {
        show,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showWithAction,
        dismiss,
        dismissAll,
    };
}

// Toast notification helper (convenience wrapper)
export class Toast {
    static success(message: string, duration?: number): void {
        notificationManager.success(message, duration);
    }

    static error(message: string, duration?: number): void {
        notificationManager.error(message, duration);
    }

    static warning(message: string, duration?: number): void {
        notificationManager.warning(message, duration);
    }

    static info(message: string, duration?: number): void {
        notificationManager.info(message, duration);
    }

    static show(message: string, type: NotificationType = 'info', duration?: number): void {
        notificationManager.show(message, type, duration);
    }

    static showWithAction(
        message: string,
        actionLabel: string,
        onAction: () => void,
        type: NotificationType = 'info'
    ): void {
        notificationManager.showWithAction(message, actionLabel, onAction, type);
    }

    static dismiss(id: string): void {
        notificationManager.dismiss(id);
    }

    static dismissAll(): void {
        notificationManager.dismissAll();
    }
}

// Predefined toast messages
export const TOAST_MESSAGES = {
    // Success messages
    SUCCESS_SAVE: 'Salvo com sucesso!',
    SUCCESS_DELETE: 'Deletado com sucesso!',
    SUCCESS_UPDATE: 'Atualizado com sucesso!',
    SUCCESS_CREATE: 'Criado com sucesso!',
    SUCCESS_COPY: 'Copiado para a área de transferência!',

    // Error messages
    ERROR_NETWORK: 'Erro de conexão. Tente novamente.',
    ERROR_SERVER: 'Erro no servidor. Tente novamente mais tarde.',
    ERROR_VALIDATION: 'Verifique os dados fornecidos.',
    ERROR_UNAUTHORIZED: 'Você não tem permissão para executar esta ação.',
    ERROR_UNKNOWN: 'Ocorreu um erro inesperado.',

    // Warning messages
    WARNING_UNSAVED_CHANGES: 'Você tem alterações não salvas.',
    WARNING_DELETE_CONFIRMATION: 'Esta ação não pode ser desfeita.',
    WARNING_SLOW_CONNECTION: 'Sua conexão está lenta.',

    // Info messages
    INFO_LOADING: 'Carregando...',
    INFO_PROCESSING: 'Processando...',
};
