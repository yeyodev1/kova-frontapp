<script setup lang="ts">
import { useStoreSettings } from '@/composables/useStoreSettings'

const { announcement } = useStoreSettings()
</script>

<template>
  <div v-if="announcement" class="announce" role="note">
    <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
    <span>{{ announcement }}</span>
  </div>
</template>

<style scoped lang="scss">
.announce {
  @include flex(row, center, center, 0.5rem);
  background: $accent-deep;
  color: $surface;
  font-size: $text-xs;
  font-weight: 500;
  text-align: center;
  padding: 0.5rem 1rem;
  line-height: 1.4;

  i {
    color: $silver;
  }
}
</style>
