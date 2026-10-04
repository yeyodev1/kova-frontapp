<script setup lang="ts">
import { trackingCopy } from '@/config/site'
import { useTracking } from '@/composables/useTracking'

const emit = defineEmits<{ another: [] }>()
const { whatsapp } = useTracking()
</script>

<template>
  <section class="th">
    <div class="th__copy">
      <span class="th__icon" aria-hidden="true"><i class="fa-solid fa-headset"></i></span>
      <div>
        <h2 class="th__title">{{ trackingCopy.helpTitle }}</h2>
        <p class="th__text">{{ trackingCopy.helpText }}</p>
      </div>
    </div>
    <div class="th__actions">
      <a :href="whatsapp" class="btn btn--whatsapp btn--lg th__wa" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ trackingCopy.whatsappCta }}
      </a>
      <button type="button" class="th__another" @click="emit('another')">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> {{ trackingCopy.another }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.th {
  @include moss;
  @include flex(column, stretch, flex-start, 1.25rem);
  padding: 1.5rem 1.2rem;
  border-radius: 24px;

  &__copy {
    @include flex(row, center, flex-start, 0.9rem);
  }

  &__icon {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.9rem;
    height: 2.9rem;
    border-radius: 14px;
    background: rgba(#fff, 0.08);
    box-shadow: inset 0 0 0 1px rgba(#fff, 0.14);
    color: $sage;
    font-size: 1.1rem;
  }

  &__title {
    @include display($text-lg, 760, 112%);
    color: #fff;
  }

  &__text {
    margin-top: 0.2rem;
    font-size: $text-sm;
    color: rgba(#fff, 0.72);
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__wa {
    box-shadow: 0 12px 26px -12px rgba(#000, 0.6);
  }

  &__another {
    @include flex(row, center, center, 0.5rem);
    @include focus-ring($sage);
    min-height: 3rem;
    padding: 0.6rem 1rem;
    border-radius: 14px;
    color: #fff;
    font-weight: 700;
    font-size: 0.92rem;
    transition: background-color $dur $ease-out;

    &:hover {
      background: rgba(#fff, 0.08);
    }
  }

  @include from('md') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.6rem 1.8rem;

    &__actions {
      flex-direction: row;
      align-items: center;
      flex-shrink: 0;
    }
  }
}
</style>
