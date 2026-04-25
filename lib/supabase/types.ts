export type Database = {
  public: {
    Tables: {
      organisers: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          stripe_customer_id: string | null
          plan: 'free' | 'pro' | 'club'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['organisers']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['organisers']['Insert']>
      }
      sweepstakes: {
        Row: {
          id: string
          organiser_id: string
          name: string
          tournament_id: number | null
          tournament_name: string | null
          entry_fee: number
          status: 'setup' | 'active' | 'complete'
          plan: 'free' | 'pro' | 'club'
          share_token: string
          assignment_mode: 'random' | 'auto' | 'manual'
          draw_completed_at: string | null
          is_pro: boolean
          pro_expires_at: string | null
          custom_slug: string | null
          logo_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sweepstakes']['Row'], 'id' | 'created_at' | 'share_token'> & {
          id?: string
          created_at?: string
          share_token?: string
        }
        Update: Partial<Database['public']['Tables']['sweepstakes']['Insert']>
      }
      participants: {
        Row: {
          id: string
          sweepstake_id: string
          name: string
          email: string | null
          paid: boolean
          paid_at: string | null
          notify_enabled: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['participants']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['participants']['Insert']>
      }
      assignments: {
        Row: {
          id: string
          sweepstake_id: string
          participant_id: string
          team_id: number
          team_name: string
          team_flag: string | null
          assigned_at: string
        }
        Insert: Omit<Database['public']['Tables']['assignments']['Row'], 'id' | 'assigned_at'> & {
          id?: string
          assigned_at?: string
        }
        Update: Partial<Database['public']['Tables']['assignments']['Insert']>
      }
      teams: {
        Row: {
          id: number
          tournament_id: number
          name: string
          flag: string | null
          logo_url: string | null
          group_name: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'updated_at'> & {
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      matches: {
        Row: {
          id: number
          tournament_id: number
          home_team_id: number | null
          home_team_name: string | null
          away_team_id: number | null
          away_team_name: string | null
          home_score: number | null
          away_score: number | null
          status: string | null
          round: string | null
          kickoff: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'updated_at'> & {
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['matches']['Insert']>
      }
      scores: {
        Row: {
          id: string
          sweepstake_id: string
          participant_id: string
          points: number
          rank: number | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scores']['Row'], 'id' | 'updated_at'> & {
          id?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['scores']['Insert']>
      }
      sync_log: {
        Row: {
          id: string
          sync_type: string | null
          tournament_id: number | null
          api_calls_used: number
          matches_updated: number
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['sync_log']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['sync_log']['Insert']>
      }
      final_entries: {
        Row: {
          id: string
          final_sweepstake_id: string
          participant_name: string
          participant_email: string | null
          predicted_minute: number
          paid: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['final_entries']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['final_entries']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
