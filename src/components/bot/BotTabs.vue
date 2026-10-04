<script setup lang="ts">
defineProps<{
  tabs: { value: string; label: string; icon: string }[]
  modelValue: string
  counts?: Record<string, number>
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="btabs" role="tablist">
    <button
      v-for="tab in tabs"
      :id="`bot-tab-${tab.value}`"
      :key="tab.value"
      type="button"
      role="tab"
      class="btabs__tab"
      :class="{ 'btabs__tab--active': tab.value === modelValue }"
      :aria-selected="tab.value === modelValue"
      :aria-controls="`bot-panel-${tab.value}`"
      @click="emit('update:modelValue', tab.value)"
    >
      <i :class="tab.icon" aria-hidden="true"></i>
      <span>{{ tab.label }}</span>
      <span v-if="counts?.[tab.value]" class="btabs__count">{{ counts[tab.value] }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.btabs {
  @include flex(row, stretch, flex-start, 0.25rem);
  padding: 0.25rem;
  border-radius: 14px;
  background: $sand;
  overflow-x: auto;
  scrollbar-width: none;

  &__tab {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring;
    flex: 1 0 auto;
    min-height: 2.6rem;
    padding: 0.45rem 0.85rem;
    border-radius: 11px;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    white-space: nowrap;
    transition:
      background-color $dur-fast ease,
      color $dur-fast ease;

    i {
      font-size: 0.85rem;
      color: $ink-muted;
    }

    &:hover {
      color: $ink;
    }

    &--active {
      background: $surface;
      color: $accent-deep;
      box-shadow: $shadow-sm;

      i {
        color: $accent;
      }
    }
  }

  &__count {
    min-width: 1.2rem;
    height: 1.2rem;
    padding-inline: 0.3rem;
    border-radius: $radius-pill;
    background: $cta;
    color: #fff;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 700;
    line-height: 1.2rem;
    text-align: center;
  }

  @include from('md') {
    align-self: flex-start;

    &__tab {
      flex: 0 0 auto;
    }
  }
}
</style>
