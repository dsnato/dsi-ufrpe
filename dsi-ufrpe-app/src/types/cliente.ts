export interface Cliente {
    id: string;
    name: string;
    cpf: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    imagem_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClienteFormData {
    name: string;
    cpf: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
}
