<script setup lang="ts">
defineProps<{ id: string; label: string; error?: string; hint?: string }>()
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label :for="id">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>
