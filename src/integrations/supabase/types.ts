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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_pet_id: string | null
          following_user_id: string | null
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_pet_id?: string | null
          following_user_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_pet_id?: string | null
          following_user_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_pet_id_fkey"
            columns: ["following_pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_user_id_fkey"
            columns: ["following_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          bio: string | null
          birth_date: string | null
          breed: string | null
          color: string | null
          created_at: string
          followers_count: number | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          is_active: boolean | null
          name: string
          owner_id: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          posts_count: number | null
          profile_image_url: string | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          followers_count?: number | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_active?: boolean | null
          name: string
          owner_id: string
          pet_type: Database["public"]["Enums"]["pet_type"]
          posts_count?: number | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string
          followers_count?: number | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          is_active?: boolean | null
          name?: string
          owner_id?: string
          pet_type?: Database["public"]["Enums"]["pet_type"]
          posts_count?: number | null
          profile_image_url?: string | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: string | null
          created_at: string
          expires_at: string | null
          id: string
          image_urls: string[] | null
          is_archived: boolean | null
          is_sponsored: boolean | null
          likes_count: number | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          pet_id: string | null
          post_type: Database["public"]["Enums"]["post_type"]
          shares_count: number | null
          sponsor_budget: number | null
          target_breeds: string[] | null
          target_pet_types: Database["public"]["Enums"]["pet_type"][] | null
          target_radius_km: number | null
          updated_at: string
          user_id: string
          video_url: string | null
          views_count: number | null
        }
        Insert: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_archived?: boolean | null
          is_sponsored?: boolean | null
          likes_count?: number | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          pet_id?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          shares_count?: number | null
          sponsor_budget?: number | null
          target_breeds?: string[] | null
          target_pet_types?: Database["public"]["Enums"]["pet_type"][] | null
          target_radius_km?: number | null
          updated_at?: string
          user_id: string
          video_url?: string | null
          views_count?: number | null
        }
        Update: {
          comments_count?: number | null
          content?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_archived?: boolean | null
          is_sponsored?: boolean | null
          likes_count?: number | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          pet_id?: string | null
          post_type?: Database["public"]["Enums"]["post_type"]
          shares_count?: number | null
          sponsor_budget?: number | null
          target_breeds?: string[] | null
          target_pet_types?: Database["public"]["Enums"]["pet_type"][] | null
          target_radius_km?: number | null
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          bio: string | null
          business_category:
            | Database["public"]["Enums"]["business_category"]
            | null
          created_at: string
          email: string
          followers_count: number | null
          following_count: number | null
          full_name: string | null
          id: string
          is_private: boolean | null
          is_verified: boolean | null
          location_lat: number | null
          location_lng: number | null
          phone: string | null
          posts_count: number | null
          profile_image_url: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          username: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          business_category?:
            | Database["public"]["Enums"]["business_category"]
            | null
          created_at?: string
          email: string
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id: string
          is_private?: boolean | null
          is_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          posts_count?: number | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          business_category?:
            | Database["public"]["Enums"]["business_category"]
            | null
          created_at?: string
          email?: string
          followers_count?: number | null
          following_count?: number | null
          full_name?: string | null
          id?: string
          is_private?: boolean | null
          is_verified?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          phone?: string | null
          posts_count?: number | null
          profile_image_url?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          administered_date: string
          batch_number: string | null
          created_at: string
          id: string
          next_due_date: string | null
          notes: string | null
          pet_id: string
          updated_at: string
          vaccine_name: string
          vaccine_type: string | null
          vet_id: string | null
        }
        Insert: {
          administered_date: string
          batch_number?: string | null
          created_at?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id: string
          updated_at?: string
          vaccine_name: string
          vaccine_type?: string | null
          vet_id?: string | null
        }
        Update: {
          administered_date?: string
          batch_number?: string | null
          created_at?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          pet_id?: string
          updated_at?: string
          vaccine_name?: string
          vaccine_type?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccinations_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      business_category:
        | "vet"
        | "pet_shop"
        | "groomer"
        | "trainer"
        | "daycare"
        | "photographer"
        | "event_organizer"
        | "other"
      gender: "male" | "female" | "unknown"
      pet_type:
        | "dog"
        | "cat"
        | "bird"
        | "fish"
        | "rabbit"
        | "hamster"
        | "reptile"
        | "other"
      post_type: "post" | "story"
      user_type: "normal" | "professional"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_category: [
        "vet",
        "pet_shop",
        "groomer",
        "trainer",
        "daycare",
        "photographer",
        "event_organizer",
        "other",
      ],
      gender: ["male", "female", "unknown"],
      pet_type: [
        "dog",
        "cat",
        "bird",
        "fish",
        "rabbit",
        "hamster",
        "reptile",
        "other",
      ],
      post_type: ["post", "story"],
      user_type: ["normal", "professional"],
    },
  },
} as const
