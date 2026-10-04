<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatWeekday } from '@/composables/admin/format'
import { formatCents } from '@/utils/money'

const props = defineProps<{ days: { date: string; orders: number; revenue: number }[] }>()

const metric = ref<'revenue' | 'orders'>('revenue')

const max = computed(() => Math.max(1, ...props.days.map((d) => d[metric.value])))
const total = computed(() => props.days.reduce((sum, d) => sum + d[metric.value], 0))
const bars = computed(() =>
  props.days.map((d, i) => ({
    ...d,
    day: formatWeekday(d.date),
    scale: Math.max(d[metric.value] / max.value, 0.02),
    isToday: i === props.days.length - 1,
    // Sin centavos: siete columnas en 360px no dan para "$1.234,56".
    text: metric.value === 'revenue' ? `$${Math.round(d.revenue / 100)}` : String(d.orders),
  })),
)
</script>

<template>
  <div class="week">
    <div class="week__head">
      <p class="week__total">
        <span class="week__total-label">{{ metric === 'revenue' ? 'Ventas de la semana' : 'Pedidos de la semana' }}</span>
        <strong>{{ metric === 'revenue' ? formatCents(total) : total }}</strong>
      </p>
      <div class="week__toggle" role="group" aria-label="Métrica">
        <button type="button" :class="{ on: metric === 'revenue' }" :aria-pressed="metric === 'revenue'" @click="metric = 'revenue'">
          Ventas
        </button>
        <button type="button" :class="{ on: metric === 'orders' }" :aria-pressed="metric === 'orders'" @click="metric = 'orders'">
          Pedidos
        </button>
      </div>
    </div>
    <div class="week__chart">
      <div v-for="(b, i) in bars" :key="b.date" class="week__col" :title="`${b.day}: ${b.text}`">
        <span class="week__value">{{ b.text }}</span>
        <span class="week__track">
          <span
            class="week__bar"
            :class="{ 'week__bar--today': b.isToday }"
            :style="{ transform: `scaleY(${b.scale})`, animationDelay: `${i * 70}ms` }"
          ></span>
        </span>
        <span class="week__day" :class="{ 'week__day--today': b.isToday }">{{ b.isToday ? 'hoy' : b.day }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.week {
  &__head {
    @include flex(row, flex-end, space-between, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  &__total {
    @include flex(column, flex-start, flex-start, 0.1rem);

    strong {
      @include price(clamp(1.4rem, 1.2rem + 0.8vw, 1.8rem));
      line-height: 1.1;
    }
  }

  &__total-label {
    @include eyebrow;
    font-size: 0.62rem;
    color: $ink-muted;
  }

  &__toggle {
    @include flex(row, center, flex-end, 0.15rem);
    padding: 0.2rem;
    border-radius: $radius-pill;
    background: $paper;

    button {
      font-size: $text-xs;
      font-weight: 600;
      padding: 0.4rem 0.8rem;
      border-radius: $radius-pill;
      color: $ink-muted;
      transition:
        background-color $dur $ease-out,
        color $dur $ease-out;

      &.on {
        background: $surface;
        color: $accent-deep;
        box-shadow: $shadow-sm;
      }
    }
  }

  &__chart {
    @include flex(row, stretch, space-between, 0.35rem);
    height: 190px;
  }

  &__col {
    flex: 1 1 0;
    min-width: 0;
    @include flex(column, center, flex-end, 0.35rem);
  }

  &__value {
    font-family: $font-mono;
    font-size: 0.58rem;
    color: $ink-muted;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    @include from('md') {
      font-size: 0.68rem;
    }
  }

  &__track {
    flex: 1;
    width: 100%;
    max-width: 46px;
    @include flex(column, stretch, flex-end);
    background: repeating-linear-gradient(0deg, $paper 0 1px, transparent 1px 25%);
    border-radius: 10px;
    overflow: hidden;
  }

  // La barra ocupa toda la pista y se escala desde abajo: solo transform, nada de height.
  &__bar {
    display: block;
    height: 100%;
    border-radius: 10px 10px 4px 4px;
    background: linear-gradient(180deg, $sage 0%, $accent 100%);
    transform-origin: bottom;
    transition: transform $dur-slow $ease-out;
    animation: grow 0.9s $ease-out both;

    &--today {
      background: linear-gradient(180deg, $accent 0%, $accent-deep 100%);
    }
  }

  &__day {
    font-family: $font-mono;
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $ink-muted;

    &--today {
      color: $accent-deep;
      font-weight: 700;
    }
  }
}

@keyframes grow {
  from {
    transform: scaleY(0);
  }
}

@include reduced-motion {
  .week__bar {
    animation: none;
    transition: none;
  }
}
</style>
