"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import PageContainer from "@/components/layout/page-container"
import { useAuthStore } from "@/lib/userStore"
import { Role_ENUM } from "@/types/user"

type MaterialType = "image" | "video" | "other"

export type Material = {
  id: string
  title: string
  description?: string
  type: MaterialType
  driveUrl: string
  driveFileId: string
  thumbnailUrl?: string
  createdAt: number
  updatedAt: number
}

function extractDriveId(url: string): string | null {
  try {
    // common patterns:
    // https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
    // https://drive.google.com/open?id=<FILE_ID>
    // https://drive.google.com/uc?id=<FILE_ID>&export=download
    const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (m?.[1]) return m[1]
    const u = new URL(url)
    const id = u.searchParams.get("id")
    if (id) return id
    const m2 = url.match(/\/d\/([a-zA-Z0-9_-]+)\/?$/)
    if (m2?.[1]) return m2[1]
    return null
  } catch {
    return null
  }
}

function driveThumbnailUrl(fileId: string) {
  // Google Drive thumbnail endpoint
  return `https://drive.google.com/thumbnail?id=${fileId}`
}

function directDownloadUrlFromId(id: string) {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`
}

function DownloadButton({ material }: { material: Material }) {
  const href = useMemo(() => {
    return directDownloadUrlFromId(material.driveFileId)
  }, [material.driveFileId])

  return (
    <a
      href={href}
      download={material.title}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90",
      )}
    >
      Download
    </a>
  )
}

function formatISODate(dateMs: number) {
  try {
    return new Date(dateMs).toISOString().slice(0, 10) // YYYY-MM-DD
  } catch {
    return ""
  }
}

function MaterialsGrid({ items }: { items: Material[] }) {
  if (!items.length) {
    return <div className="text-muted-foreground text-sm">No materials yet. Please check back later.</div>
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((m) => (
        <Card key={m.id} className="flex flex-col">
          <CardHeader className="space-y-1">
            <CardTitle className="text-pretty">{m.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {m.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatISODate(m.createdAt)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {m.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.thumbnailUrl || "/placeholder.svg"}
                alt={`${m.title} preview`}
                className="w-full h-40 object-cover rounded-md border border-border"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/placeholder.svg?height=160&width=320&query=marketing%20asset%20preview`}
                alt="Preview placeholder"
                className="w-full h-40 object-cover rounded-md border border-border"
              />
            )}
            {m.description ? <p className="mt-3 text-sm text-muted-foreground text-pretty">{m.description}</p> : null}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <DownloadButton material={m} />
            <a
              href={m.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:underline"
            >
              Open in Drive
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function AdminForm({
  onCreate,
}: {
  onCreate: (
    input: Omit<Material, "id" | "createdAt" | "updatedAt" | "driveFileId" | "thumbnailUrl"> & {
      driveUrl: string
      type: MaterialType
      description?: string
    },
  ) => void
}) {
  const [title, setTitle] = useState("")
  const [driveUrl, setDriveUrl] = useState("")
  const [type, setType] = useState<MaterialType>("image")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const canSubmit = title.trim().length > 0 && driveUrl.trim().length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = extractDriveId(driveUrl)
    if (!id) {
      alert("Please provide a valid Google Drive link")
      return
    }
    setLoading(true)
    // Simulate async
    setTimeout(() => {
      onCreate({ title, description, type, driveUrl })
      setTitle("")
      setDescription("")
      setDriveUrl("")
      setLoading(false)
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Material</CardTitle>
        <CardDescription>Store a Google Drive asset with a title and type.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summer Campaign Banner"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="drive">Google Drive Link</Label>
            <Input
              id="drive"
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as MaterialType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description (optional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any usage notes or sizes"
              rows={3}
            />
          </div>
          <div>
            <Button type="submit" disabled={!canSubmit || loading}>
              {loading ? "Adding..." : "Add Material"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function AdminList({
  items,
  onSave,
  onDelete,
}: {
  items: Material[]
  onSave: (id: string, patch: Partial<Pick<Material, "title" | "description" | "type" | "driveUrl">>) => void
  onDelete: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Material>>({})

  function startEdit(m: Material) {
    setEditingId(m.id)
    setForm({ title: m.title, description: m.description, type: m.type, driveUrl: m.driveUrl })
  }

  function saveEdit(id: string) {
    onSave(id, form)
    setEditingId(null)
    setForm({})
  }

  function remove(id: string) {
    if (!confirm("Delete this material?")) return
    onDelete(id)
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((m) => (
        <Card key={m.id}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-pretty">{m.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {m.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(m.updatedAt).toISOString().replace("T", " ").slice(0, 16)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {editingId === m.id ? (
              <>
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Drive Link</Label>
                  <Input
                    value={form.driveUrl ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, driveUrl: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select
                    value={form.type ?? m.type}
                    onValueChange={(v) => setForm((f) => ({ ...f, type: v as MaterialType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">{m.description || "—"}</div>
                <div className="text-xs break-all">{m.driveUrl}</div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            {editingId === m.id ? (
              <>
                <Button size="sm" onClick={() => saveEdit(m.id)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null)
                    setForm({})
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="secondary" onClick={() => startEdit(m)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove(m.id)}>
                  Delete
                </Button>
                <a
                  href={directDownloadUrlFromId(m.driveFileId)}
                  download={m.title}
                  className={cn("ml-auto text-sm underline")}
                >
                  Test download
                </a>
              </>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function MaterialsPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const {user} = useAuthStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [materials, setMaterials] = useState<Material[]>([
    (() => {
      const driveFileId = "1BSkXz4Ijicayqp4DP43826rBsm-PUOvx"
      const ts = Date.parse("2024-01-01T00:00:00Z")
      return {
        id: "demo-1",
        title: "Brand Logo Pack",
        description: "PNG + SVG logos for social and presentations.",
        type: "image" as const,
        driveUrl: `https://drive.google.com/file/d/1BSkXz4Ijicayqp4DP43826rBsm-PUOvx/view?usp=share_link`,
        driveFileId,
        thumbnailUrl: driveThumbnailUrl(driveFileId),
        createdAt: ts,
        updatedAt: ts,
      }
    })(),
    (() => {
      const driveFileId = "9a8b7c_demo_video_file_id"
      const ts = Date.parse("2024-01-02T00:00:00Z")
      return {
        id: "demo-2",
        title: "Summer Campaign Teaser",
        description: "15s MP4 for Instagram Reels.",
        type: "video" as const,
        driveUrl: `https://drive.google.com/open?id=${driveFileId}`,
        driveFileId,
        thumbnailUrl: driveThumbnailUrl(driveFileId),
        createdAt: ts,
        updatedAt: ts,
      }
    })(),
  ])

  function addMaterial(input: { title: string; description?: string; type: MaterialType; driveUrl: string }) {
    const fileId = extractDriveId(input.driveUrl)
    if (!fileId) {
      alert("Invalid Google Drive URL")
      return
    }
    const now = Date.now()
    setMaterials((prev) => [
      {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        type: input.type,
        driveUrl: input.driveUrl,
        driveFileId: fileId,
        thumbnailUrl: driveThumbnailUrl(fileId),
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ])
  }

  function saveMaterial(id: string, patch: Partial<Pick<Material, "title" | "description" | "type" | "driveUrl">>) {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        let driveFileId = m.driveFileId
        let thumbnailUrl = m.thumbnailUrl
        if (patch.driveUrl && patch.driveUrl !== m.driveUrl) {
          const newId = extractDriveId(patch.driveUrl)
          if (!newId) {
            alert("Invalid Google Drive URL")
            return m
          }
          driveFileId = newId
          thumbnailUrl = driveThumbnailUrl(newId)
        }
        return {
          ...m,
          title: patch.title ?? m.title,
          description: patch.description ?? m.description,
          type: (patch as any).type ?? m.type,
          driveUrl: patch.driveUrl ?? m.driveUrl,
          driveFileId,
          thumbnailUrl,
          updatedAt: Date.now(),
        }
      }),
    )
  }

  function deleteMaterial(id: string) {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  if (!mounted) {
    return (
      <main className="container mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Marketing Materials</h1>
            <p className="text-sm text-muted-foreground">
              Browse and download approved assets. Admins can add, edit, and remove items.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" disabled>
              Loading…
            </Button>
          </div>
        </header>
        <section className="grid gap-6">
          <div className="text-sm text-muted-foreground">Loading materials…</div>
        </section>
      </main>
    )
  }

  return (
    <PageContainer>
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Marketing Materials</h1>
          <p className="text-sm text-muted-foreground">
            Browse and download approved assets. Admins can add, edit, and remove items.
          </p>
        </div>
        {
          user?.role == Role_ENUM.ADMIN &&

          <div className="flex items-center gap-2">
          {!isAdmin ? (
            <Button variant="secondary" onClick={() => setIsAdmin(true)}>
              Admin
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsAdmin(false)}>
              Library
            </Button>
          )}
        </div>
        }
      </div>

      {isAdmin ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6">
            <AdminForm
              onCreate={(input) => {
                addMaterial(input)
              }}
            />
            <Card>
              <CardHeader>
                <CardTitle>Existing Materials</CardTitle>
                <CardDescription>Manage your library (client-only demo)</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminList items={materials} onSave={saveMaterial} onDelete={deleteMaterial} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Direct Downloads</CardTitle>
                <CardDescription>We use Drive&apos;s uc?export=download endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As assest are not freq added, so'll add them manually, so adding here or deleting here wont work now,
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="grid gap-6">
          <MaterialsGrid items={materials} />
        </section>
      )}
    </div>
    </PageContainer>
  )
}
