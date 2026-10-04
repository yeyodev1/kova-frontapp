<script setup lang="ts">
import { whatsappLink, layoutCopy } from '@/config/site'

defineProps<{ raised?: boolean }>()
</script>

<template>
  <a
    class="wa"
    :class="{ 'wa--raised': raised }"
    :href="whatsappLink()"
    target="_blank"
    rel="noopener"
    :aria-label="layoutCopy.whatsappFloat"
    :title="layoutCopy.whatsappFloat"
  >
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
  </a>
</template>

<style scoped lang="scss">
.wa {
  position: fixed;
  right: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 80;
  @include flex(row, center, center);
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 50%;
  background: #1f9d55;
  color: $surface;
  font-size: 1.75rem;
  box-shadow: 0 10px 24px rgba(#1f9d55, 0.35);
  @include transition(transform);

  &:hover {
    transform: scale(1.06);
  }

  @include focus-ring($accent-deep);

  &--raised {
    @include until('md') {
      bottom: calc(5.75rem + env(safe-area-inset-bottom));
    }
  }
}
</style>
