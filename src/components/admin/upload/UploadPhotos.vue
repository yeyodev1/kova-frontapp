<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import UploadThumbs from './UploadThumbs.vue'
import type { useUploadPhotos } from '@/composables/admin/useUploadPhotos'

const props = defineProps<{ photos: ReturnType<typeof useUploadPhotos>; error?: string }>()

const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const showLinks = ref(false)
const links = ref('')

function onPick(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files?.length) props.photos.addFiles(files)
  if (input.value) input.value.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) props.photos.addFiles(files)
  else {
    const text = e.dataTransfer?.getData('text/uri-list') || e.dataTransfer?.getData('text/plain')
    if (text) props.photos.addUrls(text)
  }
}

// Ctrl+V con una foto copiada (captura, imagen de WhatsApp Web) la agrega sin abrir nada.
function onPaste(e: ClipboardEvent) {
  const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'))
  if (!files.length) return
  e.preventDefault()
  props.photos.addFiles(files)
}

function addLinks() {
  if (props.photos.addUrls(links.value)) {
    links.value = ''
    showLinks.value = false
  }
}

onMounted(() => window.addEventListener('paste', onPaste))
onBeforeUnmount(() => window.removeEventListener('paste', onPaste))
</script>

<template>
  <section class="photos" aria-labelledby="up-photos">
    <h2 id="up-photos" class="photos__label">Fotos</h2>

    <button
      v-if="!photos.full.value"
      type="button"
      class="photos__drop"
      :class="{ 'photos__drop--over': dragging, 'photos__drop--small': photos.photos.value.length, 'photos__drop--error': error }"
      @click="input?.click()"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <i class="fa-solid fa-camera"></i>
      <strong>{{ photos.photos.value.length ? 'Agregar más fotos' : 'Toca para agregar fotos' }}</strong>
      <span v-if="!photos.photos.value.length">Cámara o galería. También puedes arrastrar o pegar.</span>
    </button>
    <input ref="input" type="file" accept="image/*" multiple hidden @change="onPick" />

    <p v-if="error" class="photos__error" role="alert">{{ error }}</p>

    <UploadThumbs :photos="photos" />

    <button v-if="!showLinks" type="button" class="photos__toggle" @click="showLinks = true">
      <i class="fa-solid fa-link"></i> o pega links de fotos
    </button>
    <div v-else class="photos__links">
      <label for="up-links" class="visually-hidden">Links de fotos</label>
      <textarea
        id="up-links"
        v-model="links"
        rows="2"
        placeholder="https://… (uno por línea)"
        @keydown.enter.exact.prevent="addLinks"
      ></textarea>
      <button type="button" class="photos__add" :disabled="!links.trim()" @click="addLinks">Agregar</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.photos {
  @include flex(column, stretch, flex-start, 0.7rem);

  &__label {
    @include eyebrow;
  }

  &__drop {
    @include flex(column, center, center, 0.35rem);
    min-height: 168px;
    padding: 1.2rem;
    border: 2px dashed $alu-dark;
    border-radius: $radius-md;
    background: $alu-light;
    color: $ink-soft;
    text-align: center;
    @include transition(border-color);
    -webkit-tap-highlight-color: transparent;

    i {
      font-size: 1.8rem;
      color: $accent;
      margin-bottom: 0.2rem;
    }

    strong {
      font-size: 1.05rem;
      color: $ink;
    }

    span {
      font-size: $text-sm;
      color: $ink-muted;
    }

    &:active {
      transform: scale(0.99);
    }

    &--over {
      border-color: $accent;
      background: $accent-soft;
    }

    &--small {
      flex-direction: row;
      min-height: 52px;
      gap: 0.6rem;
      padding: 0.6rem 1rem;

      i {
        font-size: 1.1rem;
        margin: 0;
      }

      strong {
        font-size: 0.95rem;
      }
    }

    &--error {
      border-color: $danger;
    }
  }

  &__error {
    font-size: $text-sm;
    color: $danger;
    font-weight: 500;
  }

  &__toggle {
    align-self: flex-start;
    min-height: 44px;
    font-size: $text-sm;
    color: $accent;
    font-weight: 600;

    i {
      margin-right: 0.3rem;
    }
  }

  &__links {
    @include flex(row, stretch, flex-start, 0.5rem);

    textarea {
      flex: 1;
      min-width: 0;
      resize: vertical;
    }
  }

  &__add {
    flex: 0 0 auto;
    min-width: 88px;
    min-height: 44px;
    border-radius: $radius-sm;
    background: $accent;
    color: $surface;
    font-weight: 600;

    &:disabled {
      opacity: 0.45;
    }
  }
}
</style>
