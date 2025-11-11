import { supabase } from '@/lib/supabase';
import { Quarto, QuartoFormData } from '../types/quarto';

/**
 * 🧪 MODO DE TESTE
 * Defina como TRUE para usar dados mock sem banco
 * Defina como FALSE para usar Supabase
 */
const useMockData = true;

/**
 * 📦 Dados Mock para Desenvolvimento
 */
const mockQuartos: Quarto[] = [
    {
        id: '1',
        numero: '110',
        tipo: 'Solteiro',
        capacidade: 2,
        preco: 150.00,
        disponivel: true,
        descricao: 'Quarto confortável com vista para o jardim',
        created_at: '2024-01-10T08:00:00Z',
        updated_at: '2024-01-10T08:00:00Z',
    },
    {
        id: '2',
        numero: '205',
        tipo: 'Casal',
        capacidade: 2,
        preco: 250.00,
        disponivel: true,
        descricao: 'Quarto espaçoso com cama king size',
        created_at: '2024-01-11T09:30:00Z',
        updated_at: '2024-01-11T09:30:00Z',
    },
    {
        id: '3',
        numero: '301',
        tipo: 'Suíte',
        capacidade: 4,
        preco: 450.00,
        disponivel: false,
        descricao: '', // Teste sem descrição
        created_at: '2024-01-12T11:00:00Z',
        updated_at: '2024-01-12T11:00:00Z',
    },
];

export class QuartoService {
    /**
     * Busca um quarto por ID
     */
    static async getById(id: string): Promise<Quarto | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] QuartoService.getById:', id);
            await new Promise(resolve => setTimeout(resolve, 700));

            const quarto = mockQuartos.find(q => q.id === id);
            return quarto || null;
        }

        try {
            const { data, error } = await supabase
                .from('quartos')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar quarto:', error);
            return null;
        }
    }

    /**
     * Busca todos os quartos
     */
    static async getAll(): Promise<Quarto[]> {
        if (useMockData) {
            console.log('🧪 [MOCK] QuartoService.getAll');
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockQuartos;
        }

        try {
            const { data, error } = await supabase
                .from('quartos')
                .select('*')
                .order('numero', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar quartos:', error);
            return [];
        }
    }

    /**
     * Cria um novo quarto
     */
    static async create(quarto: QuartoFormData): Promise<Quarto | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] QuartoService.create:', quarto);
            await new Promise(resolve => setTimeout(resolve, 500));

            const newQuarto: Quarto = {
                id: String(mockQuartos.length + 1),
                ...quarto,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            mockQuartos.push(newQuarto);
            return newQuarto;
        }

        try {
            const { data, error } = await supabase
                .from('quartos')
                .insert([quarto])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao criar quarto:', error);
            return null;
        }
    }

    /**
     * Atualiza um quarto existente
     */
    static async update(id: string, quarto: Partial<QuartoFormData>): Promise<Quarto | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] QuartoService.update:', id, quarto);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = mockQuartos.findIndex(q => q.id === id);
            if (index !== -1) {
                mockQuartos[index] = {
                    ...mockQuartos[index],
                    ...quarto,
                    updated_at: new Date().toISOString(),
                };
                return mockQuartos[index];
            }
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('quartos')
                .update(quarto)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar quarto:', error);
            return null;
        }
    }

    /**
     * Exclui um quarto
     */
    static async delete(id: string): Promise<boolean> {
        if (useMockData) {
            console.log('🧪 [MOCK] QuartoService.delete:', id);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = mockQuartos.findIndex(q => q.id === id);
            if (index !== -1) {
                mockQuartos.splice(index, 1);
                return true;
            }
            return false;
        }

        try {
            const { error } = await supabase
                .from('quartos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao excluir quarto:', error);
            return false;
        }
    }
}
