export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          role?: "admin";
        };
        Update: {
          role?: "admin";
        };
      };
      packages: {
        Row: {
          id: string;
          type: "umroh" | "haji";
          slug: string;
          name: Json;
          departure_date: string;
          return_date: string;
          price: number;
          price_includes: Json | null;
          brochure_url: string | null;
          brochure_path: string | null;
          itinerary_url: string | null;
          itinerary_path: string | null;
          facilities: Json | null;
          total_quota: number | null;
          remaining_quota: number | null;
          departure_month: number;
          status: "available" | "full" | "closed";
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: "umroh" | "haji";
          slug: string;
          name: Json;
          departure_date: string;
          return_date: string;
          price: number;
          price_includes?: Json | null;
          brochure_url?: string | null;
          brochure_path?: string | null;
          itinerary_url?: string | null;
          itinerary_path?: string | null;
          facilities?: Json | null;
          total_quota?: number | null;
          remaining_quota?: number | null;
          status?: "available" | "full" | "closed";
          is_featured?: boolean;
        };
        Update: {
          type?: "umroh" | "haji";
          slug?: string;
          name?: Json;
          departure_date?: string;
          return_date?: string;
          price?: number;
          price_includes?: Json | null;
          brochure_url?: string | null;
          brochure_path?: string | null;
          itinerary_url?: string | null;
          itinerary_path?: string | null;
          facilities?: Json | null;
          total_quota?: number | null;
          remaining_quota?: number | null;
          status?: "available" | "full" | "closed";
          is_featured?: boolean;
        };
      };
      news: {
        Row: {
          id: string;
          slug: string;
          title: Json;
          excerpt: Json | null;
          content: Json | null;
          cover_url: string | null;
          cover_path: string | null;
          published_at: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: Json;
          excerpt?: Json | null;
          content?: Json | null;
          cover_url?: string | null;
          cover_path?: string | null;
          published_at?: string | null;
          is_published?: boolean;
        };
        Update: {
          slug?: string;
          title?: Json;
          excerpt?: Json | null;
          content?: Json | null;
          cover_url?: string | null;
          cover_path?: string | null;
          published_at?: string | null;
          is_published?: boolean;
        };
      };
      testimonials: {
        Row: {
          id: string;
          jamaah_name: string | null;
          title: Json | null;
          type: string;
          youtube_url: string | null;
          youtube_id: string | null;
          platform: string | null;
          image_url: string | null;
          image_path: string | null;
          description: Json | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          jamaah_name?: string | null;
          title?: Json | null;
          type?: string;
          youtube_url?: string | null;
          youtube_id?: string | null;
          platform?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          description?: Json | null;
          order_index?: number;
        };
        Update: {
          jamaah_name?: string | null;
          title?: Json | null;
          type?: string;
          youtube_url?: string | null;
          youtube_id?: string | null;
          platform?: string | null;
          image_url?: string | null;
          image_path?: string | null;
          description?: Json | null;
          order_index?: number;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
        };
        Update: {
          value?: Json;
        };
      };
    };
  };
}
