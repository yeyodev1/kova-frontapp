<script setup lang="ts">
import { useTracking, type TrackedOrder } from '@/composables/useTracking'
import TrackingTicket from './TrackingTicket.vue'
import TrackingTimeline from './TrackingTimeline.vue'
import TrackingAlert from './TrackingAlert.vue'
import TrackingShipping from './TrackingShipping.vue'
import TrackingItems from './TrackingItems.vue'
import TrackingHelp from './TrackingHelp.vue'

defineProps<{ order: TrackedOrder }>()
const emit = defineEmits<{ another: [] }>()
const { steps, isNegative, guide } = useTracking()
</script>

<template>
  <section class="tr">
    <div v-reveal>
      <TrackingTicket :order="order" />
    </div>

    <div class="tr__cols">
      <div v-reveal="80" class="tr__col tr__col--main">
        <TrackingAlert v-if="isNegative" />
        <TrackingTimeline v-else :steps="steps" />
      </div>
      <div class="tr__col tr__col--side">
        <div v-if="!isNegative || guide" v-reveal="140"><TrackingShipping :order="order" /></div>
        <div v-reveal="200"><TrackingItems :order="order" /></div>
      </div>
    </div>

    <div v-reveal="120">
      <TrackingHelp @another="emit('another')" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.tr {
  @include flex(column, stretch, flex-start, 1.25rem);

  &__cols,
  &__col {
    @include flex(column, stretch, flex-start, 1.25rem);
  }

  @include from('lg') {
    gap: 1.5rem;

    &__cols {
      flex-direction: row;
      align-items: flex-start;
      gap: 1.5rem;
    }

    &__col--main {
      flex: 1 1 52%;
      min-width: 0;
      position: sticky;
      top: 6rem;
    }

    &__col--side {
      flex: 1 1 48%;
      min-width: 0;
    }
  }
}
</style>
