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
          country: string | null
          currency: string | null
          has_onboarded: boolean
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
          country?: string | null
          currency?: string | null
          has_onboarded?: boolean
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
          country?: string | null
          currency?: string | null
          has_onboarded?: boolean
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
          notes: string | null
          created_at: string
          updated_at: string | null
          direction: 'long' | 'short' | null
          stop_loss: number | null
          take_profit: number | null
          position_size: number | null
          risk_amount: number | null
          risk_percentage: number | null
          account_balance_at_entry: number | null
          pnl_percentage: number | null
          rrr_planned: number | null
          rrr_achieved: number | null
          session: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          emotional_state_entry: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral' | null
          emotional_state_exit: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan: boolean | null
          setup_type: string | null
          entry_reason: string | null
          exit_reason: string | null
          mistakes: string | null
          status: 'open' | 'closed' | 'cancelled' | null
          tags: string[] | null
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
          notes?: string | null
          created_at?: string
          updated_at?: string | null
          direction?: 'long' | 'short' | null
          stop_loss?: number | null
          take_profit?: number | null
          position_size?: number | null
          risk_amount?: number | null
          risk_percentage?: number | null
          account_balance_at_entry?: number | null
          pnl_percentage?: number | null
          rrr_planned?: number | null
          rrr_achieved?: number | null
          session?: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          emotional_state_entry?: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral' | null
          emotional_state_exit?: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan?: boolean | null
          setup_type?: string | null
          entry_reason?: string | null
          exit_reason?: string | null
          mistakes?: string | null
          status?: 'open' | 'closed' | 'cancelled' | null
          tags?: string[] | null
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
          notes?: string | null
          created_at?: string
          updated_at?: string | null
          direction?: 'long' | 'short' | null
          stop_loss?: number | null
          take_profit?: number | null
          position_size?: number | null
          risk_amount?: number | null
          risk_percentage?: number | null
          account_balance_at_entry?: number | null
          pnl_percentage?: number | null
          rrr_planned?: number | null
          rrr_achieved?: number | null
          session?: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          emotional_state_entry?: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral' | null
          emotional_state_exit?: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan?: boolean | null
          setup_type?: string | null
          entry_reason?: string | null
          exit_reason?: string | null
          mistakes?: string | null
          status?: 'open' | 'closed' | 'cancelled' | null
          tags?: string[] | null
        }
      },
      trades: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          instrument: string
          direction: 'long' | 'short'
          entry_price: number
          exit_price: number | null
          stop_loss: number
          take_profit: number | null
          position_size: number
          entry_time: string
          exit_time: string | null
          session: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          risk_amount: number
          risk_percentage: number
          account_balance_at_entry: number
          pnl: number | null
          pnl_percentage: number | null
          rrr_planned: number | null
          rrr_achieved: number | null
          emotional_state_entry: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral'
          emotional_state_exit: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan: boolean
          setup_type: string | null
          timeframe_analysis: string | null
          entry_reason: string
          exit_reason: string | null
          notes: string | null
          mistakes: string | null
          status: 'open' | 'closed' | 'cancelled'
          tags: string[] | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          instrument: string
          direction: 'long' | 'short'
          entry_price: number
          exit_price?: number | null
          stop_loss: number
          take_profit?: number | null
          position_size: number
          entry_time: string
          exit_time?: string | null
          session?: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          risk_amount: number
          risk_percentage: number
          account_balance_at_entry: number
          pnl?: number | null
          pnl_percentage?: number | null
          rrr_planned?: number | null
          rrr_achieved?: number | null
          emotional_state_entry: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral'
          emotional_state_exit?: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan: boolean
          setup_type?: string | null
          timeframe_analysis?: string | null
          entry_reason: string
          exit_reason?: string | null
          notes?: string | null
          mistakes?: string | null
          status?: 'open' | 'closed' | 'cancelled'
          tags?: string[] | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          instrument?: string
          direction?: 'long' | 'short'
          entry_price?: number
          exit_price?: number | null
          stop_loss?: number
          take_profit?: number | null
          position_size?: number
          entry_time?: string
          exit_time?: string | null
          session?: 'london' | 'new_york' | 'asian' | 'overlap' | 'other' | null
          risk_amount?: number
          risk_percentage?: number
          account_balance_at_entry?: number
          pnl?: number | null
          pnl_percentage?: number | null
          rrr_planned?: number | null
          rrr_achieved?: number | null
          emotional_state_entry?: 'calm' | 'confident' | 'anxious' | 'fearful' | 'excited' | 'frustrated' | 'neutral'
          emotional_state_exit?: 'calm' | 'satisfied' | 'disappointed' | 'relieved' | 'angry' | 'neutral' | null
          followed_plan?: boolean
          setup_type?: string | null
          timeframe_analysis?: string | null
          entry_reason?: string
          exit_reason?: string | null
          notes?: string | null
          mistakes?: string | null
          status?: 'open' | 'closed' | 'cancelled'
          tags?: string[] | null
        }
      }
      journal_ai_analysis: {
        Row: {
          id: string
          user_id: string | null
          created_at: string
          analysis_type: string | null
          trade_count: number | null
          analysis_content: string | null
          patterns_detected: any | null
          recommendations: any | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string
          analysis_type?: string | null
          trade_count?: number | null
          analysis_content?: string | null
          patterns_detected?: any | null
          recommendations?: any | null
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string
          analysis_type?: string | null
          trade_count?: number | null
          analysis_content?: string | null
          patterns_detected?: any | null
          recommendations?: any | null
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
