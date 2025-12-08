// CPF validation
export function validateCpf(cpfString: string): boolean {
    const cpfNumbers = cpfString.replace(/\D/g, '');

    if (cpfNumbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfNumbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpfNumbers.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    if (firstDigit !== parseInt(cpfNumbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpfNumbers.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    if (secondDigit !== parseInt(cpfNumbers.charAt(10))) return false;

    return true;
}

// Email validation
export function validateEmail(emailString: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailString);
}

// Date validation (DD/MM/YYYY)
export function validateDate(dateString: string): Date | null {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateString)) return null;

    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    if (
        date.getDate() !== day ||
        date.getMonth() !== month - 1 ||
        date.getFullYear() !== year
    ) {
        return null;
    }

    return date;
}

// Phone validation
export function validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Name validation
export function validateName(name: string, minLength: number = 3): boolean {
    return name.trim().length >= minLength;
}
