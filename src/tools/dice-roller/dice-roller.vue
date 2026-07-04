<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { DiceRoll } from '@dice-roller/rpg-dice-roller';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { t } = useI18n();

const dicesNotations = useQueryParamOrStorage({ name: 'dices', storageName: 'dice-roll:dices', defaultValue: '3d6' });
const [diceRollResult, refreshDiceRollResult] = computedRefreshable(() => {
  try {
    return {
      error: '',
      roll: new DiceRoll(dicesNotations.value),
    };
  }
  catch (e: any) {
    return {
      error: e.toString(),
      roll: null,
    };
  }
});

const diceRollString = computed(() => diceRollResult.value.roll?.output || '');

const { copy } = useCopy({ source: diceRollString, text: t('tools.dice-roller.texts.text-dice-roll-copied-to-the-clipboard') });
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="dicesNotations"
      :label="t('tools.dice-roller.texts.label-dice-roll-notations')" label-position="left"
      :placeholder="t('tools.dice-roller.texts.placeholder-dice-configuration')"
      mb-2
    />
    <n-p mb-2>
      {{ t('tools.dice-roller.texts.tag-for-more-information-about-dice-notation-see') }}<n-a href="https://dice-roller.github.io/documentation/guide/notation/" target="_blank">
        {{ t('tools.dice-roller.texts.tag-here') }}
      </n-a>
    </n-p>

    <c-alert v-if="diceRollResult.error" mb-2>
      {{ diceRollResult.error }}
    </c-alert>

    <c-card v-if="!diceRollResult.error" :title="t('tools.dice-roller.texts.title-roll-result')" mb-2>
      <input-copyable :value="diceRollResult.roll?.output" readonly mb-1 />
      <input-copyable :value="diceRollResult.roll?.total" :label="t('tools.dice-roller.texts.label-total')" readonly :placeholder="t('tools.dice-roller.texts.placeholder-dice-roll-total')" label-position="left" mb-1 />
    </c-card>

    <div mb-2 flex justify-center gap-3>
      <c-button @click="copy()">
        {{ t('tools.dice-roller.texts.tag-copy-roll-result') }}
      </c-button>
      <c-button @click="refreshDiceRollResult">
        {{ t('tools.dice-roller.texts.tag-refresh-roll') }}
      </c-button>
    </div>

    <c-card v-if="!diceRollResult.error" :title="t('tools.dice-roller.texts.title-dice-notation-stats')" mb-2>
      <input-copyable :value="diceRollResult.roll?.minTotal" readonly :label="t('tools.dice-roller.texts.label-min-total')" label-position="left" mb-1 />
      <input-copyable :value="diceRollResult.roll?.maxTotal" readonly :label="t('tools.dice-roller.texts.label-max-total')" label-position="left" mb-1 />
      <input-copyable :value="diceRollResult.roll?.averageTotal" readonly :label="t('tools.dice-roller.texts.label-avg-total')" label-position="left" mb-1 />
    </c-card>
  </c-card>
</template>
