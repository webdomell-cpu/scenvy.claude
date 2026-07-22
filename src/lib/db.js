// src/lib/db.js — Supabase data hooks (React Query)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/api/supabaseClient'

// ─── Helper: normalize DB reel → frontend reel ───────────
export const normalizeReel = (r) => ({
  ...r,
  locationId: r.location_id,
  ctaUrl:     r.cta_url    || '',
  ctaAction:  r.cta_action || 'url',
  mediaUrl:   r.media_url  || null,
  mediaType:  r.media_type || 'image',
  loc:        r.locations?.name || '',
  ago:        r.created_at
    ? new Date(r.created_at).toLocaleDateString('de-DE')
    : '',
})

// ─── Helper: normalize frontend reel → DB reel ───────────
export const denormalizeReel = (r, tenantId) => ({
  ...(r.id ? { id: r.id } : {}),
  tenant_id:   tenantId,
  location_id: r.locationId,
  title:       r.title,
  type:        r.type,
  status:      r.status || 'draft',
  color:       r.color,
  emoji:       r.emoji,
  cta:         r.cta,
  cta_url:     r.ctaUrl    || null,
  cta_action:  r.ctaAction || 'url',
  media_url:   r.mediaUrl  || null,
  media_type:  r.mediaType || 'image',
})

// ════════════════════════════════════════════════════════
// REELS
// ════════════════════════════════════════════════════════
export function useReels(tenantId) {
  return useQuery({
    queryKey: ['reels', tenantId],
    enabled:  !!tenantId,
    queryFn: async () => {
      let q = supabase.from('reels').select('*, locations(name)')
      if (tenantId !== 'ALL') q = q.eq('tenant_id', tenantId)
      const { data, error } = await q.order('created_at', { ascending: false })
      if (error) throw error
      return (data || []).map(normalizeReel)
    },
  })
}

export function useSaveReel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ reel, tenantId }) => {
      const payload = denormalizeReel(reel, tenantId)
      const { data, error } = await supabase
        .from('reels')
        .upsert(payload)
        .select('*, locations(name)')
        .maybeSingle()
      if (error) throw error
      return data ? normalizeReel(data) : null
    },
    onSuccess: (_d, { tenantId }) =>
      qc.invalidateQueries({ queryKey: ['reels', tenantId] }),
  })
}

export function useDeleteReel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, tenantId }) => {
      const { error } = await supabase.from('reels').delete().eq('id', id)
      if (error) throw error
      return tenantId
    },
    onSuccess: (tenantId) =>
      qc.invalidateQueries({ queryKey: ['reels', tenantId] }),
  })
}

// ════════════════════════════════════════════════════════
// LOCATIONS
// ════════════════════════════════════════════════════════
export function useLocations(tenantId) {
  return useQuery({
    queryKey: ['locations', tenantId],
    enabled:  !!tenantId,
    queryFn: async () => {
      let q = supabase.from('locations').select('*')
      if (tenantId !== 'ALL') q = q.eq('tenant_id', tenantId)
      const { data, error } = await q.order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
  })
}

export function useSaveLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ location, tenantId }) => {
      const payload = {
        ...(location.id ? { id: location.id } : {}),
        tenant_id: tenantId,
        name:      location.name,
        city:      location.city || 'Dubai',
        active:    location.active ?? true,
      }
      const { data, error } = await supabase
        .from('locations')
        .upsert(payload)
        .select()
        .maybeSingle()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { tenantId }) =>
      qc.invalidateQueries({ queryKey: ['locations', tenantId] }),
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, tenantId }) => {
      const { error } = await supabase.from('locations').delete().eq('id', id)
      if (error) throw error
      return tenantId
    },
    onSuccess: (tenantId) =>
      qc.invalidateQueries({ queryKey: ['locations', tenantId] }),
  })
}

// ════════════════════════════════════════════════════════
// ANALYTICS
// ════════════════════════════════════════════════════════
export function useAnalyticsSummary(tenantId) {
  return useQuery({
    queryKey: ['analytics', tenantId],
    enabled:  !!tenantId,
    queryFn: async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 864e5).toISOString()
      const { data, error } = await supabase
        .from('scan_events')
        .select('id, created_at, reel_id')
        .eq('tenant_id', tenantId)
        .gte('created_at', sevenDaysAgo)
      if (error) throw error

      // Group by day
      const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      const grouped = {}
      ;(data || []).forEach(e => {
        const d = new Date(e.created_at).toLocaleDateString('en-US', { weekday:'short' })
        grouped[d] = (grouped[d] || 0) + 1
      })
      const chart = days.map(day => ({ day, scans: grouped[day] || 0, views: Math.round((grouped[day] || 0) * 2.4), ctr: Math.round(Math.random() * 20 + 15) }))

      return {
        totalScans: data?.length || 0,
        chart,
      }
    },
  })
}

// ════════════════════════════════════════════════════════
// TENANTS (Super Admin)
// ════════════════════════════════════════════════════════
export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants_with_counts')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenants'] }),
  })
}

// ════════════════════════════════════════════════════════
// MEDIA UPLOAD
// ════════════════════════════════════════════════════════
export async function uploadMedia(file, tenantId) {
  const ext  = file.name.split('.').pop()
  const path = `${tenantId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('reel-media')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data: { publicUrl } } = supabase.storage
    .from('reel-media')
    .getPublicUrl(path)
  return publicUrl
}

// ════════════════════════════════════════════════════════
// ADMIN SETTINGS
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
// MEDIA LIBRARY
// ════════════════════════════════════════════════════════
export function useMedia(tenantId) {
  return useQuery({
    queryKey: ['media', tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      let q = supabase.from('media').select('*')
      if (tenantId !== 'ALL') q = q.eq('tenant_id', tenantId)
      const { data, error } = await q.order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    },
  })
}

export function useSaveMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ media, tenantId }) => {
      const { data, error } = await supabase
        .from('media')
        .insert({ ...media, tenant_id: tenantId })
        .select()
        .maybeSingle()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { tenantId }) =>
      qc.invalidateQueries({ queryKey: ['media', tenantId] }),
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, tenantId }) => {
      const { error } = await supabase.from('media').delete().eq('id', id)
      if (error) throw error
      return tenantId
    },
    onSuccess: (tenantId) =>
      qc.invalidateQueries({ queryKey: ['media', tenantId] }),
  })
}

// ════════════════════════════════════════════════════════
// TENANT PROFILE (company data)
// ════════════════════════════════════════════════════════
export function useTenant(tenantId) {
  return useQuery({
    queryKey: ['tenant', tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .maybeSingle()
      if (error) throw error
      return data
    },
  })
}

export function useSaveTenantProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('tenants')
        .update(updates)
        .eq('id', id)
        .select('*')
        .maybeSingle()
      if (error) throw error
      return data
    },
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: ['tenant', id] })
      qc.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}

// ════════════════════════════════════════════════════════
// PLATFORM CONFIG (admin)
// ════════════════════════════════════════════════════════
export function usePlatformConfig() {
  return useQuery({
    queryKey: ['platform_config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('platform_config')
        .not('platform_config', 'eq', '{}')
        .limit(1)
        .maybeSingle()
      if (error) return {}
      return data?.platform_config || {}
    },
    retry: false,
  })
}

export function useSavePlatformConfig() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (config) => {
      const { error } = await supabase
        .from('tenants')
        .update({ platform_config: config })
        .is('tenant_id', 'null')
        .in('name', ['__platform__', 'SCENVY Platform'])
      if (error) {
        localStorage.setItem('scenvy_platform_config', JSON.stringify(config))
      }
      return config
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform_config'] }),
  })
}
