<script setup lang="ts">
import { ref } from 'vue'
import { orderCopy } from '@/config/site'
import { storeService } from '@/services/store.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Order } from '@/types'

const props = defineProps<{ number: string; phone: string }>()
const emit = defineEmits<{ uploaded: [order: Order] }>()

const toast = useToastStore()
const uploading = ref(false)
const done = ref(false)
const input = ref<HTMLInputElement | null>(null)

async function onFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || uploading.value) return
  uploading.value = true
  try {
    const order = await storeService.uploadReceipt(props.number, props.phone, file)
    done.value = true
    toast.success(orderCopy.uploaded)
    emit('uploaded', order)
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    uploading.value = false
    if (input.value) input.value.value = ''
  }
}
</script>

<template>
  <div class="up">
    <p v-if="done" class="up__done" role="status">
      <i class="fa-solid fa-circle-check" aria-hidden="true"></i> {{ orderCopy.uploaded }}
    </p>
    <template v-else>
      <h3 class="up__title">{{ orderCopy.uploadTitle }}</h3>
      <p class="up__text">{{ orderCopy.uploadText }}</p>
      <label class="btn btn--primary btn--lg btn--block up__btn" :class="{ 'up__btn--busy': uploading }">
        <i :class="uploading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-upload'" aria-hidden="true"></i>
        {{ uploading ? orderCopy.uploading : orderCopy.uploadCta }}
        <input
          ref="input"
          type="file"
          accept="image/*,application/pdf"
          class="visually-hidden"
          :disabled="uploading"
          @change="onFile"
        />
      </label>
    </template>
  </div>
</template>

<style scoped lang="scss">
.up {
  @include flex(column, stretch, flex-start, 0.45rem);

  &__title {
    font-size: $text-lg;
    font-weight: 600;
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__btn {
    margin: 0.3rem 0 0;
    color: $surface;
    cursor: pointer;

    &:has(input:focus-visible) {
      outline: 2px solid $accent-deep;
      outline-offset: 3px;
    }

    &--busy {
      opacity: 0.7;
      pointer-events: none;
    }
  }

  &__done {
    @include flex(row, flex-start, flex-start, 0.5rem);
    padding: 0.9rem 1rem;
    border-radius: $radius-sm;
    background: $success-bg;
    color: darken($success, 10%);
    font-size: $text-sm;
    font-weight: 500;

    i {
      margin-top: 0.2rem;
    }
  }
}
</style>
