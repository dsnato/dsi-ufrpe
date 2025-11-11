/**
 * Formata data para padrão brasileiro (dd/mm/yyyy)
 */
export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return '-';
    }
}

/**
 * Formata horário para padrão brasileiro (HH:mm)
 */
export function formatTime(timeString: string | null | undefined): string {
    if (!timeString) return '-';

    try {
        // Se já vier no formato HH:mm, retorna direto
        if (timeString.match(/^\d{2}:\d{2}$/)) {
            return timeString;
        }

        // Se for timestamp completo
        const date = new Date(timeString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '-';
    }
}

/**
 * Formata valor monetário para padrão brasileiro
 */
export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
}

/**
 * Formata telefone para padrão brasileiro (XX) X.XXXX-XXXX
 */
export function formatPhone(phone: string | null | undefined): string {
    if (!phone) return '-';

    // Remove tudo que não é número
    const cleaned = phone.replace(/\D/g, '');

    // Formata: (XX) X.XXXX-XXXX ou (XX) XXXX-XXXX
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 3)}.${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
}

/**
 * Formata CPF para padrão brasileiro XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string | null | undefined): string {
    if (!cpf) return '-';

    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }

    return cpf;
}

/**
 * Retorna placeholder para valores vazios
 */
export function withPlaceholder(value: string | null | undefined, placeholder: string = 'Não informado'): string {
    return value && value.trim() !== '' ? value : placeholder;
}
