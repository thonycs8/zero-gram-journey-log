export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean | null
          points: number
          requirement_field: string | null
          requirement_type: string
          requirement_value: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon: string
          id?: string
          is_active?: boolean | null
          points?: number
          requirement_field?: string | null
          requirement_type: string
          requirement_value: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          points?: number
          requirement_field?: string | null
          requirement_type?: string
          requirement_value?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      meal_plan_items: {
        Row: {
          calories: number | null
          created_at: string
          day_number: number | null
          food_item: string
          id: string
          meal_plan_id: string
          meal_type: string
          order_index: number | null
          quantity: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          day_number?: number | null
          food_item: string
          id?: string
          meal_plan_id: string
          meal_type: string
          order_index?: number | null
          quantity?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          day_number?: number | null
          food_item?: string
          id?: string
          meal_plan_id?: string
          meal_type?: string
          order_index?: number | null
          quantity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plan_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration_days: number | null
          goal: string | null
          id: string
          image_url: string | null
          title: string
          total_calories: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          goal?: string | null
          id?: string
          image_url?: string | null
          title: string
          total_calories?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_days?: number | null
          goal?: string | null
          id?: string
          image_url?: string | null
          title?: string
          total_calories?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      motivational_quotes: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          quote_en: string
          quote_pt: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quote_en: string
          quote_pt: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          quote_en?: string
          quote_pt?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          content_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          page_key: string
          updated_at: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          page_key: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          page_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          gender: string
          goal: string | null
          height: number | null
          id: string
          notifications: Json | null
          updated_at: string
          user_id: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender: string
          goal?: string | null
          height?: number | null
          id?: string
          notifications?: Json | null
          updated_at?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          gender?: string
          goal?: string | null
          height?: number | null
          id?: string
          notifications?: Json | null
          updated_at?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      recipe_tags: {
        Row: {
          recipe_id: string
          tag_id: string
        }
        Insert: {
          recipe_id: string
          tag_id: string
        }
        Update: {
          recipe_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_tags_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          calories: number | null
          cook_time: number | null
          created_at: string
          created_by: string | null
          description: string | null
          dica_zerogram: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          ingredients: string[]
          instructions: string
          prep_time: number | null
          servings: number | null
          title: string
          updated_at: string
        }
        Insert: {
          calories?: number | null
          cook_time?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dica_zerogram?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients: string[]
          instructions: string
          prep_time?: number | null
          servings?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          calories?: number | null
          cook_time?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dica_zerogram?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[]
          instructions?: string
          prep_time?: number | null
          servings?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          key: string
          namespace: string
          updated_at: string | null
          values: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key: string
          namespace?: string
          updated_at?: string | null
          values: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key?: string
          namespace?: string
          updated_at?: string | null
          values?: Json
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          is_completed: boolean | null
          progress: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          is_completed?: boolean | null
          progress?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements_unlocked: {
        Row: {
          achievement_description: string | null
          achievement_title: string
          achievement_type: string
          id: string
          points_awarded: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_title: string
          achievement_type: string
          id?: string
          points_awarded?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_title?: string
          achievement_type?: string
          id?: string
          points_awarded?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_checkpoints: {
        Row: {
          checkpoint_date: string
          completed: boolean | null
          created_at: string
          id: string
          notes: string | null
          points_earned: number | null
          user_id: string
          user_plan_id: string
        }
        Insert: {
          checkpoint_date?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          points_earned?: number | null
          user_id: string
          user_plan_id: string
        }
        Update: {
          checkpoint_date?: string
          completed?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          points_earned?: number | null
          user_id?: string
          user_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_checkpoints_user_plan_id_fkey"
            columns: ["user_plan_id"]
            isOneToOne: false
            referencedRelation: "user_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string
          current_weight: number | null
          daily_calories: number | null
          daily_water: number | null
          id: string
          target_weight: number | null
          updated_at: string
          user_id: string
          weekly_exercise: number | null
          weekly_goal: number | null
        }
        Insert: {
          created_at?: string
          current_weight?: number | null
          daily_calories?: number | null
          daily_water?: number | null
          id?: string
          target_weight?: number | null
          updated_at?: string
          user_id: string
          weekly_exercise?: number | null
          weekly_goal?: number | null
        }
        Update: {
          created_at?: string
          current_weight?: number | null
          daily_calories?: number | null
          daily_water?: number | null
          id?: string
          target_weight?: number | null
          updated_at?: string
          user_id?: string
          weekly_exercise?: number | null
          weekly_goal?: number | null
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          current_progress: number | null
          id: string
          is_completed: boolean | null
          plan_id: number
          plan_title: string
          plan_type: string
          start_date: string
          target_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          plan_id: number
          plan_title: string
          plan_type: string
          start_date?: string
          target_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_progress?: number | null
          id?: string
          is_completed?: boolean | null
          plan_id?: number
          plan_title?: string
          plan_type?: string
          start_date?: string
          target_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          created_at: string
          current_streak: number | null
          days_active: number | null
          id: string
          last_activity_date: string | null
          level: number | null
          longest_streak: number | null
          plans_created: number | null
          recipes_viewed: number | null
          total_calculations: number | null
          total_points: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          days_active?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          plans_created?: number | null
          recipes_viewed?: number | null
          total_calculations?: number | null
          total_points?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          days_active?: number | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          longest_streak?: number | null
          plans_created?: number | null
          recipes_viewed?: number | null
          total_calculations?: number | null
          total_points?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          day_of_week: number | null
          exercise_name: string
          id: string
          notes: string | null
          order_index: number | null
          reps: string | null
          rest_seconds: number | null
          sets: number | null
          workout_plan_id: string
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          exercise_name: string
          id?: string
          notes?: string | null
          order_index?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          workout_plan_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          exercise_name?: string
          id?: string
          notes?: string | null
          order_index?: number | null
          reps?: string | null
          rest_seconds?: number | null
          sets?: number | null
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          duration_weeks: number | null
          frequency: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          frequency?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          duration_weeks?: number | null
          frequency?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
