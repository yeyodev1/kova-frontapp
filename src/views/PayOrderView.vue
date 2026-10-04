<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { payOrderCopy as copy, whatsappLink } from '@/config/site'
import { usePayOrder } from '@/composables/usePayOrder'
import PayHeader from '@/components/pay/PayHeader.vue'
import PayOrderSummary from '@/components/pay/PayOrderSummary.vue'
import PayCardBox from '@/components/pay/PayCardBox.vue'
import PayState from '@/components/pay/PayState.vue'

const route = useRoute()
const { status, order, payphone, error, minutesLeft, load } = usePayOrder(String(route.params.token || ''))

const helpLink = computed(() => whatsappLink(copy.whatsappMessage(order.value?.number || '')))
const orderLink = computed(() =>
  order.value ? { name: 'OrderSuccess', params: { number: order.value.number }, query: { phone: order.value.customer.phone } } : '/',
)

load()
</script>

<template>
  <div class="pay">
    <PayHeader />

    <main class="pay__main">
      <div v-if="status === 'loading'" class="pay__loading" role="status" aria-live="polite">
        <span class="skeleton pay__sk pay__sk--summary"></span>
        <span class="skeleton pay__sk pay__sk--box"></span>
        <span class="visually-hidden">{{ copy.loading }}</span>
      </div>

      <div v-else-if="status === 'error'" class="pay__narrow">
        <PayState icon="fa-solid fa-link-slash" :title="copy.errorTitle" :text="error">
          <a :href="helpLink" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.backToWhatsapp }}
          </a>
          <button type="button" class="btn btn--outline btn--lg btn--block" @click="load">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.retry }}
          </button>
        </PayState>
      </div>

      <div v-else-if="status === 'paid' && order" class="pay__narrow">
        <PayState icon="fa-solid fa-check" tone="success" :title="copy.paidTitle" :text="copy.paidText">
          <RouterLink :to="orderLink" class="btn btn--primary btn--lg btn--block">
            {{ copy.viewOrder }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </RouterLink>
          <a :href="helpLink" class="btn btn--whatsapp btn--lg btn--block" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.backToWhatsapp }}
          </a>
        </PayState>
        <PayOrderSummary :order="order" />
      </div>

      <div v-else-if="order" class="pay__layout">
        <h1 class="visually-hidden">{{ copy.title }} {{ order.number }}</h1>
        <div class="pay__aside">
          <PayOrderSummary :order="order" />
        </div>

        <div class="pay__pay">
          <PayCardBox v-if="status === 'ready' && payphone" :config="payphone" :minutes-left="minutesLeft" />
          <PayState v-else icon="fa-regular fa-clock" tone="warning" :title="copy.expiredTitle" :text="copy.expiredText">
            <button type="button" class="btn btn--cta btn--lg btn--block" @click="load">
              <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> {{ copy.regenerate }}
            </button>
          </PayState>

          <p class="pay__note">{{ copy.note }}</p>
          <a :href="helpLink" class="pay__help" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.backToWhatsapp }}
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.pay {
  flex: 1;
  min-height: 100svh;
  background:
    radial-gradient(80% 40% at 100% 0%, rgba($sage, 0.18), transparent 70%),
    $paper;

  &__main {
    @include container(1040px);
    padding-block: 1rem 3rem;

    @include from('md') {
      padding-block: 2.25rem $space-xl;
    }
  }

  &__narrow,
  &__loading {
    @include flex(column, stretch, flex-start, 1rem);
    max-width: 480px;
    margin-inline: auto;
  }

  &__sk {
    border-radius: 20px;

    &--summary {
      height: 15rem;
    }

    &--box {
      height: 22rem;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  &__aside {
    @include from('lg') {
      flex: 0 0 400px;
      position: sticky;
      top: 1.5rem;
    }
  }

  &__pay {
    @include flex(column, stretch, flex-start, 0.9rem);
    flex: 1;
    min-width: 0;
  }

  &__note {
    padding-inline: 0.25rem;
    font-size: $text-xs;
    line-height: 1.5;
    color: $ink-muted;
    text-align: center;
  }

  &__help {
    @include flex(row, center, center, 0.45rem);
    @include focus-ring;
    align-self: center;
    min-height: 2.75rem;
    padding-inline: 1rem;
    border-radius: $radius-pill;
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    transition: background-color $dur-fast ease;

    i {
      color: #25d366;
      font-size: 1.05rem;
    }

    &:hover {
      background: $accent-soft;
    }
  }
}
</style>
