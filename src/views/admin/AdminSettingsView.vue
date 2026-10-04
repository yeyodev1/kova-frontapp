<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import TeamAlertsPanel from '@/components/admin/TeamAlertsPanel.vue'
import { useSettingsForm } from '@/composables/admin/useSettingsForm'
import { paymentsCopy } from '@/config/paymentsAdmin'

const { form, loading, loadError, saving, load, save } = useSettingsForm()

const moneyFields = [
  { key: 'codSurcharge', label: 'Recargo contra entrega ($)', hint: 'Se suma al pagar al recibir' },
  { key: 'shippingFee', label: 'Costo de envío ($)', hint: '0 = envío gratis siempre' },
  { key: 'freeShippingFrom', label: 'Envío gratis desde ($)', hint: '0 = no aplica' },
] as const
</script>

<template>
  <div class="settings">
    <AdminPageHead title="Ajustes" subtitle="Recargos, envío, contacto y avisos" />

    <AdminSkeleton v-if="loading" :rows="4" height="7rem" />

    <AdminEmpty v-else-if="loadError" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="loadError">
      <AdminButton variant="primary" @click="load">Reintentar</AdminButton>
    </AdminEmpty>

    <form v-else class="settings__form" @submit.prevent="save">
      <AdminPanel title="Cobros y envío" icon="fa-solid fa-dollar-sign">
        <div class="settings__fields">
          <div v-for="f in moneyFields" :key="f.key">
            <label :for="`s-${f.key}`">{{ f.label }}</label>
            <input :id="`s-${f.key}`" v-model.number="form[f.key]" type="number" min="0" step="0.01" inputmode="decimal" />
            <small>{{ f.hint }}</small>
          </div>
        </div>
      </AdminPanel>

      <AdminPanel title="Tienda" icon="fa-solid fa-store">
        <div class="settings__fields">
          <div class="settings__wide">
            <label for="s-announcement">Barra de anuncio</label>
            <input id="s-announcement" v-model="form.announcement" type="text" maxlength="140" placeholder="Envío gratis a todo Ecuador" />
            <small>Vacío para ocultarla.</small>
          </div>
          <div>
            <label for="s-wa">WhatsApp</label>
            <input id="s-wa" v-model="form.whatsapp" type="tel" inputmode="numeric" placeholder="593997011366" />
            <small>Solo dígitos, con 593.</small>
          </div>
          <div>
            <label for="s-markup">Margen por defecto (%)</label>
            <input id="s-markup" v-model.number="form.defaultMarkupPercent" type="number" min="0" step="1" inputmode="numeric" />
            <small>Se aplica al importar de Dropi sin precio sugerido.</small>
          </div>
        </div>
      </AdminPanel>

      <!-- Las cuentas, el interruptor y el recargo por transferencia viven en un solo lugar. -->
      <AdminPanel title="Transferencias y cuentas bancarias" icon="fa-solid fa-building-columns">
        <p class="settings__note">El interruptor, el recargo y las cuentas se manejan en Pagos y bancos.</p>
        <AdminButton to="/admin/pagos" variant="soft" icon="fa-solid fa-arrow-right">
          {{ paymentsCopy.settingsLink }}
        </AdminButton>
      </AdminPanel>

      <div class="settings__bar">
        <AdminButton type="submit" variant="primary" icon="fa-solid fa-floppy-disk" :loading="saving">
          Guardar ajustes
        </AdminButton>
      </div>
    </form>

    <TeamAlertsPanel v-if="!loading && !loadError" />
  </div>
</template>

<style scoped lang="scss">
.settings {
  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    max-width: 860px;
  }

  &__fields {
    @include flex-cards(200px, 0.9rem);

    small {
      display: block;
      font-size: $text-xs;
      color: $ink-muted;
      margin-top: 0.25rem;
    }
  }

  &__note {
    font-size: $text-sm;
    color: $ink-soft;
    margin-bottom: 0.8rem;
  }

  &__wide {
    flex-basis: 100% !important;
  }

  &__bar {
    position: sticky;
    bottom: calc(62px + env(safe-area-inset-bottom) + 0.5rem);
    @include flex(row, center, flex-end);
    padding: 0.6rem 0.8rem;
    border-radius: $radius-md;
    background: rgba($surface, 0.96);
    border: 1px solid $line;
    box-shadow: $shadow-md;

    @include from('md') {
      bottom: 1rem;
    }
  }
}
</style>
