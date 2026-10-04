<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatWeekday } from '@/composables/admin/format'

const props = defineProps<{ days: { date: string; orders: number; revenue: number }[] }>()

const metric = ref<'revenue' | 'orders'>('revenue')

const max = computed(() => Math.max(1, ...props.days.map((d) => d[metric.value])))
const bars = computed(() =>
  props.days.map((d) => ({
    ...d,
    day: formatWeekday(d.date),
    pct: Math.round((d[metric.value] / max.value) * 100),
    // Sin centavos: siete columnas en 360px no dan para "$1.234,56".
    text: metric.value === 'revenue' ? `$${Math.round(d.revenue / 100)}` : String(d.orders),
  })),
)
</script>

<template>
  <div class="week">
    <div class="week__toggle" role="group" aria-label="Métrica">
      <button :class="{ on: metric === 'revenue' }" @click="metric = 'revenue'">Ventas</button>
      <button :class="{ on: metric === 'orders' }" @click="metric = 'orders'">Pedidos</button>
    </div>
    <div class="week__chart">
      <div v-for="b in bars" :key="b.date" class="week__col" :title="`${b.day}: ${b.text}`">
        <span class="week__value">{{ b.text }}</span>
        <span class="week__track">
          <span class="week__bar" :style="{ height: `${Math.max(b.pct, 2)}%` }"></span>
        </span>
        <span class="week__day">{{ b.day }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.week {
  &__toggle {
    @include flex(row, center, flex-end, 0.25rem);
    margin-bottom: 0.8rem;

    button {
      font-size: $text-xs;
      font-weight: 600;
      padding: 0.35rem 0.7rem;
      border-radius: $radius-pill;
      color: $ink-muted;

      &.on {
        background: $accent-soft;
        color: $accent-deep;
      }
    }
  }

  &__chart {
    @include flex(row, stretch, space-between, 0.35rem);
    height: 180px;
  }

  &__col {
    flex: 1 1 0;
    min-width: 0;
    @include flex(column, center, flex-end, 0.3rem);
  }

  &__value {
    font-size: 0.6rem;
    color: $ink-muted;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    @include from('md') {
      font-size: $text-xs;
    }
  }

  &__track {
    flex: 1;
    width: 100%;
    max-width: 44px;
    @include flex(column, stretch, flex-end);
    background: $paper;
    border-radius: 6px;
    overflow: hidden;
  }

  &__bar {
    display: block;
    background: $accent;
    border-radius: 6px 6px 0 0;
    @include transition(height);
  }

  &__day {
    font-size: $text-xs;
    color: $ink-soft;
    text-transform: capitalize;
  }
}
</style>
