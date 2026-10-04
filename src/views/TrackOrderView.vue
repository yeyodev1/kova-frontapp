<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTracking } from '@/composables/useTracking'
import TrackingSearch from '@/components/tracking/TrackingSearch.vue'
import TrackingResult from '@/components/tracking/TrackingResult.vue'
import TrackingSkeleton from '@/components/tracking/TrackingSkeleton.vue'

const route = useRoute()
const { order, loading, fromQuery, clear, another } = useTracking()

// Con ?number&phone (link del correo o WhatsApp) buscamos solos; sin query, la vista arranca limpia.
// Si el cliente vuelve a tocar "Rastrear pedido" en el menú, la query se vacía y regresamos al buscador.
watch(
  () => route.query,
  (query) => {
    if (!fromQuery(query)) clear()
  },
  { immediate: true },
)

function trackAnother() {
  another()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="track">
    <Transition name="rise" mode="out-in">
      <TrackingSkeleton v-if="loading" key="loading" />
      <TrackingResult v-else-if="order" :key="order.number" :order="order" @another="trackAnother" />
      <TrackingSearch v-else key="search" />
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.track {
  @include container(1120px);
  padding-block: clamp(1.5rem, 4vw, 3.5rem) $space-xl;
}
</style>
