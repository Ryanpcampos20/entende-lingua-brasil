export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          area_atuacao: string
          cnpj: string
          data_cadastro: string | null
          descricao: string | null
          email: string
          id: string
          nome_empresa: string
          nome_responsavel: string
          parcerias_desejadas: string
          regiao: string
          telefone: string | null
          tipo_estabelecimento: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          area_atuacao: string
          cnpj: string
          data_cadastro?: string | null
          descricao?: string | null
          email: string
          id?: string
          nome_empresa: string
          nome_responsavel: string
          parcerias_desejadas: string
          regiao: string
          telefone?: string | null
          tipo_estabelecimento: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          area_atuacao?: string
          cnpj?: string
          data_cadastro?: string | null
          descricao?: string | null
          email?: string
          id?: string
          nome_empresa?: string
          nome_responsavel?: string
          parcerias_desejadas?: string
          regiao?: string
          telefone?: string | null
          tipo_estabelecimento?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          motivo: string | null
          score: number
          status: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          score: number
          status?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          score?: number
          status?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          disponivel: boolean | null
          id: string
          nome: string
          preco: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          nome: string
          preco?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          disponivel?: boolean | null
          id?: string
          nome?: string
          preco?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          area_atuacao: string
          cnpj: string
          data_cadastro: string | null
          descricao: string | null
          email: string
          id: string
          nome_empresa: string
          nome_responsavel: string
          parcerias_desejadas: string
          regiao: string
          telefone: string | null
          tipo_estabelecimento: string
          updated_at: string | null
        }
        Insert: {
          area_atuacao: string
          cnpj: string
          data_cadastro?: string | null
          descricao?: string | null
          email: string
          id: string
          nome_empresa: string
          nome_responsavel: string
          parcerias_desejadas: string
          regiao: string
          telefone?: string | null
          tipo_estabelecimento: string
          updated_at?: string | null
        }
        Update: {
          area_atuacao?: string
          cnpj?: string
          data_cadastro?: string | null
          descricao?: string | null
          email?: string
          id?: string
          nome_empresa?: string
          nome_responsavel?: string
          parcerias_desejadas?: string
          regiao?: string
          telefone?: string | null
          tipo_estabelecimento?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_responses: {
        Row: {
          created_at: string | null
          fornecedor_id: string
          id: string
          prazo_entrega: string | null
          proposta: string
          quote_id: string
          valor: string | null
        }
        Insert: {
          created_at?: string | null
          fornecedor_id: string
          id?: string
          prazo_entrega?: string | null
          proposta: string
          quote_id: string
          valor?: string | null
        }
        Update: {
          created_at?: string | null
          fornecedor_id?: string
          id?: string
          prazo_entrega?: string | null
          proposta?: string
          quote_id?: string
          valor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_responses_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string | null
          descricao: string
          id: string
          orcamento: string | null
          prazo: string | null
          setor: string
          solicitante_id: string
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: string
          orcamento?: string | null
          prazo?: string | null
          setor: string
          solicitante_id: string
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: string
          orcamento?: string | null
          prazo?: string | null
          setor?: string
          solicitante_id?: string
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_matches: {
        Args: { user_id: string }
        Returns: {
          match_user_id: string
          score: number
          motivo: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
