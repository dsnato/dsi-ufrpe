/**
 * Funções de validação para garantir integridade dos dados antes de enviar ao backend
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Valida se um valor é uma string não vazia
 */
export const validarStringObrigatoria = (valor: any, nomeCampo: string): void => {
  if (typeof valor !== 'string' || valor.trim() === '') {
    throw new ValidationError(`${nomeCampo} é obrigatório e deve ser uma string não vazia`);
  }
};

/**
 * Valida se um valor é um número válido
 */
export const validarNumero = (valor: any, nomeCampo: string, min?: number, max?: number): void => {
  const num = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (typeof num !== 'number' || isNaN(num)) {
    throw new ValidationError(`${nomeCampo} deve ser um número válido`);
  }
  
  if (min !== undefined && num < min) {
    throw new ValidationError(`${nomeCampo} deve ser maior ou igual a ${min}`);
  }
  
  if (max !== undefined && num > max) {
    throw new ValidationError(`${nomeCampo} deve ser menor ou igual a ${max}`);
  }
};

/**
 * Valida se um valor é um inteiro válido
 */
export const validarInteiro = (valor: any, nomeCampo: string, min?: number, max?: number): void => {
  const num = typeof valor === 'string' ? parseInt(valor) : valor;
  
  if (typeof num !== 'number' || isNaN(num) || !Number.isInteger(num)) {
    throw new ValidationError(`${nomeCampo} deve ser um número inteiro válido`);
  }
  
  if (min !== undefined && num < min) {
    throw new ValidationError(`${nomeCampo} deve ser maior ou igual a ${min}`);
  }
  
  if (max !== undefined && num > max) {
    throw new ValidationError(`${nomeCampo} deve ser menor ou igual a ${max}`);
  }
};

/**
 * Valida formato de CPF (apenas formato, não valida dígitos verificadores)
 */
export const validarFormatoCPF = (cpf: string): void => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) {
    throw new ValidationError('CPF deve conter 11 dígitos');
  }
  
  // Verifica se todos os dígitos são iguais (CPFs inválidos como 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    throw new ValidationError('CPF inválido');
  }
};

/**
 * Valida formato de email
 */
export const validarEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    throw new ValidationError('Email inválido');
  }
};

/**
 * Valida formato de telefone brasileiro
 */
export const validarTelefone = (telefone: string): void => {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  // Aceita telefones com 10 ou 11 dígitos (com ou sem nono dígito no celular)
  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    throw new ValidationError('Telefone deve ter 10 ou 11 dígitos');
  }
};

/**
 * Valida formato de data YYYY-MM-DD
 */
export const validarFormatoData = (data: string, nomeCampo: string): void => {
  const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dataRegex.test(data)) {
    throw new ValidationError(`${nomeCampo} deve estar no formato YYYY-MM-DD`);
  }
  
  // Valida se é uma data válida
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) {
    throw new ValidationError(`${nomeCampo} não é uma data válida`);
  }
};

/**
 * Valida formato de data e hora YYYY-MM-DD HH:MM:SS
 */
export const validarFormatoDataHora = (dataHora: string, nomeCampo: string): void => {
  const dataHoraRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  
  if (!dataHoraRegex.test(dataHora)) {
    throw new ValidationError(`${nomeCampo} deve estar no formato YYYY-MM-DD HH:MM:SS`);
  }
  
  // Valida se é uma data/hora válida
  const dataObj = new Date(dataHora.replace(' ', 'T'));
  if (isNaN(dataObj.getTime())) {
    throw new ValidationError(`${nomeCampo} não é uma data/hora válida`);
  }
};

/**
 * Valida se a data de checkout é posterior à data de checkin
 */
export const validarPeriodoReserva = (checkin: string, checkout: string): void => {
  const dataCheckin = new Date(checkin);
  const dataCheckout = new Date(checkout);
  
  if (dataCheckout <= dataCheckin) {
    throw new ValidationError('Data de checkout deve ser posterior à data de checkin');
  }
};

/**
 * Valida se um valor decimal possui no máximo X casas decimais
 */
export const validarCasasDecimais = (valor: number, nomeCampo: string, maxCasas: number = 2): void => {
  const partes = valor.toString().split('.');
  if (partes.length > 1 && partes[1].length > maxCasas) {
    throw new ValidationError(`${nomeCampo} deve ter no máximo ${maxCasas} casas decimais`);
  }
};
