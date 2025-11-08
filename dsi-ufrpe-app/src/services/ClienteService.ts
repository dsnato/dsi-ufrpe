import { supabase } from '@/lib/supabase';
import clientesData from '../data/clientes.json';
import { Cliente, ClienteFormData } from '../types/cliente';

/**
 * Service para gerenciar operações de Clientes
 */
export class ClienteService {
    private static tableName = 'clientes';

    // 🧪 MODO MOCK - Mudar para false quando tiver banco configurado
    private static useMockData = true;

    // Carrega dados do JSON
    private static mockClientes: Cliente[] = clientesData as Cliente[];

    /**
     * Busca um cliente por ID
     */
    static async getById(id: string): Promise<Cliente | null> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Buscando cliente ID:', id);
            // Simula delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000));

            const cliente = this.mockClientes.find(c => c.id === id);
            console.log('🧪 [MOCK] Cliente encontrado:', cliente);
            return cliente || null;
        }

        // Modo real com Supabase
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Erro ao buscar cliente:', error);
                return null;
            }

            return data as Cliente;
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return null;
        }
    }

    /**
     * Lista todos os clientes
     */
    static async getAll(): Promise<Cliente[]> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Listando todos os clientes');
            await new Promise(resolve => setTimeout(resolve, 800));
            return [...this.mockClientes];
        }

        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('name', { ascending: true });

            if (error) {
                console.error('Erro ao listar clientes:', error);
                return [];
            }

            return data as Cliente[];
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            return [];
        }
    }

    /**
     * Cria um novo cliente
     */
    static async create(cliente: ClienteFormData): Promise<Cliente | null> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Criando cliente');
            await new Promise(resolve => setTimeout(resolve, 500));

            const novoCliente: Cliente = {
                id: String(this.mockClientes.length + 1),
                ...cliente,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            this.mockClientes.push(novoCliente);
            return novoCliente;
        }

        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .insert([cliente])
                .select()
                .single();

            if (error) {
                console.error('Erro ao criar cliente:', error);
                return null;
            }

            return data as Cliente;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            return null;
        }
    }

    /**
     * Atualiza um cliente existente
     */
    static async update(id: string, cliente: Partial<ClienteFormData>): Promise<Cliente | null> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Atualizando cliente ID:', id);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = this.mockClientes.findIndex(c => c.id === id);
            if (index !== -1) {
                this.mockClientes[index] = {
                    ...this.mockClientes[index],
                    ...cliente,
                    updated_at: new Date().toISOString()
                };
                return this.mockClientes[index];
            }
            return null;
        }

        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .update(cliente)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Erro ao atualizar cliente:', error);
                return null;
            }

            return data as Cliente;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            return null;
        }
    }

    /**
     * Exclui um cliente
     */
    static async delete(id: string): Promise<boolean> {
        // 🧪 Modo Mock para testes
        if (this.useMockData) {
            console.log('🧪 [MOCK] Excluindo cliente ID:', id);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = this.mockClientes.findIndex(c => c.id === id);
            if (index !== -1) {
                this.mockClientes.splice(index, 1);
                console.log('🧪 [MOCK] Cliente excluído com sucesso');
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
                console.error('Erro ao excluir cliente:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            return false;
        }
    }
}
