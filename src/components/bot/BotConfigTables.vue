<script setup lang="ts">
import AdminPanel from '@/components/admin/AdminPanel.vue'
import { botAdminCopy } from '@/config/site'
import type { BotFlow, BotRule } from '@/types'

defineProps<{ flows: BotFlow[]; rules: BotRule[] }>()
const copy = botAdminCopy.config
</script>

<template>
  <AdminPanel :title="copy.flows" icon="fa-solid fa-diagram-project">
    <div class="bct__scroll" tabindex="0" :aria-label="copy.flows">
      <table class="bct__table">
        <thead>
          <tr><th v-for="col in copy.flowCols" :key="col" scope="col">{{ col }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="flow in flows" :key="flow.name">
            <th scope="row">{{ flow.name }}</th>
            <td><span class="bct__tag">{{ flow.event }}</span></td>
            <td><code>{{ flow.endpoint }}</code></td>
            <td>
              <code v-if="flow.sendToClient.startsWith('{')">{{ flow.sendToClient }}</code>
              <strong v-else class="bct__off">{{ flow.sendToClient }}</strong>
            </td>
            <td>{{ flow.after }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminPanel>

  <AdminPanel :title="copy.rules" icon="fa-solid fa-code-branch">
    <div class="bct__scroll" tabindex="0" :aria-label="copy.rules">
      <table class="bct__table">
        <thead>
          <tr><th v-for="col in copy.ruleCols" :key="col" scope="col">{{ col }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="rule in rules" :key="rule.route">
            <th scope="row"><code>{{ rule.route }}</code></th>
            <td><strong>{{ rule.goesTo }}</strong></td>
            <td>{{ rule.when }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="bct__note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> {{ copy.rulesNote }}</p>
  </AdminPanel>

  <AdminPanel :title="copy.metaTitle" icon="fa-brands fa-meta">
    <ul class="bct__meta">
      <li v-for="item in copy.meta" :key="item"><i class="fa-solid fa-check" aria-hidden="true"></i> {{ item }}</li>
    </ul>
  </AdminPanel>
</template>

<style scoped lang="scss">
.bct {
  // La tabla se desplaza dentro de su caja: la página nunca scrollea en horizontal.
  &__scroll {
    overflow-x: auto;
    margin-inline: -0.25rem;
    padding-inline: 0.25rem;
    @include focus-ring;
  }

  &__table {
    width: 100%;
    min-width: 34rem;
    border-collapse: collapse;
    font-size: $text-sm;

    th,
    td {
      padding: 0.6rem 0.65rem;
      border-bottom: 1px solid $line;
      text-align: left;
      vertical-align: top;
    }

    thead th {
      @include eyebrow;
      font-size: 0.62rem;
      color: $ink-muted;
      white-space: nowrap;
    }

    tbody th {
      font-weight: 700;
      white-space: nowrap;
    }

    tbody tr:last-child > * {
      border-bottom: 0;
    }

    code {
      padding: 0.1rem 0.4rem;
      border-radius: 6px;
      background: $accent-soft;
      color: $accent-deep;
      font-family: $font-mono;
      font-size: 0.78rem;
      white-space: nowrap;
    }
  }

  &__tag {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $ink-soft;
    white-space: nowrap;
  }

  &__off {
    color: $danger;
    font-size: 0.78rem;
  }

  &__note {
    @include flex(row, baseline, flex-start, 0.45rem);
    margin-top: 0.75rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $info;
    }
  }

  &__meta {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.55rem);
    font-size: $text-sm;
    line-height: 1.45;

    li {
      @include flex(row, baseline, flex-start, 0.55rem);
    }

    i {
      color: $success;
    }
  }
}
</style>
