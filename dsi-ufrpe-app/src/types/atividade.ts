export interface Atividade {
    id: string;
    nome: string;
    descricao: string;
    data_atividade: string; // ISO date string
    horario: string; // HH:mm format
    local: string;
    ativa: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AtividadeFormData {
    nome: string;
    descricao: string;
    data_atividade: string;
    horario: string;
    local: string;
    ativa: boolean;
}
