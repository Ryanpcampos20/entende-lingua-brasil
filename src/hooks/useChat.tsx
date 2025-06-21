
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from './useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at?: string;
  sender_name?: string;
}

interface Conversation {
  user_id: string;
  user_name: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all messages where user is sender or receiver
      const { data: messageData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(nome_responsavel),
          receiver:profiles!messages_receiver_id_fkey(nome_responsavel)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      messageData?.forEach((message: any) => {
        const isFromUser = message.sender_id === user.id;
        const partnerId = isFromUser ? message.receiver_id : message.sender_id;
        const partnerName = isFromUser ? 
          message.receiver?.nome_responsavel : 
          message.sender?.nome_responsavel;

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            user_id: partnerId,
            user_name: partnerName || 'Usuário Desconhecido',
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0
          });
        }

        // Count unread messages (messages sent to current user that haven't been read)
        if (!isFromUser && !message.read_at) {
          const conversation = conversationMap.get(partnerId)!;
          conversation.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async (partnerId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(nome_responsavel)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = data?.map((message: any) => ({
        ...message,
        sender_name: message.sender?.nome_responsavel
      })) || [];

      setMessages(formattedMessages);

      // Mark messages as read
      await markMessagesAsRead(partnerId);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!"
      });

      // Refresh conversations and messages
      fetchConversations();
      fetchMessages(receiverId);
      return true;
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user.id)
        .is('read_at', null);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    messages,
    conversations,
    loading,
    fetchMessages,
    sendMessage,
    fetchConversations
  };
};
