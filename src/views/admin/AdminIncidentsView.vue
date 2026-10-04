<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import IncidentFilters from '@/components/admin/incidents/IncidentFilters.vue'
import IncidentCard from '@/components/admin/incidents/IncidentCard.vue'
import IncidentDetail from '@/components/admin/incidents/IncidentDetail.vue'
import IncidentNewForm from '@/components/admin/incidents/IncidentNewForm.vue'
import { incidentCopy as copy } from '@/components/admin/incidents/incidentMeta'
import { useIncidents } from '@/composables/admin/useIncidents'
import { useBodyScroll } from '@/composables/useBodyScroll'
import type { NewIncidentInput } from '@/types/incidents'

const route = useRoute()
const router = useRouter()
const inc = useIncidents()
const { filters, items, pages, loading, error, summary, selectedId, selected, detailLoading, busy, team } = inc

const creating = ref(false)
const filtered = computed(() => filters.status !== 'active' || !!filters.type || !!filters.severity || !!filters.q)

// Panel lateral desde 1280 px; antes, el detalle es una hoja a pantalla completa.
const wide = ref(false)
let media: MediaQueryList | null = null
const syncWide = () => (wide.value = !!media?.matches)
const sheetOpen = computed(() => !wide.value && !!selectedId.value)
useBodyScroll(sheetOpen)

// El detalle vive en la URL (?id=…): el link del correo abre la incidencia directo.
function open(id: string) {
  void router.replace({ query: { ...route.query, id } })
}
function close() {
  const query = { ...route.query }
  delete query.id
  void router.replace({ query })
}
watch(
  () => String(route.query.id || ''),
  (id) => {
    if (id !== selectedId.value) void inc.select(id)
  },
)

function onNote(text: string, done: () => void) {
  void inc.addNote(text).then((ok) => ok && done())
}
function onCreate(input: NewIncidentInput, done: (ok: boolean) => void) {
  void inc.create(input).then((ok) => {
    done(ok)
    if (ok && selectedId.value) open(selectedId.value)
  })
}
function refresh() {
  void inc.load()
  void inc.refreshBadges()
  if (selectedId.value) void inc.select(selectedId.value)
}

onMounted(() => {
  media = window.matchMedia('(min-width: 1280px)')
  syncWide()
  media.addEventListener('change', syncWide)
  void inc.load(1)
  void inc.loadTeam()
  void inc.refreshBadges()
  const id = String(route.query.id || '')
  if (id) void inc.select(id)
})
onBeforeUnmount(() => media?.removeEventListener('change', syncWide))
</script>

<template>
  <div class="incidents">
    <AdminPageHead :title="copy.title" :subtitle="summary ? copy.subtitle(summary.active) : 'Cargando…'">
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="refresh">Actualizar</AdminButton>
      <AdminButton variant="primary" icon="fa-solid fa-plus" @click="creating = true">{{ copy.newButton }}</AdminButton>
    </AdminPageHead>

    <IncidentFilters :filters="filters" :summary="summary" />

    <div class="incidents__body">
      <section class="incidents__list" :class="{ 'incidents__list--busy': loading && items.length }">
        <AdminSkeleton v-if="loading && !items.length" :rows="5" />
        <AdminEmpty v-else-if="error" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="error">
          <AdminButton variant="primary" @click="inc.load()">Reintentar</AdminButton>
        </AdminEmpty>
        <AdminEmpty
          v-else-if="!items.length"
          :icon="filtered ? 'fa-solid fa-filter-circle-xmark' : 'fa-solid fa-circle-check'"
          :title="filtered ? copy.emptyFiltered : copy.emptyActive"
          :text="filtered ? copy.emptyFilteredText : copy.emptyActiveText"
        />
        <template v-else>
          <IncidentCard
            v-for="(item, i) in items"
            :key="item._id"
            v-reveal="Math.min(i, 6) * 50"
            :incident="item"
            :active="item._id === selectedId"
            @open="open"
          />
          <AdminPager :page="filters.page" :pages="pages" @change="inc.load" />
        </template>
      </section>

      <aside v-if="wide" class="incidents__side">
        <AdminSkeleton v-if="detailLoading && !selected" :rows="3" />
        <IncidentDetail
          v-else-if="selected"
          :incident="selected"
          :team="team"
          :busy="busy"
          @close="close"
          @status="inc.setStatus"
          @assign="inc.assign"
          @severity="inc.setSeverity"
          @note="onNote"
        />
        <p v-else class="incidents__pick"><i class="fa-regular fa-hand-pointer"></i> {{ copy.pick }}</p>
      </aside>
    </div>

    <Teleport to="body">
      <Transition name="slide-up">
        <div v-if="sheetOpen" class="sheet" role="dialog" aria-modal="true" :aria-label="selected?.number || copy.title">
          <AdminSkeleton v-if="detailLoading && !selected" :rows="3" />
          <IncidentDetail
            v-else-if="selected"
            :incident="selected"
            :team="team"
            :busy="busy"
            @close="close"
            @status="inc.setStatus"
            @assign="inc.assign"
            @severity="inc.setSeverity"
            @note="onNote"
          />
        </div>
      </Transition>
    </Teleport>

    <IncidentNewForm :open="creating" @close="creating = false" @submit="onCreate" />
  </div>
</template>

<style scoped lang="scss">
.incidents {
  &__body {
    @include flex(row, flex-start, flex-start, 1.2rem);
  }

  &__list {
    flex: 1 1 0;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.55rem);
    @include transition(opacity);

    &--busy {
      opacity: 0.55;
    }
  }

  &__side {
    flex: 0 0 420px;
    position: sticky;
    top: 1.5rem;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
    @include card;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;
    padding: 1.2rem;
  }

  &__pick {
    @include flex(column, center, center, 0.6rem);
    padding: 3rem 1rem;
    text-align: center;
    font-size: $text-sm;
    color: $ink-muted;

    i {
      font-size: 1.4rem;
      color: $alu-dark;
    }
  }
}

// Hoja a pantalla completa en móvil y tablet.
.sheet {
  position: fixed;
  inset: 0;
  z-index: 120;
  overflow-y: auto;
  background: $surface;
  padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom));
}
</style>
