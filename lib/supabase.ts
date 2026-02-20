import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      fund_settings: {
        Row: {
          id: string
          monthly_contribution: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          monthly_contribution?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          monthly_contribution?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          member_id: string
          month: number
          year: number
          paid: boolean
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          month: number
          year: number
          paid?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          month?: number
          year?: number
          paid?: boolean
          created_at?: string
        }
      }
      assistance: {
        Row: {
          id: string
          date: string
          case_name: string
          amount: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          case_name: string
          amount: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          case_name?: string
          amount?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}