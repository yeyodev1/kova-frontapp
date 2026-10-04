<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { orderCopy } from '@/config/site'
import { storeService } from '@/services/store.service'
import { useToastStore } from '@/stores/toast'
import ReceiptDropzone from './ReceiptDropzone.vue'
import type { ApiError, Order } from '@/types'

const props = defineProps<{ number: string; phone: string }>()
const emit = defineEmits<{ uploaded: [order: Order] }>()

const toast = useToastStore()
const file = ref<File | null>(null)
const preview = ref('')
const uploading = ref(false)
const done = ref(false)
const error = ref('')

const isImage = computed(() => !!file.value?.type.startsWith('image/'))
const sizeLabel = computed(() => (file.value ? `${(file.value.size / 1024 / 1024).toFixed(1)} MB` : ''))

function clearPreview() {
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = ''
}

function pick(candidate: File | undefined | null) {
  if (!candidate) return
  if (!candidate.type.startsWith('image/') && candidate.type !== 'application/pdf') {
    error.value = orderCopy.uploadInvalid
    return
  }
  error.value = ''
  clearPreview()
  file.value = candidate
  if (candidate.type.startsWith('image/')) preview.value = URL.createObjectURL(candidate)
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  pick(target.files?.[0])
  target.value = ''
}

async function send() {
  if (!file.value || uploading.value) return
  uploading.value = true
  error.value = ''
  try {
    const order = await storeService.uploadReceipt(props.number, props.phone, file.value)
    done.value = true
    clearPreview()
    toast.success(orderCopy.uploaded)
    emit('uploaded', order)
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    uploading.value = false
  }
}

onBeforeUnmount(clearPreview)
</script>

<template>
  <div class="up">
    <p v-if="done" class="up__done" role="status">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i> {{ orderCopy.uploaded }}
    </p>

    <template v-else>
      <div class="up__head">
        <h3 class="up__title">{{ orderCopy.uploadTitle }}</h3>
        <p class="up__text">{{ orderCopy.uploadText }}</p>
      </div>

      <ReceiptDropzone v-if="!file" @pick="pick" />

      <div v-else class="up__file" :aria-busy="uploading">
        <span class="up__thumb">
          <img v-if="isImage && preview" :src="preview" alt="" />
          <i v-else class="fa-solid fa-file-pdf" aria-hidden="true"></i>
        </span>
        <span class="up__meta">
          <strong>{{ file.name }}</strong>
          <small>{{ sizeLabel }}</small>
          <span v-if="uploading" class="up__progress" role="progressbar" :aria-label="orderCopy.uploading">
            <span class="up__bar"></span>
          </span>
        </span>
        <label v-if="!uploading" class="up__change">
          {{ orderCopy.uploadChange }}
          <input type="file" accept="image/*,application/pdf" class="visually-hidden" @change="onChange" />
        </label>
      </div>

      <p v-if="error" class="up__error" role="alert">
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
      </p>

      <button v-if="file" type="button" class="btn btn--primary btn--lg btn--block" :aria-busy="uploading" @click="send">
        <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'" aria-hidden="true"></i>
        {{ uploading ? orderCopy.uploading : orderCopy.uploadSend }}
      </button>
    </template>
  </div>
</template>

<style scoped lang="scss">
.up {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__title {
    @include display($text-lg, 760, 112%);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.2rem;
  }

  &__file {
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0.75rem;
    border: 1px solid $line;
    border-radius: 16px;
    background: $surface;
    animation: rise $dur $ease-out both;
  }

  &__thumb {
    @include plinth(12px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 3.75rem;
    height: 3.75rem;
    color: $danger;
    font-size: 1.4rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      mix-blend-mode: normal;
    }
  }

  &__meta {
    @include flex(column, stretch, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;

    strong {
      font-size: $text-sm;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    small {
      font-family: $font-mono;
      font-size: $text-xs;
      color: $ink-muted;
    }
  }

  // Progreso indeterminado: el API no reporta avance, pero sí se ve que trabaja.
  &__progress {
    position: relative;
    height: 4px;
    margin-top: 0.35rem;
    border-radius: 4px;
    background: $sand;
    overflow: hidden;
  }

  &__bar {
    position: absolute;
    inset: 0;
    width: 40%;
    border-radius: 4px;
    background: $accent;
    animation: up-slide 1.1s $ease-out infinite;
  }

  &__change {
    margin: 0;
    flex-shrink: 0;
    padding: 0.5rem 0.75rem;
    min-height: 2.75rem;
    @include flex(row, center, center);
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 700;
    color: $accent-deep;
    cursor: pointer;

    &:has(input:focus-visible) {
      outline: 2px solid $accent;
    }
  }

  &__error {
    @include flex(row, baseline, flex-start, 0.45rem);
    font-size: $text-sm;
    color: darken($danger, 6%);
  }

  &__done {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 1rem;
    border-radius: 14px;
    background: $success-bg;
    color: darken($success, 10%);
    font-size: $text-sm;
    font-weight: 600;
    animation: rise $dur $ease-out both;

    i {
      margin-top: 0.2rem;
      animation: pop 0.4s 0.1s $ease-spring both;
    }
  }
}

@keyframes up-slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}
</style>
