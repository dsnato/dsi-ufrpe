// Common messages for CRUD operations
export const COMMON_MESSAGES = {
    LOADING: 'Carregando...',
    SAVING: 'Salvando...',
    CREATING: 'Criando...',
    UPDATING: 'Atualizando...',
    DELETING: 'Deletando...',
    ERROR: 'Ocorreu um erro. Tente novamente.',
    SUCCESS: 'Operação realizada com sucesso!',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar',
    SAVE: 'Salvar',
    CREATE: 'Criar',
    UPDATE: 'Atualizar',
    DELETE: 'Deletar',
    EDIT: 'Editar',
    BACK: 'Voltar',
    CLOSE: 'Fechar',
};

// Validation error messages
export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'Este campo é obrigatório.',
    MIN_LENGTH: (field: string, length: number) => `${field} deve ter pelo menos ${length} caracteres.`,
    INVALID_FORMAT: (field: string) => `${field} em formato inválido.`,
    INVALID_EMAIL: 'E-mail em formato inválido.',
    INVALID_PHONE: 'Telefone em formato inválido. Use (00) 00000-0000.',
    INVALID_CPF: 'CPF inválido.',
    INVALID_DATE: 'Data inválida. Use o formato DD/MM/YYYY.',
};

// Common placeholder texts
export const PLACEHOLDERS = {
    NAME: 'Digite o nome',
    EMAIL: 'seu@email.com',
    PHONE: '(00) 00000-0000',
    CPF: '000.000.000-00',
    DATE: 'DD/MM/YYYY',
    ZIPCODE: '00000-000',
    SEARCH: 'Pesquisar...',
    SELECT: 'Selecione uma opção',
};

// Button labels for CRUD screens
export const BUTTON_LABELS = {
    ADD: 'Adicionar',
    CREATE: 'Criar',
    EDIT: 'Editar',
    DELETE: 'Deletar',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar',
    BACK: 'Voltar',
    CLOSE: 'Fechar',
    YES: 'Sim',
    NO: 'Não',
    OK: 'OK',
};

// Screen titles
export const SCREEN_TITLES = {
    CREATE: 'Adicionar',
    EDIT: 'Editar',
    LIST: 'Listagem',
    DETAILS: 'Detalhes',
};
