<script setup lang="ts">
import { ref, useId } from 'vue'
import type { Faq } from '@/types'

defineProps<{ items: Faq[] }>()

const uid = useId()
const open = ref(new Set<number>())

function toggle(i: number) {
  const next = new Set(open.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  open.value = next
}

// Altura animada: de 0 a la altura real del contenido, y de vuelta a "auto" al terminar.
function setHeight(el: Element, value: string) {
  const node = el as HTMLElement
  node.style.height = value
}

function onEnter(el: Element) {
  setHeight(el, '0px')
  void (el as HTMLElement).offsetHeight
  setHeight(el, `${el.scrollHeight}px`)
}

function onLeave(el: Element) {
  setHeight(el, `${el.scrollHeight}px`)
  void (el as HTMLElement).offsetHeight
  setHeight(el, '0px')
}

function clear(el: Element) {
  setHeight(el, '')
}
</script>

<template>
  <div class="faqs">
    <div
      v-for="(faq, i) in items"
      :key="faq.question"
      v-reveal="Math.min(i, 5) * 60"
      class="faq"
      :class="{ 'is-open': open.has(i) }"
    >
      <h3 class="faq__heading">
        <button
          :id="`${uid}-q${i}`"
          type="button"
          class="faq__question"
          :aria-expanded="open.has(i)"
          :aria-controls="`${uid}-a${i}`"
          @click="toggle(i)"
        >
          <span>{{ faq.question }}</span>
          <span class="faq__sign" aria-hidden="true"></span>
        </button>
      </h3>
      <Transition name="acc" @enter="onEnter" @after-enter="clear" @leave="onLeave" @after-leave="clear">
        <div
          v-if="open.has(i)"
          :id="`${uid}-a${i}`"
          class="faq__panel"
          role="region"
          :aria-labelledby="`${uid}-q${i}`"
        >
          <p class="faq__answer">{{ faq.answer }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.faqs {
  @include flex(column, stretch, flex-start, 0.6rem);
}

.faq {
  background: $surface;
  border: 1px solid $line;
  border-radius: $radius-md;
  transition:
    border-color $dur $ease-out,
    box-shadow $dur $ease-out;

  &.is-open {
    border-color: $alu-dark;
    box-shadow: $shadow-sm;
  }

  &__heading {
    font: inherit;
  }

  &__question {
    @include flex(row, center, space-between, 1rem);
    width: 100%;
    text-align: left;
    padding: 1.05rem 1.15rem;
    min-height: 3.5rem;
    font-weight: 650;
    font-size: $text-base;
    line-height: 1.35;
    color: $ink;
    -webkit-tap-highlight-color: transparent;
  }

  // Más que gira a menos: dos barras, la vertical se acuesta.
  &__sign {
    position: relative;
    flex-shrink: 0;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: $accent-soft;
    transition:
      background-color $dur $ease-out,
      transform $dur $ease-out;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10px;
      height: 1.5px;
      margin: -0.75px 0 0 -5px;
      background: $accent-deep;
      border-radius: 2px;
      transition: transform $dur $ease-out;
    }

    &::after {
      transform: rotate(90deg);
    }
  }

  &.is-open &__sign {
    background: $accent-deep;
    transform: rotate(180deg);

    &::before,
    &::after {
      background: $surface;
    }

    &::after {
      transform: rotate(0deg);
    }
  }

  &__panel {
    overflow: hidden;
  }

  &__answer {
    padding: 0 1.15rem 1.15rem;
    color: $ink-soft;
    font-size: $text-sm;
    line-height: 1.6;
    max-width: 68ch;
  }
}

.acc-enter-active,
.acc-leave-active {
  transition:
    height 0.36s $ease-out,
    opacity 0.3s $ease-out;
}

.acc-enter-from,
.acc-leave-to {
  opacity: 0;
}
</style>
