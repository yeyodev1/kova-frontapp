<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'danger' | 'cta' | 'whatsapp' | 'soft'
    icon?: string
    loading?: boolean
    disabled?: boolean
    to?: string
    href?: string
    type?: 'button' | 'submit'
    block?: boolean
  }>(),
  { variant: 'ghost', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: '_blank', rel: 'noopener' }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" class="abtn" :class="[`abtn--${variant}`, { 'abtn--block': block }]">
    <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
    <i v-else-if="icon" :class="icon"></i>
    <span v-if="$slots.default"><slot /></span>
  </component>
</template>

<style scoped lang="scss">
.abtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.5rem;
  padding: 0.55rem 1rem;
  border-radius: $radius-pill;
  font-size: $text-sm;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
  @include transition(background);

  &--block {
    width: 100%;
  }

  &--primary {
    background: $accent;
    color: $surface;
    &:hover {
      background: $accent-deep;
    }
  }

  &--cta {
    background: $cta;
    color: $surface;
    &:hover {
      background: $cta-deep;
    }
  }

  &--ghost {
    border-color: $line;
    background: $surface;
    color: $ink;
    &:hover {
      border-color: $accent;
    }
  }

  &--soft {
    background: $accent-soft;
    color: $accent-deep;
  }

  &--danger {
    border-color: rgba($danger, 0.4);
    background: $surface;
    color: $danger;
    &:hover {
      background: $danger-bg;
    }
  }

  &--whatsapp {
    background: #25d366;
    color: #fff;
    &:hover {
      background: #1fb457;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
