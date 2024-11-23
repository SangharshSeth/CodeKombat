import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import supabase from '@/utils/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  initializeAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  email: string;
  created_at: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  profile: null,

  initializeAuth: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null });

      // Setup auth listener
      supabase.auth.onAuthStateChange((_event, session) => {
        const user = session?.user ?? null;
        set({ user });
        
        // Fetch profile when user changes
        if (user) {
          get().fetchProfile(user.id);
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async (userId: string) => {
    try {
      // First, try to get existing profile
      let { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const user = get().user;
      if (!user) return;

      if (!existingProfile) {
        // Create new profile if doesn't exist
        const newProfile = {
          id: user.id,
          username: user.user_metadata.user_name || user.user_metadata.preferred_username,
          avatar_url: user.user_metadata.avatar_url,
          email: user.email,
        };

        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) throw insertError;
        existingProfile = insertedProfile;
      }

      const profile = {
        id: user.id,
        username: existingProfile?.username || user.user_metadata.user_name,
        avatar_url: existingProfile?.avatar_url || user.user_metadata.avatar_url,
        email: user.email!,
        created_at: existingProfile?.created_at || user.created_at,
      };

      set({ profile });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },

  setUser: (user: User | null) => set({ user }),
  setProfile: (profile: UserProfile | null) => set({ profile }),

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
})); 