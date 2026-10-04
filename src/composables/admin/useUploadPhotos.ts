import { computed, ref } from 'vue'
import { adminService } from '@/services/admin.service'
import { compressImage } from './compressImage'
import { errorMessage } from './format'

export interface UploadPhoto {
  id: string
  /** Lo que se pinta en la miniatura: blob local mientras sube, luego el link final. */
  preview: string
  /** Link https ya guardado (Cloudinary o pegado). Vacío mientras sube o si falló. */
  url: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
  file?: File
}

const MAX_PHOTOS = 12
// Dos a la vez: con datos móviles más subidas en paralelo solo se estorban.
const PARALLEL = 2

let seq = 0
const newId = () => `p${Date.now().toString(36)}${seq++}`

/** Fotos del formulario "Subir producto": se comprimen y suben apenas se eligen. */
export function useUploadPhotos(onError: (message: string) => void) {
  const photos = ref<UploadPhoto[]>([])
  const queue: string[] = []
  let running = 0

  const urls = computed(() => photos.value.filter((p) => p.status === 'done').map((p) => p.url))
  const uploading = computed(() => photos.value.some((p) => p.status === 'uploading'))
  const failed = computed(() => photos.value.filter((p) => p.status === 'error').length)
  const full = computed(() => photos.value.length >= MAX_PHOTOS)

  function find(id: string) {
    return photos.value.find((p) => p.id === id)
  }

  async function pump() {
    while (running < PARALLEL && queue.length) {
      const id = queue.shift() as string
      running++
      upload(id).finally(() => {
        running--
        pump()
      })
    }
  }

  async function upload(id: string) {
    const photo = find(id)
    if (!photo?.file) return
    photo.status = 'uploading'
    photo.progress = 0
    photo.error = undefined
    try {
      const blob = await compressImage(photo.file)
      const url = await adminService.uploadImage(blob, (pct) => {
        const current = find(id)
        // El 100% del envío no es el 100%: falta que Cloudinary responda.
        if (current) current.progress = Math.min(pct, 95)
      })
      const current = find(id)
      if (!current) return
      current.url = url
      current.progress = 100
      current.status = 'done'
      current.file = undefined
    } catch (e) {
      const current = find(id)
      if (!current) return
      current.status = 'error'
      current.error = errorMessage(e, 'No se pudo subir')
      onError(`Una foto no se subió: ${current.error}. Toca "Reintentar".`)
    }
  }

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith('image/'))
    if (!files.length) {
      onError('Eso no es una imagen. Elige fotos JPG, PNG o WEBP.')
      return
    }
    const room = MAX_PHOTOS - photos.value.length
    if (files.length > room) onError(`Máximo ${MAX_PHOTOS} fotos por producto.`)
    files.slice(0, Math.max(room, 0)).forEach((file) => {
      const id = newId()
      photos.value.push({
        id,
        preview: URL.createObjectURL(file),
        url: '',
        progress: 0,
        status: 'uploading',
        file,
      })
      queue.push(id)
    })
    pump()
  }

  /** Links pegados (uno por línea o separados por espacios). Solo https: la tienda va con https. */
  function addUrls(text: string): number {
    const found = text.split(/[\s,]+/).filter((t) => /^https:\/\/\S+$/i.test(t))
    const fresh = found.filter((u) => !photos.value.some((p) => p.url === u))
    if (!found.length) {
      onError('Pega links que empiecen con https://')
      return 0
    }
    fresh.slice(0, MAX_PHOTOS - photos.value.length).forEach((url) => {
      photos.value.push({ id: newId(), preview: url, url, progress: 100, status: 'done' })
    })
    return fresh.length
  }

  function remove(id: string) {
    const photo = find(id)
    if (photo?.preview.startsWith('blob:')) URL.revokeObjectURL(photo.preview)
    photos.value = photos.value.filter((p) => p.id !== id)
  }

  function makeCover(id: string) {
    const photo = find(id)
    if (!photo) return
    photos.value = [photo, ...photos.value.filter((p) => p.id !== id)]
  }

  function retry(id: string) {
    if (!find(id)?.file) return
    queue.push(id)
    pump()
  }

  /** Reconstruye las fotos ya subidas desde el borrador local. */
  function restore(list: string[]) {
    photos.value = list.map((url) => ({ id: newId(), preview: url, url, progress: 100, status: 'done' }))
  }

  function clear() {
    photos.value.forEach((p) => p.preview.startsWith('blob:') && URL.revokeObjectURL(p.preview))
    photos.value = []
    queue.length = 0
  }

  return { photos, urls, uploading, failed, full, addFiles, addUrls, remove, makeCover, retry, restore, clear }
}
