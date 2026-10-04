<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import { paymentsCopy as copy } from '@/config/paymentsAdmin'

const model = defineModel<number>({ required: true })
defineProps<{ saving?: boolean }>()
const emit = defineEmits<{ save: [] }>()
</script>

<template>
  <AdminPanel :title="copy.surchargeTitle" icon="fa-solid fa-dollar-sign">
    <form class="surcharge" @submit.prevent="emit('save')">
      <div class="surcharge__field">
        <label for="pay-surcharge">{{ copy.surchargeTitle }} ($)</label>
        <div class="surcharge__input">
          <span aria-hidden="true">$</span>
          <input id="pay-surcharge" v-model.number="model" type="number" min="0" step="0.01" inputmode="decimal" />
        </div>
        <small>{{ copy.surchargeHint }}</small>
      </div>
      <AdminButton type="submit" variant="soft" icon="fa-solid fa-floppy-disk" :loading="saving">
        {{ copy.surchargeSave }}
      </AdminButton>
    </form>
  </AdminPanel>
</template>

<style scoped lang="scss">
.surcharge {
  @include flex(column, flex-start, flex-start, 0.8rem);

  &__field {
    width: 100%;
    max-width: 22rem;

    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
      margin-top: 0.3rem;
    }
  }

  &__input {
    position: relative;

    span {
      position: absolute;
      left: 0.95rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
    }

    input {
      padding-left: 1.8rem;
    }
  }
}
</style>
