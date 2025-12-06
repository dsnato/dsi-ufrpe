// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top' | 'bottom' | 'center';

export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    position: NotificationPosition;
    duration?: number;
    timestamp: Date;
}

// Notification manager
class NotificationManager {
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];
    private nextId = 0;

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
            timestamp: new Date(),
        };

        this.notifications.push(notification);
        this.notifyListeners();

        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }

        return id;
    }

    success(message: string, duration?: number): string {
        return this.show(message, 'success', duration);
    }

    error(message: string, duration?: number): string {
        return this.show(message, 'error', duration || 4000);
    }

    warning(message: string, duration?: number): string {
        return this.show(message, 'warning', duration || 3500);
    }

    info(message: string, duration?: number): string {
        return this.show(message, 'info', duration);
    }

    dismiss(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    dismissAll(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    getAll(): Notification[] {
        return [...this.notifications];
    }

    subscribe(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getAll()));
    }
}

export const notificationManager = new NotificationManager();

// Toast convenience wrapper
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

    static dismiss(id: string): void {
        notificationManager.dismiss(id);
    }

    static dismissAll(): void {
        notificationManager.dismissAll();
    }
}

export const TOAST_MESSAGES = {
    SUCCESS_SAVE: 'Salvo com sucesso!',
    SUCCESS_DELETE: 'Deletado com sucesso!',
    ERROR_NETWORK: 'Erro de conexão. Tente novamente.',
    ERROR_SERVER: 'Erro no servidor. Tente novamente mais tarde.',
    ERROR_UNKNOWN: 'Ocorreu um erro inesperado.',
};
