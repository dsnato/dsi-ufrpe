export interface Quarto {
    id: string;
    numero: string;
    tipo: string; // Solteiro, Casal, Suíte, etc.
    capacidade: number;
    preco: number;
    disponivel: boolean;
    descricao?: string;
    created_at?: string;
    updated_at?: string;
}

export interface QuartoFormData {
    numero: string;
    tipo: string;
    capacidade: number;
    preco: number;
    disponivel: boolean;
    descricao?: string;
}
