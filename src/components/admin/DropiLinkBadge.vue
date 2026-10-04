<script setup lang="ts">
import AdminStatusChip from './AdminStatusChip.vue'

defineProps<{ linked: boolean; compact?: boolean }>()
</script>

<template>
  <AdminStatusChip
    :label="compact ? (linked ? 'Dropi' : 'Sin enlazar') : linked ? 'Enlazado a Dropi' : 'Sin enlazar'"
    :tone="linked ? 'accent' : 'warning'"
    :icon="linked ? 'fa-solid fa-link' : 'fa-solid fa-link-slash'"
  />
</template>
