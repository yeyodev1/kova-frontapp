<script setup lang="ts">
import { computed } from 'vue'
import { statusLabel, statusTone, type Tone } from './orderLabels'

const props = defineProps<{ status?: string; label?: string; tone?: Tone; icon?: string }>()

const text = computed(() => props.label ?? statusLabel(props.status ?? ''))
const color = computed(() => props.tone ?? statusTone(props.status ?? ''))
</script>

<template>
  <span class="chip" :class="`chip--${color}`">
    <i v-if="icon" :class="icon"></i>
    {{ text }}
  </span>
</template>

<style scoped lang="scss">
.chip {
  @include flex(row, center, flex-start, 0.35rem);
  display: inline-flex;
  font-size: $text-xs;
  font-weight: 600;
  line-height: 1;
  padding: 0.38rem 0.62rem;
  border-radius: $radius-pill;
  white-space: nowrap;
  background: $sand;
  color: $ink-soft;

  &--success {
    background: $success-bg;
    color: darken($success, 8%);
  }
  &--warning {
    background: $warning-bg;
    color: darken($warning, 22%);
  }
  &--danger {
    background: $danger-bg;
    color: $danger;
  }
  &--info {
    background: $info-bg;
    color: darken($info, 12%);
  }
  &--accent {
    background: $accent-soft;
    color: $accent-deep;
  }
}
</style>
