<script setup lang="ts">
import AdminPanel from './AdminPanel.vue'
import AdminButton from './AdminButton.vue'
import type { BankAccount } from '@/types'

defineProps<{ accounts: BankAccount[] }>()
</script>

<template>
  <AdminPanel title="Cuentas bancarias" icon="fa-solid fa-building-columns">
    <template #actions>
      <AdminButton
        variant="soft"
        icon="fa-solid fa-plus"
        @click="accounts.push({ bank: '', type: 'Ahorros', number: '', holder: '', idNumber: '' })"
      >
        Agregar
      </AdminButton>
    </template>
    <p class="banks__hint">Se muestran al cliente que elige pagar por transferencia.</p>
    <p v-if="!accounts.length" class="banks__empty">Sin cuentas. Agrega al menos una para aceptar transferencias.</p>

    <div v-for="(acc, i) in accounts" :key="i" class="banks__item">
      <div class="banks__head">
        <strong>Cuenta {{ i + 1 }}</strong>
        <button type="button" class="banks__del" aria-label="Quitar cuenta" @click="accounts.splice(i, 1)">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="banks__fields">
        <div>
          <label :for="`b-bank-${i}`">Banco</label>
          <input :id="`b-bank-${i}`" v-model="acc.bank" type="text" placeholder="Banco Pichincha" />
        </div>
        <div>
          <label :for="`b-type-${i}`">Tipo</label>
          <select :id="`b-type-${i}`" v-model="acc.type">
            <option>Ahorros</option>
            <option>Corriente</option>
          </select>
        </div>
        <div>
          <label :for="`b-num-${i}`">Número</label>
          <input :id="`b-num-${i}`" v-model="acc.number" type="text" inputmode="numeric" />
        </div>
        <div>
          <label :for="`b-holder-${i}`">Titular</label>
          <input :id="`b-holder-${i}`" v-model="acc.holder" type="text" />
        </div>
        <div>
          <label :for="`b-id-${i}`">Cédula / RUC</label>
          <input :id="`b-id-${i}`" v-model="acc.idNumber" type="text" inputmode="numeric" />
        </div>
      </div>
    </div>
  </AdminPanel>
</template>

<style scoped lang="scss">
.banks {
  &__hint,
  &__empty {
    font-size: $text-sm;
    color: $ink-muted;
    margin-bottom: 0.6rem;
  }

  &__item {
    padding: 0.8rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    margin-bottom: 0.6rem;
  }

  &__head {
    @include flex(row, center, space-between);
    font-size: $text-sm;
    margin-bottom: 0.4rem;
  }

  &__del {
    width: 2.2rem;
    height: 2.2rem;
    color: $danger;
  }

  &__fields {
    @include flex-cards(150px, 0.6rem);
  }
}
</style>
