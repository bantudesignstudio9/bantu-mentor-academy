export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alunos: {
        Row: {
          created_at: string
          curso_id: string | null
          data_inscricao: string
          estado: string
          id: string
          nivel: string | null
          nome: string
          observacoes: string | null
          owner_id: string | null
          polo: string
          programa_id: string | null
          propina: number
          telefone: string | null
          turma: string | null
          updated_at: string
          valor_pago: number
        }
        Insert: {
          created_at?: string
          curso_id?: string | null
          data_inscricao?: string
          estado?: string
          id?: string
          nivel?: string | null
          nome: string
          observacoes?: string | null
          owner_id?: string | null
          polo?: string
          programa_id?: string | null
          propina?: number
          telefone?: string | null
          turma?: string | null
          updated_at?: string
          valor_pago?: number
        }
        Update: {
          created_at?: string
          curso_id?: string | null
          data_inscricao?: string
          estado?: string
          id?: string
          nivel?: string | null
          nome?: string
          observacoes?: string | null
          owner_id?: string | null
          polo?: string
          programa_id?: string | null
          propina?: number
          telefone?: string | null
          turma?: string | null
          updated_at?: string
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "alunos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alunos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          activo: boolean
          categoria: string
          created_at: string
          data_inicio: string | null
          data_termino: string | null
          disciplina: string | null
          id: string
          nome: string
          owner_id: string | null
          polo: string
          salario_bruto: number
          telefone: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria?: string
          created_at?: string
          data_inicio?: string | null
          data_termino?: string | null
          disciplina?: string | null
          id?: string
          nome: string
          owner_id?: string | null
          polo?: string
          salario_bruto?: number
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          created_at?: string
          data_inicio?: string | null
          data_termino?: string | null
          disciplina?: string | null
          id?: string
          nome?: string
          owner_id?: string | null
          polo?: string
          salario_bruto?: number
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cursos: {
        Row: {
          activo: boolean
          created_at: string
          id: string
          nivel: string | null
          nome: string
          ordem: number
          owner_id: string | null
          programa_id: string
          propina_padrao: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          id?: string
          nivel?: string | null
          nome: string
          ordem?: number
          owner_id?: string | null
          programa_id: string
          propina_padrao?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          id?: string
          nivel?: string | null
          nome?: string
          ordem?: number
          owner_id?: string | null
          programa_id?: string
          propina_padrao?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_programa_id_fkey"
            columns: ["programa_id"]
            isOneToOne: false
            referencedRelation: "programas"
            referencedColumns: ["id"]
          },
        ]
      }
      financas: {
        Row: {
          categoria: string
          created_at: string
          data: string
          descricao: string | null
          id: string
          owner_id: string | null
          tipo: string
          valor: number
        }
        Insert: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          owner_id?: string | null
          tipo?: string
          valor?: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          owner_id?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          bruto: number
          colaborador_id: string
          created_at: string
          data_pagamento: string | null
          descontos: number
          id: string
          liquido: number
          mes_referencia: string
          owner_id: string | null
          pago: boolean
        }
        Insert: {
          bruto?: number
          colaborador_id: string
          created_at?: string
          data_pagamento?: string | null
          descontos?: number
          id?: string
          liquido?: number
          mes_referencia: string
          owner_id?: string | null
          pago?: boolean
        }
        Update: {
          bruto?: number
          colaborador_id?: string
          created_at?: string
          data_pagamento?: string | null
          descontos?: number
          id?: string
          liquido?: number
          mes_referencia?: string
          owner_id?: string | null
          pago?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      presencas: {
        Row: {
          colaborador_id: string
          created_at: string
          data: string
          estado: string
          id: string
          observacao: string | null
          owner_id: string | null
        }
        Insert: {
          colaborador_id: string
          created_at?: string
          data: string
          estado?: string
          id?: string
          observacao?: string | null
          owner_id?: string | null
        }
        Update: {
          colaborador_id?: string
          created_at?: string
          data?: string
          estado?: string
          id?: string
          observacao?: string | null
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "presencas_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
        ]
      }
      programas: {
        Row: {
          activo: boolean
          cor: string
          created_at: string
          descricao: string | null
          id: string
          nome: string
          ordem: number
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          cor?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem?: number
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          cor?: string
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
