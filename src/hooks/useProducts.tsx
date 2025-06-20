
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeAndValidateText } from '@/utils/inputSanitization';

interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco?: number;
  categoria?: string;
  disponivel: boolean;
  created_at: string;
  user_id: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para adicionar produtos",
        variant: "destructive"
      });
      return false;
    }

    // Validar e sanitizar dados
    const nomeValidation = sanitizeAndValidateText(productData.nome, 100);
    if (!nomeValidation.isValid) {
      toast({
        title: "Erro de validação",
        description: nomeValidation.error || "Nome do produto inválido",
        variant: "destructive"
      });
      return false;
    }

    const descricaoValidation = productData.descricao 
      ? sanitizeAndValidateText(productData.descricao, 500)
      : { isValid: true, sanitized: '' };
    
    if (!descricaoValidation.isValid) {
      toast({
        title: "Erro de validação",
        description: descricaoValidation.error || "Descrição inválida",
        variant: "destructive"
      });
      return false;
    }

    try {
      const sanitizedData = {
        nome: nomeValidation.sanitized,
        descricao: descricaoValidation.sanitized || null,
        preco: productData.preco || null,
        categoria: productData.categoria || null,
        disponivel: true,
        user_id: user.id
      };

      const { error } = await supabase
        .from('products')
        .insert([sanitizedData]);

      if (error) throw error;
      
      toast({
        title: "Produto adicionado com sucesso!"
      });
      
      fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'user_id'>>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Produto atualizado com sucesso!"
      });
      
      fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Produto removido com sucesso!"
      });
      
      fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao remover produto",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  };
};
