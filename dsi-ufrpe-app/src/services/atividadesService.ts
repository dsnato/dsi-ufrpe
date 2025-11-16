import { supabase } from '../../lib/supabase';
import { 
  validarStringObrigatoria, 
  validarNumero,
  validarInteiro,
  ValidationError
} from '../utils/validators';

export interface AtividadeRecreativa {
  id?: string;
  nome: string;
  descricao?: string;
  data_hora: string;
  local?: string;
  capacidade_maxima?: number;
  preco?: number;
  status?: string;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Buscar todas as atividades
 */
export const listarAtividades = async (): Promise<AtividadeRecreativa[]> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao listar atividades:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar atividade por ID
 */
export const buscarAtividadePorId = async (id: string): Promise<AtividadeRecreativa | null> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Criar nova atividade
 */
export const criarAtividade = async (atividade: Omit<AtividadeRecreativa, 'id' | 'created_at' | 'updated_at'>): Promise<AtividadeRecreativa> => {
  console.log('🟢 [atividadesService] criarAtividade chamado');
  console.log('🟢 [atividadesService] Dados recebidos:', JSON.stringify(atividade, null, 2));
  
  try {
    // Validações
    console.log('🔍 [atividadesService] Iniciando validações...');
    
    validarStringObrigatoria(atividade.nome, 'Nome da atividade');
    validarStringObrigatoria(atividade.data_hora, 'Data e hora');
    
    if (atividade.capacidade_maxima !== undefined) {
      validarInteiro(atividade.capacidade_maxima, 'Capacidade máxima', 1, 1000);
    }
    
    if (atividade.preco !== undefined) {
      validarNumero(atividade.preco, 'Preço', 0);
    }
    
    console.log('✅ [atividadesService] Validações concluídas com sucesso');
    
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('🔴 [atividadesService] Erro de validação:', error.message);
      throw error;
    }
    throw error;
  }
  
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .insert([{
      ...atividade,
      status: atividade.status || 'Agendada',
      preco: atividade.preco || 0
    }])
    .select()
    .single();

  if (error) {
    console.error('🔴 [atividadesService] Erro Supabase:', error);
    throw new Error(error.message);
  }

  console.log('✅ [atividadesService] Atividade criada:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * Atualizar atividade existente
 */
export const atualizarAtividade = async (id: string, atividade: Partial<AtividadeRecreativa>): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update(atividade)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Excluir atividade
 */
/**
 * Excluir atividade
 */
export const excluirAtividade = async (id: string): Promise<void> => {
  console.log('🔴 [atividadesService] excluirAtividade chamado');
  console.log('🔴 [atividadesService] ID:', id);
  
  const { error } = await supabase
    .from('atividades_recreativas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('🔴 [atividadesService] Erro ao excluir atividade:', error);
    console.error('🔴 [atividadesService] Erro detalhes:', JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }
  
  console.log('✅ [atividadesService] Atividade excluída com sucesso');
};

/**
 * Buscar atividades agendadas (futuras)
 */
export const listarAtividadesAgendadas = async (): Promise<AtividadeRecreativa[]> => {
  const agora = new Date().toISOString();

  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .eq('status', 'Agendada')
    .gte('data_hora', agora)
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao listar atividades agendadas:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Buscar atividades por período
 */
export const buscarAtividadesPorPeriodo = async (
  dataInicio: string,
  dataFim: string
): Promise<AtividadeRecreativa[]> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .select('*')
    .gte('data_hora', dataInicio)
    .lte('data_hora', dataFim)
    .order('data_hora', { ascending: true });

  if (error) {
    console.error('Erro ao buscar atividades por período:', error);
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Cancelar atividade
 */
export const cancelarAtividade = async (id: string): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update({ status: 'Cancelada' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao cancelar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Finalizar atividade
 */
export const finalizarAtividade = async (id: string): Promise<AtividadeRecreativa> => {
  const { data, error } = await supabase
    .from('atividades_recreativas')
    .update({ status: 'Realizada' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao finalizar atividade:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Upload de imagem para uma atividade
 * @param atividadeId - ID da atividade
 * @param uri - URI da imagem (pode ser file://, http://, ou base64)
 * @param fileName - Nome do arquivo (opcional, será gerado automaticamente se não fornecido)
 * @returns URL pública da imagem
 */
export const uploadImagemAtividade = async (
  atividadeId: string,
  uri: string,
  fileName?: string
): Promise<string> => {
  try {
    console.log('🔵 [atividadesService] Upload de imagem iniciado');
    console.log('🔵 [atividadesService] Atividade ID:', atividadeId);
    console.log('🔵 [atividadesService] URI:', uri);

    // Gera nome único para o arquivo
    const timestamp = new Date().getTime();
    const fileExt = fileName?.split('.').pop() || 'jpg';
    const filePath = `atividades/${atividadeId}/${timestamp}.${fileExt}`;

    // Converte a URI para formato compatível com Supabase
    let fileData: Blob | ArrayBuffer;
    
    if (uri.startsWith('data:')) {
      // Base64
      const base64Data = uri.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      fileData = bytes.buffer;
    } else {
      // Fetch da URI (funciona para file:// e http://)
      const response = await fetch(uri);
      const blob = await response.blob();
      fileData = blob;
    }

    console.log('🔵 [atividadesService] Enviando arquivo para storage...');

    // Upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('atividades-images')
      .upload(filePath, fileData, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('🔴 [atividadesService] Erro no upload:', uploadError);
      throw new Error(uploadError.message);
    }

    console.log('✅ [atividadesService] Upload concluído:', uploadData.path);

    // Obtém a URL pública da imagem
    const { data: publicUrlData } = supabase.storage
      .from('atividades-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;
    console.log('🔵 [atividadesService] URL pública:', imageUrl);

    // Atualiza a atividade com a URL da imagem
    console.log('🔵 [atividadesService] Atualizando registro no banco...');
    console.log('🔵 [atividadesService] Dados do update:', { 
      tabela: 'atividades_recreativas',
      id: atividadeId, 
      imagem_url: imageUrl 
    });

    const { data: updateData, error: updateError } = await supabase
      .from('atividades_recreativas')
      .update({ imagem_url: imageUrl })
      .eq('id', atividadeId)
      .select();

    if (updateError) {
      console.error('🔴 [atividadesService] Erro ao atualizar atividade:', updateError);
      throw new Error(updateError.message);
    }

    console.log('✅ [atividadesService] Atividade atualizada com URL da imagem');
    console.log('✅ [atividadesService] Dados atualizados:', updateData);
    return imageUrl;
  } catch (error: any) {
    console.error('🔴 [atividadesService] Erro geral no upload:', error);
    throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
  }
};

/**
 * Remove a imagem de uma atividade
 * @param atividadeId - ID da atividade
 */
export const removerImagemAtividade = async (atividadeId: string): Promise<void> => {
  try {
    console.log('🔴 [atividadesService] Removendo imagem da atividade:', atividadeId);

    // Busca a atividade para obter a URL da imagem
    const atividade = await buscarAtividadePorId(atividadeId);
    
    if (!atividade?.imagem_url) {
      console.log('⚠️ [atividadesService] Atividade não possui imagem');
      return;
    }

    // Extrai o caminho do arquivo da URL
    const url = new URL(atividade.imagem_url);
    const filePath = url.pathname.split('/').slice(-3).join('/'); // atividades/{id}/{timestamp}.jpg

    console.log('🔴 [atividadesService] Removendo arquivo:', filePath);

    // Remove do storage
    const { error: deleteError } = await supabase.storage
      .from('atividades-images')
      .remove([filePath]);

    if (deleteError) {
      console.error('🔴 [atividadesService] Erro ao remover arquivo:', deleteError);
      // Continua mesmo com erro, pois o importante é limpar o banco
    }

    // Atualiza a atividade removendo a URL
    const { error: updateError } = await supabase
      .from('atividades_recreativas')
      .update({ imagem_url: null })
      .eq('id', atividadeId);

    if (updateError) {
      console.error('🔴 [atividadesService] Erro ao atualizar atividade:', updateError);
      throw new Error(updateError.message);
    }

    console.log('✅ [atividadesService] Imagem removida com sucesso');
  } catch (error: any) {
    console.error('🔴 [atividadesService] Erro ao remover imagem:', error);
    throw new Error(`Erro ao remover imagem: ${error.message}`);
  }
};
