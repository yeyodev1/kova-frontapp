<script setup lang="ts">
import AdminToggle from '@/components/admin/AdminToggle.vue'
import { botChatCopy as copy } from './chatCopy'

defineProps<{ live: boolean; updated: string; loading: boolean }>()
const showDecisions = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="cctl">
    <p class="cctl__live" :class="{ 'cctl__live--on': live }" aria-live="off">
      <span class="cctl__dot" :class="{ 'cctl__dot--busy': loading }" aria-hidden="true"></span>
      {{ live ? copy.live : copy.paused }}
      <small v-if="updated">{{ copy.updated(updated) }}</small>
    </p>
    <AdminToggle v-model="showDecisions" :label="copy.decisions" />
  </div>
</template>

<style scoped lang="scss">
.cctl {
  position: sticky;
  top: 58px;
  z-index: 5;
  @include flex(row, center, space-between, 0.5rem 1rem);
  flex-wrap: wrap;
  padding: 0.5rem 0.75rem;
  border-radius: 14px;
  background: rgba($surface, 0.9);
  backdrop-filter: blur(12px) saturate(1.3);
  border: 1px solid $line;
  box-shadow: $shadow-sm;

  @include from('md') {
    top: 0.75rem;
  }

  &__live {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-sm;
    font-weight: 700;
    color: $ink-muted;

    small {
      display: none;
      font-family: $font-mono;
      font-size: 0.66rem;
      font-weight: 500;

      @include from('sm') {
        display: inline;
      }
    }

    &--on {
      color: $accent-deep;
    }
  }

  &__dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: $alu-dark;
  }

  &__live--on &__dot {
    background: $success;
    box-shadow: 0 0 0 3px rgba($success, 0.2);
  }

  &__dot--busy {
    animation: cctl-pulse 0.9s ease-in-out infinite alternate;
  }

  @include reduced-motion {
    &__dot--busy {
      animation: none;
    }
  }
}

@keyframes cctl-pulse {
  to {
    opacity: 0.35;
  }
}
</style>
