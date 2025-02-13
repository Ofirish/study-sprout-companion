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
      assignment_attachments: {
        Row: {
          assignment_id: string | null
          content_type: string | null
          created_at: string | null
          file_name: string
          file_path: string
          id: string
          size: number | null
          updated_at: string | null
        }
        Insert: {
          assignment_id?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name: string
          file_path: string
          id?: string
          size?: number | null
          updated_at?: string | null
        }
        Update: {
          assignment_id?: string | null
          content_type?: string | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          size?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_attachments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          archived: boolean | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          status: string
          subject: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          status?: string
          subject: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          status?: string
          subject?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      custom_subjects: {
        Row: {
          created_at: string | null
          id: string
          name_en: string
          name_he: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name_en: string
          name_he: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name_en?: string
          name_he?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_translations: {
        Row: {
          created_at: string | null
          en: string
          he: string
          id: string
          translation_key: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          en: string
          he: string
          id?: string
          translation_key: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          en?: string
          he?: string
          id?: string
          translation_key?: string
          user_id?: string
        }
        Relationships: []
      }
      parent_student_relationships: {
        Row: {
          created_at: string | null
          id: string
          parent_id: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          parent_id: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_student_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_student_relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_relationships: {
        Row: {
          created_at: string | null
          id: string
          related_user_id: string
          relationship_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          related_user_id: string
          relationship_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          related_user_id?: string
          relationship_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_relationships_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_relationships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
