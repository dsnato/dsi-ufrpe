import { supabase } from '../../lib/supabase';
import {
  validarEmail,
  validarFormatoCPF,
  validarStringObrigatoria,
  validarTelefone,
  ValidationError
} from '../utils/validators';

export interface Cliente {
  id?: string;
  nome_completo: string;
  cpf: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todos os clientes
 */
export const listarClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao listar clientes:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar cliente por ID
 */
export const buscarClientePorId = async (id: string): Promise<Cliente | null> => {
  console.log('🔵 [clientesService] buscarClientePorId chamado para ID:', id);
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('❌ [clientesService] Erro ao buscar cliente:', error);
    throw new Error(error.message);
  }

  console.log('✅ [clientesService] Cliente encontrado:', JSON.stringify(data, null, 2));
  console.log('🖼️ [clientesService] URL da imagem:', data?.imagem_url);
  
  return data;
};

/**
 * Criar novo cliente
 */
export const criarCliente = async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> => {
  console.log('🟢 [clientesService] criarCliente chamado');
  console.log('🟢 [clientesService] Dados recebidos:', JSON.stringify(cliente, null, 2));
  
  try {
    // Validações
    console.log('🔍 [clientesService] Iniciando validações...');
    
    validarStringObrigatoria(cliente.nome_completo, 'Nome completo');
    validarStringObrigatoria(cliente.cpf, 'CPF');
    validarFormatoCPF(cliente.cpf);
    
    if (cliente.email) {
      validarEmail(cliente.email);
    }
    
    if (cliente.telefone) {
      validarTelefone(cliente.telefone);
    }
    
    // Data de nascimento aceita qualquer string
    
    console.log('✅ [clientesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [clientesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const dadosParaInserir = {
    ...cliente,
    pais: cliente.pais || 'Brasil'
  };
  
  console.log('🟢 [clientesService] Dados para inserir:', JSON.stringify(dadosParaInserir, null, 2));
  
  const { data, error } = await supabase
    .from('clientes')
    .insert([dadosParaInserir])
    .select()
    .single();

  if (error) {
    console.error('🔴 [clientesService] Erro Supabase:', error);
    console.error('🔴 [clientesService] Detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ [clientesService] Cliente criado:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Atualizar cliente existente
 */
export const atualizarCliente = async (id: string, cliente: Partial<Cliente>): Promise<Cliente> => {
  console.log('🟢 [clientesService] atualizarCliente chamado');
  console.log('🟢 [clientesService] ID:', id);
  console.log('🟢 [clientesService] Dados recebidos:', JSON.stringify(cliente, null, 2));
  
  try {
    // Validações (apenas para campos presentes)
    console.log('🔍 [clientesService] Iniciando validações...');
    
    if (cliente.nome_completo !== undefined) {
      validarStringObrigatoria(cliente.nome_completo, 'Nome completo');
    }
    
    if (cliente.cpf !== undefined) {
      validarStringObrigatoria(cliente.cpf, 'CPF');
      validarFormatoCPF(cliente.cpf);
    }
    
    if (cliente.email) {
      validarEmail(cliente.email);
    }
    
    if (cliente.telefone) {
      validarTelefone(cliente.telefone);
    }
    
    // Data de nascimento aceita qualquer string (atualizarCliente)
    
    console.log('✅ [clientesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [clientesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('🔴 [clientesService] Erro ao atualizar cliente:', error);
    console.error('🔴 [clientesService] Erro código:', error.code);
    console.error('🔴 [clientesService] Erro detalhes:', error.details);
    console.error('🔴 [clientesService] Dados enviados:', JSON.stringify(cliente, null, 2));
    throw new Error(error.message);
  }

  console.log('✅ [clientesService] Cliente atualizado:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Excluir cliente
 */
export const excluirCliente = async (id: string): Promise<void> => {
  console.log('🔴 [clientesService] excluirCliente chamado');
  console.log('🔴 [clientesService] ID:', id);
  
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('🔴 [clientesService] Erro ao excluir cliente:', error);
    console.error('🔴 [clientesService] Erro detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
  
  console.log('✅ [clientesService] Cliente excluído com sucesso');
};

/**
 * Buscar cliente por CPF
 */
export const buscarClientePorCPF = async (cpf: string): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cpf', cpf)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    console.error('Erro ao buscar cliente por CPF:', error);
    throw new Error(error.message);
  }

  return data || null;
};

/**
 * Buscar clientes por nome (pesquisa parcial)
 */
export const buscarClientesPorNome = async (nome: string): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .ilike('nome_completo', `%${nome}%`)
    .order('nome_completo', { ascending: true });

  if (error) {
    console.error('Erro ao buscar clientes por nome:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Upload de imagem para um cliente
 * @param clienteId - ID do cliente
 * @param uri - URI da imagem (pode ser file://, http://, ou base64)
 * @param fileName - Nome do arquivo (opcional, será gerado automaticamente se não fornecido)
 * @returns URL pública da imagem
 */
export const uploadImagemCliente = async (
  clienteId: string,
  uri: string,
  fileName?: string
): Promise<string> => {
  try {
    console.log('🔵 [clientesService] Upload de imagem iniciado');
    console.log('🔵 [clientesService] Cliente ID:', clienteId);
    console.log('🔵 [clientesService] URI recebida:', uri.substring(0, 100) + '...');

    // Determina a extensão do arquivo
    let fileExt = 'jpg'; // Default
    
    if (uri.startsWith('data:')) {
      // Extrai o tipo MIME do data URI
      const mimeMatch = uri.match(/data:([^;]+);/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1]; // ex: image/jpeg, image/png
        fileExt = mimeType.split('/')[1]; // jpeg, png, etc
        console.log('🔵 [clientesService] Tipo MIME detectado:', mimeType);
      }
    } else if (fileName) {
      fileExt = fileName.split('.').pop() || 'jpg';
    } else {
      // Tenta extrair da URI (file://)
      const uriWithoutQuery = uri.split('?')[0];
      const lastDot = uriWithoutQuery.lastIndexOf('.');
      if (lastDot > -1) {
        fileExt = uriWithoutQuery.substring(lastDot + 1);
      }
    }

    // Gera nome único para o arquivo
    const timestamp = new Date().getTime();
    const filePath = `clientes/${clienteId}/${timestamp}.${fileExt}`;

    console.log('🔵 [clientesService] Extensão do arquivo:', fileExt);
    console.log('🔵 [clientesService] Caminho do arquivo:', filePath);

    // Converte a URI para ArrayBuffer compatível com React Native
    let arrayBuffer: ArrayBuffer;
    let contentType = `image/${fileExt}`;
    
    if (uri.startsWith('data:')) {
      // Base64
      console.log('🔵 [clientesService] Processando imagem Base64...');
      const mimeMatch = uri.match(/data:([^;]+);/);
      if (mimeMatch) {
        contentType = mimeMatch[1];
      }
      
      const base64Data = uri.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      arrayBuffer = bytes.buffer;
      console.log('🔵 [clientesService] Base64 convertido, tamanho:', arrayBuffer.byteLength);
    } else {
      // Fetch da URI local (file://)
      console.log('🔵 [clientesService] Fazendo fetch da URI local...');
      try {
        const response = await fetch(uri);
        console.log('🔵 [clientesService] Fetch status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        
        arrayBuffer = await response.arrayBuffer();
        console.log('🔵 [clientesService] ArrayBuffer size:', arrayBuffer.byteLength);
      } catch (fetchError: any) {
        console.error('🔴 [clientesService] Erro no fetch:', fetchError);
        throw new Error(`Erro ao ler arquivo: ${fetchError.message}`);
      }
    }

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Arquivo vazio ou inválido');
    }

    console.log('🔵 [clientesService] Enviando arquivo para storage...');
    console.log('🔵 [clientesService] Tamanho do arquivo:', arrayBuffer.byteLength, 'bytes');
    console.log('🔵 [clientesService] Content-Type:', contentType);

    // Upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('clientes-images')
      .upload(filePath, arrayBuffer, {
        contentType: contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('🔴 [clientesService] Erro no upload:', uploadError);
      throw new Error(uploadError.message || 'Erro desconhecido no upload');
    }

    console.log('✅ [clientesService] Upload concluído:', uploadData?.path);

    // Obtém a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from('clientes-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;
    console.log('🔵 [clientesService] URL pública:', imageUrl);

    // Atualiza o cliente com a URL da imagem
    console.log('🔵 [clientesService] Atualizando registro no banco...');

    const { error: updateError } = await supabase
      .from('clientes')
      .update({ imagem_url: imageUrl })
      .eq('id', clienteId);

    if (updateError) {
      console.error('🔴 [clientesService] Erro ao atualizar cliente:', updateError);
      throw new Error(updateError.message);
    }

    console.log('✅ [clientesService] Cliente atualizado com URL da imagem');
    return imageUrl;
  } catch (error: any) {
    console.error('🔴 [clientesService] Erro geral no upload:', error);
    throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
  }
};

/**
 * Remove a imagem de um cliente
 * @param clienteId - ID do cliente
 */
export const removerImagemCliente = async (clienteId: string): Promise<void> => {
  try {
    console.log('🔴 [clientesService] Removendo imagem do cliente:', clienteId);

    // Busca o cliente para obter a URL da imagem
    const cliente = await buscarClientePorId(clienteId);
    
    if (!cliente?.imagem_url) {
      console.log('⚠️ [clientesService] Cliente não possui imagem');
      return;
    }

    // Extrai o caminho do arquivo da URL
    const url = new URL(cliente.imagem_url);
    const filePath = url.pathname.split('/').slice(-3).join('/'); // clientes/{id}/{timestamp}.jpg

    console.log('🔴 [clientesService] Removendo arquivo:', filePath);

    // Remove do storage
    const { error: deleteError } = await supabase.storage
      .from('clientes-images')
      .remove([filePath]);

    if (deleteError) {
      console.error('🔴 [clientesService] Erro ao remover arquivo:', deleteError);
      // Continua mesmo com erro, pois o importante é limpar o banco
    }

    // Atualiza o cliente removendo a URL
    const { error: updateError } = await supabase
      .from('clientes')
      .update({ imagem_url: null })
      .eq('id', clienteId);

    if (updateError) {
      console.error('🔴 [clientesService] Erro ao atualizar cliente:', updateError);
      throw new Error(updateError.message);
    }

    console.log('✅ [clientesService] Imagem removida com sucesso');
  } catch (error: any) {
    console.error('🔴 [clientesService] Erro ao remover imagem:', error);
    throw new Error(`Erro ao remover imagem: ${error.message}`);
  }
};
