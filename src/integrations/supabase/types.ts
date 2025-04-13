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
      campaign_data: {
        Row: {
          budget: string | null
          clicks: number
          conversion_type: string | null
          conversions: number
          cpc: string | null
          created_at: string
          ctr: string | null
          id: string
          impressions: number
          name: string
          roas: string | null
          status: string
          total_cost: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: string | null
          clicks?: number
          conversion_type?: string | null
          conversions?: number
          cpc?: string | null
          created_at?: string
          ctr?: string | null
          id?: string
          impressions?: number
          name: string
          roas?: string | null
          status?: string
          total_cost?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: string | null
          clicks?: number
          conversion_type?: string | null
          conversions?: number
          cpc?: string | null
          created_at?: string
          ctr?: string | null
          id?: string
          impressions?: number
          name?: string
          roas?: string | null
          status?: string
          total_cost?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      identified_issues: {
        Row: {
          affected_campaigns: string[]
          created_at: string | null
          description: string
          id: string
          issue: string
          related_to: string
          severity: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          affected_campaigns: string[]
          created_at?: string | null
          description: string
          id?: string
          issue: string
          related_to: string
          severity: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          affected_campaigns?: string[]
          created_at?: string | null
          description?: string
          id?: string
          issue?: string
          related_to?: string
          severity?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      monthly_performance: {
        Row: {
          clicks: number
          conversions: number
          cost: number
          created_at: string
          id: string
          impressions: number
          month: string
          updated_at: string
          user_id: string | null
          year: number
        }
        Insert: {
          clicks?: number
          conversions?: number
          cost?: number
          created_at?: string
          id?: string
          impressions?: number
          month: string
          updated_at?: string
          user_id?: string | null
          year: number
        }
        Update: {
          clicks?: number
          conversions?: number
          cost?: number
          created_at?: string
          id?: string
          impressions?: number
          month?: string
          updated_at?: string
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
      optimization_suggestions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          impact: string
          target_audience: string | null
          target_campaigns: string[] | null
          target_pages: string[] | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          impact: string
          target_audience?: string | null
          target_campaigns?: string[] | null
          target_pages?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          impact?: string
          target_audience?: string | null
          target_campaigns?: string[] | null
          target_pages?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
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
