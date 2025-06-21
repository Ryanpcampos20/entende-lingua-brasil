
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
  status: string;
  created_at: string;
  solicitante_id: string;
  solicitante?: {
    nome_empresa: string;
    nome_responsavel: string;
  };
}

interface QuoteResponse {
  id: string;
  quote_id: string;
  fornecedor_id: string;
  proposta: string;
  valor?: string;
  prazo_entrega?: string;
  created_at: string;
  fornecedor?: {
    nome_empresa: string;
    nome_responsavel: string;
  };
}

export const useQuotesSecure = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [myQuotes, setMyQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(`
          *,
          solicitante:profiles!quotes_solicitante_id_fkey(nome_empresa, nome_responsavel)
        `)
        .eq('status', 'aberta')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error: any) {
      console.error('Error fetching quotes:', error);
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

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('solicitante_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyQuotes(data || []);
    } catch (error: any) {
      console.error('Error fetching my quotes:', error);
      toast({
        title: "Erro ao carregar suas cotações",
        description: error.message,
        variant: "destructive"
      });
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
        title: "Cotação criada com sucesso!",
        description: "Sua solicitação foi publicada"
      });

      fetchQuotes();
      fetchMyQuotes();
      return true;
    } catch (error: any) {
      console.error('Error creating quote:', error);
      toast({
        title: "Erro ao criar cotação",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const respondToQuote = async (quoteId: string, responseData: Omit<QuoteResponse, 'id' | 'quote_id' | 'fornecedor_id' | 'created_at'>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('quote_responses')
        .insert([{
          ...responseData,
          quote_id: quoteId,
          fornecedor_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Resposta enviada com sucesso!",
        description: "Sua proposta foi enviada ao solicitante"
      });

      return true;
    } catch (error: any) {
      console.error('Error responding to quote:', error);
      toast({
        title: "Erro ao enviar resposta",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchQuotes();
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
    refetch: () => {
      fetchQuotes();
      fetchMyQuotes();
    }
  };
};
