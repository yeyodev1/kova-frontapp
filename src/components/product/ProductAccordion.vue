<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'

/**
 * Acordeón con altura animada. La altura se anima con la Web Animations API
 * (medida real del contenido), y el contenido entra con opacity/transform.
 * `expanded` cambia al instante (ícono, aria); `rendered` espera a que termine el cierre.
 */
const props = defineProps<{ title: string; open?: boolean; size?: 'md' | 'lg' }>()

const expanded = ref(Boolean(props.open))
const rendered = ref(expanded.value)
const body = ref<HTMLElement | null>(null)
const id = useId()
let running: Animation | null = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

async function toggle() {
  expanded.value = !expanded.value
  running?.cancel()
  if (reduced()) {
    rendered.value = expanded.value
    return
  }
  if (expanded.value) {
    rendered.value = true
    await nextTick()
    const el = body.value
    if (!el) return
    running = el.animate(
      { height: ['0px', `${el.scrollHeight}px`] },
      { duration: 340, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    )
    return
  }
  const el = body.value
  if (!el) return
  running = el.animate(
    { height: [`${el.scrollHeight}px`, '0px'], opacity: [1, 0.4] },
    { duration: 260, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  )
  running.onfinish = () => {
    if (!expanded.value) rendered.value = false
  }
}
</script>

<template>
  <div class="acc" :class="[{ 'acc--open': expanded }, `acc--${size || 'md'}`]">
    <h3 class="acc__head">
      <button class="acc__toggle" :aria-expanded="expanded" :aria-controls="id" @click="toggle">
        <span>{{ title }}</span>
        <span class="acc__icon" aria-hidden="true"><i class="fa-solid fa-plus"></i></span>
      </button>
    </h3>
    <div :id="id" ref="body" class="acc__body" :hidden="!rendered">
      <div class="acc__inner"><slot /></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.acc {
  border-bottom: 1px solid $line;

  &__head {
    font: inherit;
  }

  &__toggle {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    min-height: 3.6rem;
    padding: 1rem 0.1rem;
    text-align: left;
    font-weight: 700;
    font-size: $text-base;
    line-height: 1.35;
    color: $ink;
  }

  &--lg &__toggle {
    @include display($text-lg, 750, 115%);
    min-height: 4rem;
  }

  &__icon {
    flex-shrink: 0;
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $surface;
    box-shadow: inset 0 0 0 1px $line;
    color: $accent;
    font-size: 0.75rem;
    transition: transform $dur $ease-spring;
  }

  &--open &__icon {
    transform: rotate(135deg);
  }

  &__body {
    overflow: hidden;
  }

  &__inner {
    padding: 0 0.1rem 1.25rem;
    color: $ink-soft;
    animation: acc-in $dur-slow $ease-out both;
  }

  @include reduced-motion {
    &__icon {
      transition: none;
    }
  }
}

@keyframes acc-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
</style>
