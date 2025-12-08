// CPF formatting (000.000.000-00)
export function formatCpfInput(text: string): string {
    const numbersOnly = text.replace(/\D/g, '');
    const limited = numbersOnly.slice(0, 11);

    let formatted = limited;
    if (limited.length >= 4) {
        formatted = `${limited.slice(0, 3)}.${limited.slice(3)}`;
    }
    if (limited.length >= 7) {
        formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    }
    if (limited.length >= 10) {
        formatted = `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }

    return formatted;
}

// Phone formatting ((00) 00000-0000)
export function formatPhoneInput(text: string): string {
    const numbersOnly = text.replace(/\D/g, '');
    const limited = numbersOnly.slice(0, 11);

    let formatted = limited;
    if (limited.length >= 3) {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    }
    if (limited.length >= 8) {
        formatted = `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }

    return formatted;
}

// CEP formatting (00000-000)
export function formatZipCodeInput(text: string): string {
    const numbersOnly = text.replace(/\D/g, '');
    const limited = numbersOnly.slice(0, 8);

    let formatted = limited;
    if (limited.length >= 6) {
        formatted = `${limited.slice(0, 5)}-${limited.slice(5)}`;
    }

    return formatted;
}

// Currency formatting (R$ 0.000,00)
export function formatCurrencyInput(text: string): string {
    const numbersOnly = text.replace(/\D/g, '');
    const numberValue = parseInt(numbersOnly) / 100;

    if (isNaN(numberValue)) {
        return '';
    }

    const formatted = numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatted;
}

// Date formatting (DD/MM/YYYY with validation)
export function formatDateInput(text: string): string {
    const numbersOnly = text.replace(/\D/g, '');
    const limited = numbersOnly.slice(0, 8);

    // Valida e corrige o mês (1-12)
    let processedValue = limited;
    if (limited.length >= 4) {
        const month = parseInt(limited.slice(2, 4));
        let correctedMonth = limited.slice(2, 4);

        if (month > 12) {
            correctedMonth = '12';
        } else if (month === 0 && limited.length >= 4) {
            correctedMonth = '01';
        }

        processedValue = limited.slice(0, 2) + correctedMonth + limited.slice(4);
    }

    // Valida e corrige o ano (1900-2100)
    if (processedValue.length === 8) {
        const year = parseInt(processedValue.slice(4, 8));
        let correctedYear = processedValue.slice(4, 8);

        if (year < 1900) {
            correctedYear = '1900';
        } else if (year > 2100) {
            correctedYear = '2100';
        }

        processedValue = processedValue.slice(0, 4) + correctedYear;
    }

    let formatted = processedValue;
    if (processedValue.length >= 3) {
        formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2)}`;
    }
    if (processedValue.length >= 5) {
        formatted = `${processedValue.slice(0, 2)}/${processedValue.slice(2, 4)}/${processedValue.slice(4)}`;
    }

    return formatted;
}

// Remove formatting for database storage
export function stripFormatting(value: string): string {
    return value.replace(/\D/g, '');
}
