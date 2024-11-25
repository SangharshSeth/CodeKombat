import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import { Session } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface AuthState {
    session: Session | null
    loading: boolean
    signInWithGithub: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    loading: true,

    signInWithGithub: async () => {
        set({ loading: true })
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/app`
                }
            })

            if (error) throw error
        } catch (error) {
            console.error('GitHub OAuth Error:', error)
        } finally {
            set({ loading: false })
        }
    },

    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            set({ session: null })
        } catch (error) {
            console.error('Sign Out Error:', error)
        }
    }
}))

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
        session,
        loading: false
    })
})

// Initial session check
supabase.auth.getSession().then(({ data }) => {
    useAuthStore.setState({
        session: data.session,
        loading: false
    })
})