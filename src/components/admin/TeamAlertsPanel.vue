<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPanel from './AdminPanel.vue'
import AdminToggle from './AdminToggle.vue'
import { adminService, type TeamMember } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/composables/admin/format'

type AlertKey = 'notifyOrders' | 'notifyHumanRequests'

const ALERTS: { key: AlertKey; label: string; icon: string; name: string }[] = [
  { key: 'notifyOrders', label: 'Pedidos', icon: 'fa-solid fa-receipt', name: 'los avisos de pedidos' },
  { key: 'notifyHumanRequests', label: 'Asesor', icon: 'fa-solid fa-headset', name: 'los avisos de asesor' },
]

const toast = useToastStore()
const team = ref<TeamMember[]>([])
const loading = ref(true)
const busy = ref('')

async function load() {
  loading.value = true
  try {
    team.value = await adminService.team()
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo cargar el equipo'))
  } finally {
    loading.value = false
  }
}

// Se guarda al tocar el interruptor: no depende del botón "Guardar" de los ajustes.
async function toggle(member: TeamMember, key: AlertKey, value: boolean) {
  const alert = ALERTS.find((a) => a.key === key)!
  busy.value = `${member._id}:${key}`
  try {
    const updated = await adminService.setTeamAlerts(member._id, { [key]: value })
    member.notifyOrders = updated.notifyOrders
    member.notifyHumanRequests = updated.notifyHumanRequests
    toast.success(`${member.email} ${value ? 'recibirá' : 'ya no recibirá'} ${alert.name}`)
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo guardar'))
  } finally {
    busy.value = ''
  }
}

const silent = (m: TeamMember) => !m.notifyOrders && !m.notifyHumanRequests

onMounted(load)
</script>

<template>
  <AdminPanel title="Avisos por correo" icon="fa-solid fa-envelope-open-text">
    <ul class="alerts__intro">
      <li>
        <i class="fa-solid fa-receipt" aria-hidden="true"></i>
        <span><strong>Pedidos:</strong> pedido nuevo, pago confirmado, comprobante por revisar y cancelaciones.</span>
      </li>
      <li>
        <i class="fa-solid fa-headset" aria-hidden="true"></i>
        <span><strong>Asesor:</strong> un cliente pide hablar con una persona en WhatsApp y el bot se pausa.</span>
      </li>
    </ul>

    <div v-if="loading" class="alerts__loading skeleton"></div>

    <ul v-else class="alerts__list">
      <li v-for="member in team" :key="member._id" class="alerts__item" :class="{ 'alerts__item--off': silent(member) }">
        <span class="alerts__person">
          <span class="alerts__avatar" aria-hidden="true">
            <i :class="silent(member) ? 'fa-solid fa-bell-slash' : 'fa-solid fa-user-shield'"></i>
          </span>
          <span class="alerts__who">
            <strong>{{ member.name || member.email }}</strong>
            <small>{{ member.email }}</small>
          </span>
        </span>
        <span class="alerts__switches">
          <span v-for="alert in ALERTS" :key="alert.key" class="alerts__switch">
            <i :class="alert.icon" aria-hidden="true"></i>
            <span>{{ alert.label }}</span>
            <AdminToggle
              :model-value="member[alert.key]"
              :label="`${alert.label}: avisos para ${member.email}`"
              hide-label
              :busy="busy === `${member._id}:${alert.key}`"
              @update:model-value="(value: boolean) => toggle(member, alert.key, value)"
            />
          </span>
        </span>
      </li>
    </ul>
  </AdminPanel>
</template>

<style scoped lang="scss">
.alerts__intro {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.4rem);
  margin-bottom: 1rem;
  font-size: $text-sm;
  color: $ink-soft;

  li {
    @include flex(row, flex-start, flex-start, 0.6rem);
  }

  i {
    flex: 0 0 1rem;
    color: $accent;
    margin-top: 0.2rem;
  }
}

.alerts__loading {
  height: 8rem;
  border-radius: 14px;
}

.alerts__list {
  list-style: none;
  @include flex(column, stretch, flex-start, 0.5rem);
}

.alerts__item {
  @include flex(column, stretch, flex-start, 0.6rem);
  padding: 0.75rem 0.85rem;
  border: 1px solid $line;
  border-radius: 14px;
  background: $surface;
  @include transition(opacity);

  &--off {
    opacity: 0.7;
  }

  @include from('md') {
    flex-direction: row;
    align-items: center;
  }
}

.alerts__person {
  @include flex(row, center, flex-start, 0.75rem);
  flex: 1 1 auto;
  min-width: 0;
}

.alerts__avatar {
  @include flex(row, center, center);
  flex: 0 0 auto;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: $accent-soft;
  color: $accent;
}

.alerts__who {
  @include flex(column, flex-start, center, 0.1rem);
  flex: 1;
  min-width: 0;

  strong {
    font-size: $text-sm;
  }

  small {
    font-size: 0.78rem;
    color: $ink-muted;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}

.alerts__switches {
  @include flex(row, center, flex-start, 0.5rem);
  flex-wrap: wrap;

  @include from('md') {
    flex-wrap: nowrap;
  }
}

.alerts__switch {
  @include flex(row, center, flex-start, 0.45rem);
  padding: 0.3rem 0.35rem 0.3rem 0.7rem;
  border: 1px solid $line;
  border-radius: $radius-pill;
  background: $paper;
  font-size: $text-xs;
  font-weight: 600;
  color: $ink-soft;

  i {
    color: $accent;
  }
}
</style>
