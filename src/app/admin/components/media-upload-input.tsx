'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

type Props = {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function MediaUploadInput({ label, value, onChange, required = false }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload.error || 'Upload impossible')
      }

      onChange(payload.url)
      if (inputRef.current) inputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload impossible')
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/55">{label}</span>

      <div className="flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} className="admin-input" required={required} />
        <label className="cursor-pointer rounded-xl border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/5">
          {uploading ? 'Upload...' : 'Televerser'}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>

      {value ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-24 w-full rounded-md object-cover" />
        </div>
      ) : null}

      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </label>
  )
}
