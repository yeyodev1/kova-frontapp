<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import { useLeads } from '@/composables/admin/useLeads'
import { formatDateTime } from '@/composables/admin/format'

const { items, page, pages, total, loading, error, load, leadItems, recoveryLink } = useLeads()
</script>

<template>
  <div class="leads">
    <AdminPageHead
      title="Carritos abandonados"
      :subtitle="loading ? 'Cargando…' : `${total} personas dejaron su celular y no compraron`"
    >
      <AdminButton icon="fa-solid fa-rotate" :loading="loading" @click="load()">Actualizar</AdminButton>
    </AdminPageHead>

    <AdminSkeleton v-if="loading && !items.length" :rows="5" />

    <AdminEmpty v-else-if="error" icon="fa-solid fa-plug-circle-xmark" title="No se pudo cargar" :text="error">
      <AdminButton variant="primary" @click="load()">Reintentar</AdminButton>
    </AdminEmpty>

    <AdminEmpty
      v-else-if="!items.length"
      icon="fa-solid fa-cart-shopping"
      title="Nada por recuperar"
      text="Cuando alguien deje su celular en el checkout y no compre, aparecerá aquí."
    />

    <ul v-else class="leads__list" :class="{ 'leads__list--busy': loading }">
      <li v-for="lead in items" :key="lead._id" class="lead">
        <div class="lead__who">
          <p class="lead__name">{{ lead.firstName || 'Sin nombre' }}</p>
          <p class="lead__meta">{{ lead.phone }} · {{ formatDateTime(lead.createdAt) }}</p>
        </div>
        <ul class="lead__items">
          <li v-for="(it, i) in leadItems(lead)" :key="i">
            <img v-if="it.image" :src="it.image" alt="" loading="lazy" />
            <span>{{ it.quantity }} x {{ it.title || 'Producto' }}<template v-if="it.variantName"> ({{ it.variantName }})</template></span>
          </li>
        </ul>
        <AdminButton variant="whatsapp" icon="fa-brands fa-whatsapp" :href="recoveryLink(lead)" class="lead__wa">
          Recuperar
        </AdminButton>
      </li>
    </ul>

    <AdminPager :page="page" :pages="pages" @change="load" />
  </div>
</template>

<style scoped lang="scss">
.leads {
  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
    @include transition(opacity);

    &--busy {
      opacity: 0.55;
    }
  }
}

.lead {
  @include card;
  @include flex(column, stretch, flex-start, 0.6rem);
  padding: 0.9rem 1rem;

  @include from('md') {
    flex-direction: row;
    align-items: center;
  }

  &__who {
    @include from('md') {
      flex: 0 0 220px;
    }
  }

  &__name {
    font-weight: 600;
  }

  &__meta {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__items {
    list-style: none;
    flex: 1;
    min-width: 0;
    @include flex(column, stretch, flex-start, 0.3rem);
    font-size: $text-sm;

    li {
      @include flex(row, center, flex-start, 0.5rem);
    }

    img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      object-fit: cover;
    }
  }

  &__wa {
    flex-shrink: 0;
  }
}
</style>
