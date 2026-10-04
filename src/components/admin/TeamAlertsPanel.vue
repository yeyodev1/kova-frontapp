<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPanel from './AdminPanel.vue'
import AdminToggle from './AdminToggle.vue'
import { adminService, type TeamMember } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/composables/admin/format'

const toast = useToastStore()
const team = ref<TeamMember[]>([])
const loading = ref(true)
const busyId = ref('')

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
async function toggle(member: TeamMember, value: boolean) {
  busyId.value = member._id
  try {
    const updated = await adminService.setHumanAlerts(member._id, value)
    member.notifyHumanRequests = updated.notifyHumanRequests
    toast.success(value ? `${member.email} recibirá los avisos` : `${member.email} ya no recibirá los avisos`)
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo guardar'))
  } finally {
    busyId.value = ''
  }
}

onMounted(load)
</script>

<template>
  <AdminPanel title="Avisos de asesor" icon="fa-solid fa-headset">
    <p class="alerts__intro">
      <i class="fa-solid fa-envelope-circle-check" aria-hidden="true"></i>
      Cuando un cliente pide hablar con una persona en WhatsApp (asesor, reclamo, garantía o devolución), el bot se pausa
      y enviamos un correo a quienes tengan el aviso activado.
    </p>

    <div v-if="loading" class="alerts__loading skeleton"></div>

    <ul v-else class="alerts__list">
      <li v-for="member in team" :key="member._id" class="alerts__item" :class="{ 'alerts__item--off': !member.notifyHumanRequests }">
        <span class="alerts__avatar" aria-hidden="true"><i class="fa-solid fa-user-shield"></i></span>
        <span class="alerts__who">
          <strong>{{ member.name || member.email }}</strong>
          <small>{{ member.email }}</small>
        </span>
        <span class="alerts__state">
          <i :class="member.notifyHumanRequests ? 'fa-solid fa-bell' : 'fa-solid fa-bell-slash'" aria-hidden="true"></i>
        </span>
        <AdminToggle
          :model-value="member.notifyHumanRequests"
          :label="`Avisos para ${member.email}`"
          hide-label
          :busy="busyId === member._id"
          @update:model-value="(value: boolean) => toggle(member, value)"
        />
      </li>
    </ul>
  </AdminPanel>
</template>

<style scoped lang="scss">
.alerts__intro {
  @include flex(row, flex-start, flex-start, 0.6rem);
  font-size: $text-sm;
  color: $ink-soft;
  margin-bottom: 1rem;

  i {
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
  @include flex(row, center, flex-start, 0.75rem);
  padding: 0.7rem 0.85rem;
  border: 1px solid $line;
  border-radius: 14px;
  background: $surface;
  @include transition(opacity);

  &--off {
    opacity: 0.7;
  }
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

.alerts__state {
  color: $accent;

  .fa-bell-slash {
    color: $ink-muted;
  }
}
</style>
