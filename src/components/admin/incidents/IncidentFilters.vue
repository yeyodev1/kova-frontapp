<script setup lang="ts">
import { incidentCopy, severityOptions, statusTabs, typeOptions } from './incidentMeta'
import type { IncidentFilters, IncidentStatusFilter, IncidentSummary } from '@/types/incidents'

const props = defineProps<{ filters: IncidentFilters; summary: IncidentSummary | null }>()

function count(value: IncidentStatusFilter): number | null {
  const s = props.summary
  if (!s) return null
  if (value === 'active') return s.active
  if (value === 'all') return null
  return s[value]
}
</script>

<template>
  <div class="filters">
    <div class="filters__tabs" role="group" aria-label="Estado">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        type="button"
        class="filters__tab"
        :class="{ 'filters__tab--active': filters.status === tab.value }"
        :aria-pressed="filters.status === tab.value"
        @click="filters.status = tab.value"
      >
        {{ tab.label }}
        <span v-if="count(tab.value)" class="filters__count">{{ count(tab.value) }}</span>
      </button>
    </div>

    <div class="filters__row">
      <label class="filters__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <span class="visually-hidden">Buscar incidencias</span>
        <input v-model="filters.q" type="search" :placeholder="incidentCopy.search" />
      </label>
      <label class="filters__select">
        <span class="visually-hidden">Tipo</span>
        <select v-model="filters.type">
          <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </label>
      <label class="filters__select">
        <span class="visually-hidden">Severidad</span>
        <select v-model="filters.severity">
          <option v-for="opt in severityOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters {
  @include flex(column, stretch, flex-start, 0.7rem);
  margin-bottom: 1rem;

  // En móvil los estados se deslizan en una fila.
  &__tabs {
    @include flex(row, center, flex-start, 0.4rem);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    flex-shrink: 0;
    @include flex(row, center, center, 0.4rem);
    font-size: $text-xs;
    font-weight: 600;
    padding: 0.5rem 0.85rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    color: $ink-soft;
    white-space: nowrap;
    @include transition(background);

    &--active {
      background: $accent;
      border-color: $accent;
      color: $surface;

      .filters__count {
        background: rgba(#fff, 0.22);
        color: $surface;
      }
    }
  }

  &__count {
    min-width: 1.25rem;
    padding: 0.1rem 0.35rem;
    border-radius: $radius-pill;
    background: $paper;
    font-family: $font-mono;
    font-size: 0.66rem;
    line-height: 1.1rem;
    text-align: center;
    color: $ink-soft;
  }

  &__row {
    @include flex(row, stretch, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__search {
    position: relative;
    flex: 1 1 100%;
    margin: 0;

    @include from('md') {
      flex-basis: 260px;
    }

    i {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      width: 100%;
      padding-left: 2.4rem;
    }
  }

  &__select {
    flex: 1 1 140px;
    min-width: 0;
    margin: 0;

    @include from('md') {
      flex: 0 0 200px;
    }

    select {
      width: 100%;
    }
  }
}
</style>
