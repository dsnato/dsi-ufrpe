/**
 * Helper para traduzir e tornar mensagens de erro do Supabase mais amigáveis
 */

export const translateAuthError = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    // Auth Errors - Login
    'Invalid login credentials': 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
    'Email not confirmed': 'Por favor, confirme seu e-mail antes de fazer login.',
    'Invalid email': 'O e-mail informado não é válido.',
    'User not found': 'Usuário não encontrado. Verifique o e-mail digitado.',
    'Invalid password': 'Senha incorreta. Tente novamente.',
    'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
    'Invalid token': 'Sessão expirada. Por favor, faça login novamente.',
    
    // Auth Errors - Signup
    'User already registered': 'Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'Signup requires a valid password': 'Por favor, informe uma senha válida.',
    'Unable to validate email address: invalid format': 'O formato do e-mail é inválido.',
    'Email address is invalid': 'O e-mail informado é inválido.',
    
    // Network Errors
    'Failed to fetch': 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    'Network request failed': 'Falha na conexão. Verifique sua internet e tente novamente.',
    'timeout': 'A conexão demorou muito para responder. Tente novamente.',
    
    // Database Errors
    'duplicate key value': 'Este registro já existe no sistema.',
    'violates foreign key constraint': 'Não é possível realizar esta operação devido a dados relacionados.',
    'permission denied': 'Você não tem permissão para realizar esta ação.',
    
    // Generic Errors
    'An error occurred': 'Ocorreu um erro inesperado. Tente novamente.',
    'Something went wrong': 'Algo deu errado. Por favor, tente novamente.',
  };

  // Busca por correspondência exata
  if (errorMap[errorMessage]) {
    return errorMap[errorMessage];
  }

  // Busca por correspondência parcial (case insensitive)
  const lowerMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // Se não encontrar correspondência, retorna mensagem genérica amigável
  return `Ops! ${errorMessage}. Por favor, tente novamente ou entre em contato com o suporte.`;
};

/**
 * Helper para mensagens de sucesso padronizadas
 */
export const getSuccessMessage = (action: string): string => {
  const successMap: Record<string, string> = {
    'login': '🎉 Bem-vindo de volta! Login realizado com sucesso.',
    'signup': '✨ Conta criada com sucesso! Bem-vindo ao sistema.',
    'logout': '👋 Até logo! Você foi desconectado com sucesso.',
    'update': '✅ Dados atualizados com sucesso!',
    'delete': '🗑️ Item removido com sucesso.',
    'create': '✨ Item criado com sucesso!',
    'save': '💾 Salvo com sucesso!',
    'upload': '📤 Upload realizado com sucesso!',
    'email_sent': '📧 E-mail enviado! Verifique sua caixa de entrada.',
    'password_reset': '🔑 Senha redefinida com sucesso!',
  };

  return successMap[action] || '✅ Operação realizada com sucesso!';
};

/**
 * Helper para validações de formulário
 */
export const getValidationMessage = (field: string, type: string): string => {
  const messages: Record<string, Record<string, string>> = {
    'required': {
      'email': 'Por favor, informe seu e-mail.',
      'password': 'Por favor, informe sua senha.',
      'name': 'Por favor, informe seu nome.',
      'phone': 'Por favor, informe seu telefone.',
      'cnpj': 'Por favor, informe o CNPJ.',
      'hotel_name': 'Por favor, informe o nome do hotel.',
      'default': 'Este campo é obrigatório.',
    },
    'invalid': {
      'email': 'O e-mail informado não é válido. Verifique e tente novamente.',
      'password': 'A senha deve ter pelo menos 6 caracteres.',
      'phone': 'O telefone informado não é válido.',
      'cnpj': 'O CNPJ informado não é válido.',
      'default': 'O valor informado não é válido.',
    },
    'mismatch': {
      'password': 'As senhas não conferem. Digite novamente.',
      'default': 'Os valores não conferem.',
    },
  };

  return messages[type]?.[field] || messages[type]?.['default'] || 'Erro de validação.';
};
