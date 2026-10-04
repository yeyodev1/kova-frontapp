<script setup lang="ts">
import { ref } from 'vue'
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'

const props = defineProps<{ images: string[]; uploading: boolean }>()
const emit = defineEmits<{ upload: [file: File] }>()

const input = ref<HTMLInputElement | null>(null)

function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= props.images.length) return
  const tmp = props.images[i] as string
  props.images[i] = props.images[j] as string
  props.images[j] = tmp
}

function onFiles(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) Array.from(files).forEach((f) => emit('upload', f))
  if (input.value) input.value.value = ''
}
</script>

<template>
  <AdminPanel title="Imágenes" icon="fa-regular fa-images">
    <template #actions>
      <AdminButton variant="soft" icon="fa-solid fa-upload" :loading="uploading" @click="input?.click()">
        Subir
      </AdminButton>
      <input ref="input" type="file" accept="image/*" multiple hidden @change="onFiles" />
    </template>

    <p v-if="!images.length" class="imgs__empty">Sin imágenes. La primera es la portada del producto.</p>

    <div class="imgs">
      <figure v-for="(src, i) in images" :key="src" class="imgs__item">
        <img :src="src" :alt="`Imagen ${i + 1}`" loading="lazy" />
        <span v-if="i === 0" class="imgs__cover">Portada</span>
        <figcaption class="imgs__ctrl">
          <button type="button" :disabled="i === 0" aria-label="Mover a la izquierda" @click="move(i, -1)">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" :disabled="i === images.length - 1" aria-label="Mover a la derecha" @click="move(i, 1)">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button type="button" class="imgs__del" aria-label="Quitar imagen" @click="images.splice(i, 1)">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </figcaption>
      </figure>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.imgs {
  @include flex-cards(130px, 0.6rem);

  > * {
    max-width: 50%;

    @include from('sm') {
      max-width: 200px;
    }
  }

  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 0.5rem;
  }

  &__item {
    position: relative;
    border: 1px solid $line;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $paper;

    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }

  &__cover {
    position: absolute;
    top: 0.4rem;
    left: 0.4rem;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 0.2rem 0.45rem;
    border-radius: $radius-pill;
    background: $accent;
    color: $surface;
  }

  &__ctrl {
    @include flex(row, center, space-between);
    background: $surface;
    border-top: 1px solid $line;

    button {
      flex: 1;
      height: 2.3rem;
      color: $ink-soft;

      &:disabled {
        opacity: 0.3;
      }
    }
  }

  &__del {
    color: $danger !important;
  }
}
</style>
