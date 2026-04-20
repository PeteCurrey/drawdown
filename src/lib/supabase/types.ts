export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          experience_level: 'beginner' | 'intermediate' | 'advanced' | null
          preferred_markets: string[] | null
          stripe_customer_id: string | null
          subscription_tier: 'free' | 'foundation' | 'edge' | 'floor'
          subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing' | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          preferred_markets?: string[] | null
          stripe_customer_id?: string | null
          subscription_tier?: 'free' | 'foundation' | 'edge' | 'floor'
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trialing' | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          experience_level?: 'beginner' | 'intermediate' | 'advanced' | null
          preferred_markets?: string[] | null
          stripe_customer_id?: string | null
          subscription_tier?: 'free' | 'foundation' | 'edge' | 'floor'
          subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trialing' | null
          updated_at?: string | null
          created_at?: string
        }
      }
      course_progress: {
        Row: {
          id: string
          user_id: string
          phase: number
          module: number
          completed: boolean
          quiz_score: number | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phase: number
          module: number
          completed?: boolean
          quiz_score?: number | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase?: number
          module?: number
          completed?: boolean
          quiz_score?: number | null
          completed_at?: string | null
          created_at?: string
        }
      }
      trade_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          symbol: string
          type: string
          entry_price: number
          exit_price: number | null
          pnl_amount: number | null
          pnl_percent: number | null
          strategy: string | null
          session: string | null
          feeling: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          symbol: string
          type: string
          entry_price: number
          exit_price?: number | null
          pnl_amount?: number | null
          pnl_percent?: number | null
          strategy?: string | null
          session?: string | null
          feeling?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          symbol?: string
          type?: string
          entry_price?: number
          exit_price?: number | null
          pnl_amount?: number | null
          pnl_percent?: number | null
          strategy?: string | null
          session?: string | null
          feeling?: string | null
          notes?: string | null
          created_at?: string
        }
      },
      ai_usage_logs: {
        Row: {
          id: string
          user_id: string
          scope: string
          model: string
          tokens_estimated: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scope: string
          model: string
          tokens_estimated?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scope?: string
          model?: string
          tokens_estimated?: number
          created_at?: string
        }
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
