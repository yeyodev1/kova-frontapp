<script setup lang="ts">
defineProps<{ modelValue: string; placeholder: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <label class="bsearch">
    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
    <span class="visually-hidden">{{ placeholder }}</span>
    <input
      :value="modelValue"
      type="search"
      inputmode="search"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<style scoped lang="scss">
.bsearch {
  position: relative;
  flex: 1 1 16rem;
  min-width: 0;
  margin: 0;

  i {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: $ink-muted;
    font-size: 0.85rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding-left: 2.4rem;
  }
}
</style>
