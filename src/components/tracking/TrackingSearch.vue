<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { trackingCopy } from '@/config/site'
import { useTracking } from '@/composables/useTracking'
import TrackingForm from './TrackingForm.vue'
import TrackingNotFound from './TrackingNotFound.vue'
import TrackingIllustration from './TrackingIllustration.vue'

const { notFound, error } = useTracking()
const formRef = ref<InstanceType<typeof TrackingForm> | null>(null)

async function retry() {
  await nextTick()
  formRef.value?.focus()
}
</script>

<template>
  <section class="ts">
    <div class="ts__main">
      <header v-reveal class="ts__head">
        <p class="ts__eyebrow">{{ trackingCopy.eyebrow }}</p>
        <h1 class="ts__title">{{ trackingCopy.title }}</h1>
        <p class="ts__lead">{{ trackingCopy.lead }}</p>
      </header>

      <div v-reveal="80" class="ts__form">
        <TrackingForm ref="formRef" />
      </div>

      <Transition name="rise">
        <div v-if="notFound || error" class="ts__error">
          <TrackingNotFound @retry="retry" />
        </div>
      </Transition>
    </div>

    <aside class="ts__aside">
      <div class="ts__art">
        <TrackingIllustration />
      </div>

      <div v-reveal="140" class="ts__where">
        <h2 class="ts__where-title">{{ trackingCopy.whereTitle }}</h2>
        <ul class="ts__list">
          <li v-for="item in trackingCopy.where" :key="item.text" class="ts__item">
            <span class="ts__item-icon" aria-hidden="true"><i :class="item.icon"></i></span>
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
    </aside>
  </section>
</template>

<style scoped lang="scss">
.ts {
  @include flex(column, stretch, flex-start, 1.25rem);

  // En el celular las dos columnas se disuelven y ordenamos las piezas:
  // ilustración, titular, formulario, aviso, ayuda.
  &__main,
  &__aside {
    display: contents;
  }

  &__art {
    order: 0;
    height: 10.5rem;
  }

  &__head {
    order: 1;
    @include flex(column, flex-start, flex-start, 0.6rem);
  }

  &__form {
    order: 2;
  }

  &__error {
    order: 3;
  }

  &__where {
    order: 4;
    padding: 1.15rem 1.1rem;
    border-radius: 20px;
    background: rgba($surface, 0.55);
    border: 1px solid $line;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md, 820, 122%);
  }

  &__lead {
    max-width: 34rem;
    color: $ink-soft;
    font-size: $text-base;
    line-height: 1.55;
  }

  &__where-title {
    @include display($text-base, 740, 110%);
    margin-bottom: 0.85rem;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.75rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    font-size: $text-sm;
    color: $ink-soft;
    line-height: 1.4;
  }

  &__item-icon {
    @include plinth(10px);
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    color: $accent-deep;
    font-size: 0.9rem;
  }

  @include from('lg') {
    flex-direction: row;
    align-items: flex-start;
    gap: clamp(2.5rem, 5vw, 4.5rem);

    &__main,
    &__aside {
      @include flex(column, stretch, flex-start, 1.5rem);
    }

    &__main {
      flex: 1 1 54%;
      min-width: 0;
    }

    &__aside {
      flex: 0 0 40%;
      padding-top: 0.5rem;
    }

    &__art {
      height: 19rem;
    }

    &__head {
      gap: 0.9rem;
    }
  }
}
</style>
