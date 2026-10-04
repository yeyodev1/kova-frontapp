<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{ src?: string; size?: string }>(), { src: '', size: '2.5rem' })

// Si el servicio de íconos no responde, queda el ícono genérico en vez de una imagen rota.
const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
</script>

<template>
  <span class="bank-logo" :style="{ width: size, height: size }" aria-hidden="true">
    <img v-if="src && !failed" :src="src" alt="" loading="lazy" referrerpolicy="no-referrer" @error="failed = true" />
    <i v-else class="fa-solid fa-building-columns"></i>
  </span>
</template>

<style scoped lang="scss">
.bank-logo {
  @include flex(row, center, center);
  flex-shrink: 0;
  border-radius: 10px;
  background: $surface;
  border: 1px solid $line;
  overflow: hidden;
  color: $accent;

  img {
    width: 70%;
    height: 70%;
    object-fit: contain;
  }

  i {
    font-size: 0.95rem;
  }
}
</style>
