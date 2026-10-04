<script setup lang="ts">
import { checkoutCopy } from '@/config/site'
import { formatCents } from '@/utils/format'
import TrustSeals from '@/components/store/TrustSeals.vue'

defineProps<{ total: number; processing: boolean; disabled?: boolean }>()
</script>

<template>
  <div class="submit">
    <div class="submit__bar">
      <button type="submit" class="btn btn--cta btn--lg btn--block" :disabled="processing || disabled" :aria-busy="processing">
        <template v-if="processing">
          <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> {{ checkoutCopy.processing }}
        </template>
        <template v-else>
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          {{ checkoutCopy.confirm }}<template v-if="total"> · {{ formatCents(total) }}</template>
        </template>
      </button>
    </div>
    <TrustSeals class="submit__seals" />
  </div>
</template>

<style scoped lang="scss">
.submit {
  @include flex(column, stretch, flex-start, 0.8rem);

  // En móvil el botón queda fijo abajo: siempre a un toque de confirmar.
  &__bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
    padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-bottom));
    background: rgba($surface, 0.97);
    backdrop-filter: blur(8px);
    border-top: 1px solid $line;
    box-shadow: 0 -10px 30px rgba($ink, 0.08);

    @include from('md') {
      position: static;
      padding: 0;
      background: none;
      border: none;
      box-shadow: none;
      backdrop-filter: none;
    }
  }

  &__seals {
    justify-content: center;
  }
}
</style>
