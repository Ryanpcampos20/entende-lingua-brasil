
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface Quote {
  id: string;
  titulo: string;
  descricao: string;
  setor: string;
  orcamento?: string;
  prazo?: string;
  status: string | null;
  created_at: string;
  solicitante_id: string;
}

interface QuoteResponse {
  id: string;
  quote_id: string;
  fornecedor_id: string;
  proposta: string;
  valor?: string;
  prazo_entrega?: string;
  created_at: string;
}

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [myQuotes, setMyQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchAllQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('status', 'aberta')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar cotações",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyQuotes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('solicitante_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyQuotes(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar suas cotações",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'created_at' | 'solicitante_id' | 'status'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('quotes')
        .insert([{
          ...quoteData,
          solicitante_id: user.id,
          status: 'aberta'
        }]);

      if (error) throw error;
      
      toast({
        title: "Cotação criada com sucesso!"
      });
      
      fetchMyQuotes();
      fetchAllQuotes();
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao criar cotação",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const respondToQuote = async (quoteId: string, responseData: {
    proposta: string;
    valor?: string;
    prazo_entrega?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('quote_responses')
        .insert([{
          quote_id: quoteId,
          fornecedor_id: user.id,
          ...responseData
        }]);

      if (error) throw error;
      
      toast({
        title: "Proposta enviada com sucesso!"
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao enviar proposta",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const getQuoteResponses = async (quoteId: string) => {
    try {
      const { data, error } = await supabase
        .from('quote_responses')
        .select(`
          *,
          profiles:fornecedor_id(nome_empresa, nome_responsavel, email)
        `)
        .eq('quote_id', quoteId);

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      toast({
        title: "Erro ao carregar propostas",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  };

  useEffect(() => {
    fetchAllQuotes();
    if (user) {
      fetchMyQuotes();
    }
  }, [user]);

  return {
    quotes,
    myQuotes,
    loading,
    createQuote,
    respondToQuote,
    getQuoteResponses,
    refetchAll: fetchAllQuotes,
    refetchMy: fetchMyQuotes
  };
};
