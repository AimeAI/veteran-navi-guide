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
      application_notifications: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          new_status: string
          old_status: string | null
          processed: boolean | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          new_status: string
          old_status?: string | null
          processed?: boolean | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          new_status?: string
          old_status?: string | null
          processed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "application_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applicant_id: string | null
          cover_letter: string | null
          created_at: string | null
          date_applied: string | null
          id: string
          job_id: string | null
          notes: string | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          date_applied?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          date_applied?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_leads: {
        Row: {
          company_name: string
          date_added: string
          id: string
          lead_status: string
          linkedin_url: string | null
          notes: string | null
          updated_at: string
          user_id: string | null
          website_url: string
        }
        Insert: {
          company_name: string
          date_added?: string
          id?: string
          lead_status?: string
          linkedin_url?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string | null
          website_url: string
        }
        Update: {
          company_name?: string
          date_added?: string
          id?: string
          lead_status?: string
          linkedin_url?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string | null
          website_url?: string
        }
        Relationships: []
      }
      employers: {
        Row: {
          company_description: string | null
          company_logo_url: string | null
          company_mission: string | null
          company_name: string
          company_size: string | null
          company_website: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          date_added: string
          id: string
          industry: string | null
          location: string | null
          updated_at: string
          user_id: string | null
          veteran_benefits: string | null
          vetting_status: Database["public"]["Enums"]["vetting_status"]
        }
        Insert: {
          company_description?: string | null
          company_logo_url?: string | null
          company_mission?: string | null
          company_name: string
          company_size?: string | null
          company_website: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          date_added?: string
          id?: string
          industry?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string | null
          veteran_benefits?: string | null
          vetting_status?: Database["public"]["Enums"]["vetting_status"]
        }
        Update: {
          company_description?: string | null
          company_logo_url?: string | null
          company_mission?: string | null
          company_name?: string
          company_size?: string | null
          company_website?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          date_added?: string
          id?: string
          industry?: string | null
          location?: string | null
          updated_at?: string
          user_id?: string | null
          veteran_benefits?: string | null
          vetting_status?: Database["public"]["Enums"]["vetting_status"]
        }
        Relationships: []
      }
      job_skills: {
        Row: {
          created_at: string
          id: string
          is_required: boolean | null
          job_id: string
          skill_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_required?: boolean | null
          job_id: string
          skill_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_required?: boolean | null
          job_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["skill_id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_url: string | null
          benefits: string | null
          company: string
          created_at: string | null
          description: string
          employer_id: string | null
          id: string
          job_type: string
          location: string
          military_skill_mapping: string[] | null
          required_skills: string[] | null
          requirements: string[] | null
          salary: string | null
          salary_range: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          benefits?: string | null
          company: string
          created_at?: string | null
          description: string
          employer_id?: string | null
          id?: string
          job_type: string
          location: string
          military_skill_mapping?: string[] | null
          required_skills?: string[] | null
          requirements?: string[] | null
          salary?: string | null
          salary_range?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          benefits?: string | null
          company?: string
          created_at?: string | null
          description?: string
          employer_id?: string | null
          id?: string
          job_type?: string
          location?: string
          military_skill_mapping?: string[] | null
          required_skills?: string[] | null
          requirements?: string[] | null
          salary?: string | null
          salary_range?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          skill_id: string
          skill_name: string
        }
        Insert: {
          created_at?: string
          skill_id?: string
          skill_name: string
        }
        Update: {
          created_at?: string
          skill_id?: string
          skill_name?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          proficiency_level: string | null
          skill_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["skill_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_matching_jobs: {
        Args: {
          user_id: string
          min_matches?: number
        }
        Returns: {
          job_id: string
          job_title: string
          company: string
          location: string
          match_count: number
          match_percentage: number
        }[]
      }
    }
    Enums: {
      job_status: "Open" | "Closed" | "Pending"
      job_type: "Full-time" | "Part-time" | "Contract" | "Internship"
      vetting_status: "Pending" | "Approved" | "Rejected"
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
