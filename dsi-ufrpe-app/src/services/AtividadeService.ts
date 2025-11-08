import { supabase } from '@/lib/supabase';
import { Atividade, AtividadeFormData } from '../types/atividade';

/**
 * Service para gerenciar operações de Atividades com Supabase
 */
export class AtividadeService {
    private static tableName = 'atividades';

    // 🧪 MODO MOCK - Mudar para false quando tiver banco configurado
    private static useMockData = true;

    // Dados mockados para teste
    private static mockAtividades: Atividade[] = [
        {
            id: '1',
            nome: 'Yoga na Praia',
            descricao: 'Aula de yoga relaxante ao ar livre com vista para o mar',
            data_atividade: '2025-11-20',
            horario: '18:00',
            local: 'Praia da Boa Viagem',
            ativa: true,
            created_at: '2025-11-01T10:00:00Z',
            updated_at: '2025-11-01T10:00:00Z'
        },
        {
            id: '2',
            nome: 'Aula de Dança',
            descricao: 'Aprenda passos de forró e samba',
            data_atividade: '2025-11-22',
            horario: '20:00',
            local: 'Salão de Festas',
            ativa: true,
            created_at: '2025-11-02T10:00:00Z',
            updated_at: '2025-11-02T10:00:00Z'
        },
        {
            id: '3',
            nome: 'Caminhada Ecológica',
            descricao: '',
            data_atividade: '2025-11-25',
            horario: '07:00',
            local: '',
            ativa: false,
            created_at: '2025-11-03T10:00:00Z',
            updated_at: '2025-11-03T10:00:00Z'
        }
    ];

    /**
     * Busca uma atividade por ID
     */
    static async getById(id: string): Promise<Atividade | null> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Buscando atividade ID:', id);
            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));

            const atividade = this.mockAtividades.find(a => a.id === id);
            console.log('🧪 [MOCK] Atividade encontrada:', atividade);
            return atividade || null;
        }

        // Modo real com Supabase
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Erro ao buscar atividade:', error);
                return null;
            }

            return data as Atividade;
        } catch (error) {
            console.error('Erro ao buscar atividade:', error);
            return null;
        }
    }

    /**
     * Lista todas as atividades
     */
    static async getAll(): Promise<Atividade[]> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Listando todas as atividades');
            await new Promise(resolve => setTimeout(resolve, 800));
            return [...this.mockAtividades];
        }

        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('data_atividade', { ascending: false });

            if (error) {
                console.error('Erro ao listar atividades:', error);
                return [];
            }

            return data as Atividade[];
        } catch (error) {
            console.error('Erro ao listar atividades:', error);
            return [];
        }
    }

    /**
     * Cria uma nova atividade
     */
    static async create(atividade: AtividadeFormData): Promise<Atividade | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert([atividade])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar atividade:', error);
                return null;
            }

            return data as Atividade;
        } catch (error) {
            console.error('Erro ao criar atividade:', error);
            return null;
        }
    }

    /**
     * Atualiza uma atividade existente
     */
    static async update(id: string, atividade: Partial<AtividadeFormData>): Promise<Atividade | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .update(atividade)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar atividade:', error);
                return null;
            }

            return data as Atividade;
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            return null;
        }
    }

    /**
     * Exclui uma atividade
     */
    static async delete(id: string): Promise<boolean> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Excluindo atividade ID:', id);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = this.mockAtividades.findIndex(a => a.id === id);
            if (index !== -1) {
                this.mockAtividades.splice(index, 1);
                console.log('🧪 [MOCK] Atividade excluída com sucesso');
                return true;
            }
            return false;
        }

        try {
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Erro ao excluir atividade:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
            return false;
        }
    }
}
