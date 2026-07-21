import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/api/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, tenants(id, name, plan, status)')
      .eq('id', userId)
      .maybeSingle()
    if (error) {
      setLoading(false)
      return
    }
    if (data) {
      setProfile(data)
      setUser({
        id:        data.id,
        email:     data.email,
        name:      data.full_name,
        role:      data.role,
        tenant_id: data.tenant_id,
        tenant:    data.tenants,
        avatar:    data.avatar_url,
      })
    } else {
      setUser({ id: userId })
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Wrap async work to avoid deadlock inside the sync callback
      ;(async () => {
        if (session?.user) {
          await loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      })()
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
