export interface Funcionario {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    email: string;
    role: string; // cargo/função
    created_at?: string;
    updated_at?: string;
}

export interface FuncionarioFormData {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    role: string;
}
