export function formatCpfInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14);
}

export function formatPhoneInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3').slice(0, 14);
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').slice(0, 15);
}

export function formatZipCodeInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);
}

export function formatCurrencyInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const number = parseInt(cleaned || '0');
    return (number / 100).toFixed(2).replace('.', ',');
}

export function formatDateInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3').slice(0, 10);
}

export function formatPercentageInput(value: string): string {
    const cleaned = value.replace(/\D/g, '');
    const number = Math.min(parseInt(cleaned || '0'), 100);
    return number.toString();
}

export function stripFormatting(value: string): string {
    return value.replace(/\D/g, '');
}

export function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toUpperCase(value: string): string {
    return value.toUpperCase();
}

export function toLowerCase(value: string): string {
    return value.toLowerCase();
}
