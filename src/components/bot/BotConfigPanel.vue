<script setup lang="ts">
import { onMounted } from 'vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import AdminSkeleton from '@/components/admin/AdminSkeleton.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminButton from '@/components/admin/AdminButton.vue'
import BotConfigTables from './BotConfigTables.vue'
import { botAdminCopy } from '@/config/site'
import { useBotAdminConfig } from '@/composables/useBotAdminConfig'

const copy = botAdminCopy.config
const { config, loading, error, load, copy: copyText } = useBotAdminConfig()

onMounted(() => load())
</script>

<template>
  <div class="bcp">
    <AdminSkeleton v-if="loading && !config" :rows="4" height="6rem" />

    <AdminEmpty v-else-if="error && !config" icon="fa-solid fa-plug-circle-xmark" :title="botAdminCopy.loadError" :text="error">
      <AdminButton variant="primary" @click="load(true)">{{ botAdminCopy.retry }}</AdminButton>
    </AdminEmpty>

    <template v-else-if="config">
      <AdminPanel :title="copy.status" icon="fa-solid fa-signal">
        <div class="bcp__status">
          <p class="bcp__name">
            <span>{{ copy.botName }}</span>
            <strong>{{ config.botName }}</strong>
          </p>
          <ul class="bcp__flags">
            <li :class="config.aiEnabled ? 'bcp__flag--ok' : 'bcp__flag--warn'">
              <i :class="config.aiEnabled ? 'fa-solid fa-wand-magic-sparkles' : 'fa-solid fa-triangle-exclamation'" aria-hidden="true"></i>
              {{ config.aiEnabled ? copy.aiOn : copy.aiOff }}
            </li>
            <li v-if="config.aiEnabled" :class="config.aiVoice ? 'bcp__flag--ok' : ''">
              <i class="fa-solid fa-comment-dots" aria-hidden="true"></i> {{ config.aiVoice ? copy.voiceOn : copy.voiceOff }}
            </li>
            <li :class="config.secretRequired ? 'bcp__flag--ok' : 'bcp__flag--warn'">
              <i :class="config.secretRequired ? 'fa-solid fa-shield-halved' : 'fa-solid fa-lock-open'" aria-hidden="true"></i>
              {{ config.secretRequired ? copy.secretOn : copy.secretOff }}
            </li>
          </ul>
        </div>
      </AdminPanel>

      <AdminPanel :title="copy.guideTitle" icon="fa-solid fa-list-ol">
        <ol class="bcp__steps">
          <li v-for="(step, i) in copy.guide" :key="i">
            <span class="bcp__n" aria-hidden="true">{{ i + 1 }}</span><span>{{ step }}</span>
          </li>
        </ol>
      </AdminPanel>

      <AdminPanel :title="copy.endpoints" icon="fa-solid fa-plug">
        <ul class="bcp__endpoints">
          <li v-for="ep in config.endpoints" :key="ep.url" class="bcp__ep">
            <div class="bcp__ep-text">
              <p class="bcp__ep-name"><span class="bcp__method">{{ ep.method }}</span> {{ ep.name }}</p>
              <code class="bcp__url">{{ ep.url }}</code>
            </div>
            <AdminButton variant="soft" icon="fa-regular fa-copy" @click="copyText(ep.url)">{{ copy.copy }}</AdminButton>
          </li>
        </ul>
      </AdminPanel>

      <AdminPanel :title="copy.body" icon="fa-solid fa-code">
        <ul class="bcp__fields">
          <li v-for="f in copy.bodyFields" :key="f.field">
            <code>{{ f.field }} = {{ f.value }}</code>
            <span>{{ f.note }}</span>
          </li>
        </ul>
      </AdminPanel>

      <BotConfigTables :flows="config.flows" :rules="config.rules" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.bcp {
  @include flex(column, stretch, flex-start, 1rem);

  &__status {
    @include flex(column, stretch, flex-start, 0.85rem);
  }

  &__name {
    @include flex(row, baseline, flex-start, 0.6rem);

    span {
      @include eyebrow;
      font-size: 0.62rem;
      color: $ink-muted;
    }

    strong {
      @include display($text-lg, 800, 115%);
      color: $accent-deep;
    }
  }

  &__flags {
    list-style: none;
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;

    li {
      @include flex(row, center, flex-start, 0.45rem);
      padding: 0.35rem 0.75rem;
      border-radius: $radius-pill;
      background: $sand;
      color: $ink-soft;
      font-size: $text-sm;
      font-weight: 600;

      &.bcp__flag--ok {
        background: $success-bg;
        color: darken($success, 8%);
      }

      &.bcp__flag--warn {
        background: $warning-bg;
        color: darken($warning, 24%);
      }
    }
  }

  &__steps {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.65rem);
    font-size: $text-sm;
    line-height: 1.45;

    li {
      @include flex(row, flex-start, flex-start, 0.65rem);
    }
  }

  &__n {
    @include flex(row, center, center);
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: $accent-deep;
    color: #fff;
    font-family: $font-mono;
    font-size: 0.7rem;
    font-weight: 700;
  }

  &__endpoints {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__ep {
    @include flex(row, center, space-between, 0.6rem);
    flex-wrap: wrap;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    background: $alu-light;
    border: 1px solid $line;
  }

  &__ep-text {
    flex: 1 1 14rem;
    min-width: 0;
  }

  &__ep-name {
    font-size: $text-sm;
    font-weight: 700;
  }

  &__method {
    margin-right: 0.3rem;
    padding: 0.08rem 0.4rem;
    border-radius: 6px;
    background: $accent-deep;
    color: #fff;
    font-family: $font-mono;
    font-size: 0.64rem;
  }

  &__url {
    display: block;
    margin-top: 0.2rem;
    font-family: $font-mono;
    font-size: 0.74rem;
    color: $ink-soft;
    overflow-wrap: anywhere;
  }

  &__fields {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);

    li {
      @include flex(row, baseline, flex-start, 0.3rem 0.75rem);
      flex-wrap: wrap;
      font-size: $text-sm;
      color: $ink-soft;
    }

    code {
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      background: $accent-soft;
      color: $accent-deep;
      font-family: $font-mono;
      font-size: 0.78rem;
      font-weight: 600;
    }
  }
}
</style>
