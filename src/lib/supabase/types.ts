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
          role: 'student' | 'partner' | 'admin'
          partner_id: string | null
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
          role?: 'student' | 'partner' | 'admin'
          partner_id?: string | null
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
          role?: 'student' | 'partner' | 'admin'
          partner_id?: string | null
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
      },
      daily_briefs: {
        Row: {
          id: string
          summary: string
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          summary: string
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          summary?: string
          audio_url?: string | null
          created_at?: string
        }
      },
      broker_affiliates: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          type: 'broker' | 'prop_firm' | 'tool'
          affiliate_url: string
          best_for: string | null
          rating: number | null
          min_deposit: string | null
          spread_from: string | null
          platforms: string[] | null
          leverage: string | null
          fca_regulated: boolean
          pros: string[] | null
          cons: string[] | null
          review_content: string | null
          category_tags: string[] | null
          display_order: number
          is_active: boolean
          commission_type: string | null
          commission_detail: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string | null
          type: 'broker' | 'prop_firm' | 'tool'
          affiliate_url: string
          best_for?: string | null
          rating?: number | null
          min_deposit?: string | null
          spread_from?: string | null
          platforms?: string[] | null
          leverage?: string | null
          fca_regulated?: boolean
          pros?: string[] | null
          cons?: string[] | null
          review_content?: string | null
          category_tags?: string[] | null
          display_order?: number
          is_active?: boolean
          commission_type?: string | null
          commission_detail?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          type?: 'broker' | 'prop_firm' | 'tool'
          affiliate_url?: string
          best_for?: string | null
          rating?: number | null
          min_deposit?: string | null
          spread_from?: string | null
          platforms?: string[] | null
          leverage?: string | null
          fca_regulated?: boolean
          pros?: string[] | null
          cons?: string[] | null
          review_content?: string | null
          category_tags?: string[] | null
          display_order?: number
          is_active?: boolean
          commission_type?: string | null
          commission_detail?: string | null
          created_at?: string
        }
      },
      broker_clicks: {
        Row: {
          id: string
          broker_id: string
          user_id: string | null
          source_page: string | null
          clicked_at: string
          ip_hash: string | null
        }
        Insert: {
          id?: string
          broker_id: string
          user_id?: string | null
          source_page?: string | null
          clicked_at?: string
          ip_hash?: string | null
        }
        Update: {
          id?: string
          broker_id?: string
          user_id?: string | null
          source_page?: string | null
          clicked_at?: string
          ip_hash?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_page_view: {
        Args: {
          page_path: string
        }
        Returns: undefined
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
