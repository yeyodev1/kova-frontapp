/**
 * Achica la foto en el navegador antes de subirla: una foto de celular pesa 3-8 MB y con datos
 * móviles tarda; a 1600px en JPEG 0.85 queda en ~300 KB y en la tienda se ve igual.
 * Si algo falla (formato raro, HEIC sin soporte) se sube el archivo original.
 */
export async function compressImage(file: File, max = 1600, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file
  }
  try {
    const source = await decode(file)
    const scale = Math.min(1, max / Math.max(source.width, source.height))
    const width = Math.round(source.width * scale)
    const height = Math.round(source.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    // Fondo blanco: un PNG con transparencia pasado a JPEG quedaría con fondo negro.
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(source.image, 0, 0, width, height)
    source.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) return file
    // Una foto ya chica puede crecer al recomprimir: gana la más liviana.
    return blob.size < file.size ? blob : file
  } catch {
    return file
  }
}

interface Decoded {
  image: CanvasImageSource
  width: number
  height: number
  close: () => void
}

async function decode(file: File): Promise<Decoded> {
  if ('createImageBitmap' in window) {
    // from-image respeta la rotación EXIF de las fotos tomadas con el celular.
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    return { image: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() }
  }
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.src = url
  await img.decode()
  return {
    image: img,
    width: img.naturalWidth,
    height: img.naturalHeight,
    close: () => URL.revokeObjectURL(url),
  }
}
