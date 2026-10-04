<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStoreSettings } from '@/composables/useStoreSettings'

const { announcement } = useStoreSettings()
const track = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
// El marquee solo se activa si el texto no cabe: un anuncio corto se queda quieto y centrado.
const overflowing = ref(false)
let observer: ResizeObserver | null = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function measure() {
  if (!track.value || !text.value || reduced()) return
  overflowing.value = text.value.scrollWidth > track.value.clientWidth + 1
}

watch(announcement, async () => {
  overflowing.value = false
  await nextTick()
  measure()
  if (track.value && observer) observer.observe(track.value)
})

onMounted(() => {
  if ('ResizeObserver' in window) observer = new ResizeObserver(measure)
  if (track.value) observer?.observe(track.value)
  measure()
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div v-if="announcement" class="announce" :class="{ 'announce--marquee': overflowing }" role="note">
    <div ref="track" class="announce__track">
      <div class="announce__belt">
        <span ref="text" class="announce__text">
          <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>{{ announcement }}
        </span>
        <span v-if="overflowing" class="announce__text" aria-hidden="true">
          <i class="fa-solid fa-truck-fast"></i>{{ announcement }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.announce {
  @include moss;
  font-family: $font-mono;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1;
  color: rgba($surface, 0.88);

  &__track {
    @include container(1200px);
    overflow: hidden;
    padding-block: 0.6rem;
  }

  &__belt {
    @include flex(row, center, center);
    width: max-content;
    min-width: 100%;
  }

  &__text {
    @include flex(row, center, center, 0.55rem);
    white-space: nowrap;
    flex-shrink: 0;

    i {
      color: $sage;
    }
  }

  &--marquee &__track {
    // Fundido en los bordes para que el texto no se corte en seco.
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }

  &--marquee &__belt {
    justify-content: flex-start;
    animation: marquee 22s linear infinite;
  }

  &--marquee &__text {
    padding-right: 3.5rem;
  }

  // Sin movimiento el texto largo simplemente envuelve en dos líneas.
  @include reduced-motion {
    &__belt {
      width: 100%;
    }

    &__text {
      white-space: normal;
      text-align: center;
      line-height: 1.4;
      flex-shrink: 1;
    }
  }
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
