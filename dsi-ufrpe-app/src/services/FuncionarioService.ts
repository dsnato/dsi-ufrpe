import { supabase } from '@/lib/supabase';
import { Funcionario, FuncionarioFormData } from '../types/funcionario';

/**
 * 🧪 MODO DE TESTE
 * Defina como TRUE para usar dados mock sem banco
 * Defina como FALSE para usar Supabase
 */
const useMockData = true;

/**
 * 📦 Dados Mock para Desenvolvimento
 */
const mockFuncionarios: Funcionario[] = [
    {
        id: '1',
        name: 'Ana Clara Silva Santos',
        cpf: '12023156743',
        phone: '81999992193',
        email: 'anasantos@email.com',
        role: 'Recepcionista',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Carlos Eduardo Oliveira',
        cpf: '45678901234',
        phone: '81988887766',
        email: 'carlos.oliveira@email.com',
        role: 'Gerente',
        created_at: '2024-02-20T14:30:00Z',
        updated_at: '2024-02-20T14:30:00Z',
    },
    {
        id: '3',
        name: 'Mariana Costa Lima',
        cpf: '98765432100',
        phone: '81977776655',
        email: '', // Teste com email vazio
        role: 'Camareira',
        created_at: '2024-03-10T09:15:00Z',
        updated_at: '2024-03-10T09:15:00Z',
    },
];

export class FuncionarioService {
    /**
     * Busca um funcionário por ID
     */
    static async getById(id: string): Promise<Funcionario | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] FuncionarioService.getById:', id);
            await new Promise(resolve => setTimeout(resolve, 800));

            const funcionario = mockFuncionarios.find(f => f.id === id);
            return funcionario || null;
        }

        try {
            const { data, error } = await supabase
                .from('funcionarios')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            return null;
        }
    }

    /**
     * Busca todos os funcionários
     */
    static async getAll(): Promise<Funcionario[]> {
        if (useMockData) {
            console.log('🧪 [MOCK] FuncionarioService.getAll');
            await new Promise(resolve => setTimeout(resolve, 600));
            return mockFuncionarios;
        }

        try {
            const { data, error } = await supabase
                .from('funcionarios')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            return [];
        }
    }

    /**
     * Cria um novo funcionário
     */
    static async create(funcionario: FuncionarioFormData): Promise<Funcionario | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] FuncionarioService.create:', funcionario);
            await new Promise(resolve => setTimeout(resolve, 500));

            const newFuncionario: Funcionario = {
                id: String(mockFuncionarios.length + 1),
                ...funcionario,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            mockFuncionarios.push(newFuncionario);
            return newFuncionario;
        }

        try {
            const { data, error } = await supabase
                .from('funcionarios')
                .insert([funcionario])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao criar funcionário:', error);
            return null;
        }
    }

    /**
     * Atualiza um funcionário existente
     */
    static async update(id: string, funcionario: Partial<FuncionarioFormData>): Promise<Funcionario | null> {
        if (useMockData) {
            console.log('🧪 [MOCK] FuncionarioService.update:', id, funcionario);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = mockFuncionarios.findIndex(f => f.id === id);
            if (index !== -1) {
                mockFuncionarios[index] = {
                    ...mockFuncionarios[index],
                    ...funcionario,
                    updated_at: new Date().toISOString(),
                };
                return mockFuncionarios[index];
            }
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('funcionarios')
                .update(funcionario)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            return null;
        }
    }

    /**
     * Exclui um funcionário
     */
    static async delete(id: string): Promise<boolean> {
        if (useMockData) {
            console.log('🧪 [MOCK] FuncionarioService.delete:', id);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = mockFuncionarios.findIndex(f => f.id === id);
            if (index !== -1) {
                mockFuncionarios.splice(index, 1);
                return true;
            }
            return false;
        }

        try {
            const { error } = await supabase
                .from('funcionarios')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            return false;
        }
    }
}
