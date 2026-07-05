<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const form = ref({
  raidLevel: 'RAID 5',
  numDrives: 6,
  mtbf: 1000000,
  rebuildTime: 24,
  ber: -15,
  driveCapacityTB: 4,
  yearsToSimulate: 5,
});

const raidOptions = [
  { label: t('tools.mttdl-calculator.texts.label-raid-0'), value: 'RAID 0' },
  { label: t('tools.mttdl-calculator.texts.label-raid-1'), value: 'RAID 1' },
  { label: t('tools.mttdl-calculator.texts.label-raid-5'), value: 'RAID 5' },
  { label: t('tools.mttdl-calculator.texts.label-raid-6'), value: 'RAID 6' },
  { label: t('tools.mttdl-calculator.texts.label-raid-10'), value: 'RAID 10' },
  { label: t('tools.mttdl-calculator.texts.label-raid-z1'), value: 'RAID-Z1' },
  { label: t('tools.mttdl-calculator.texts.label-raid-z2'), value: 'RAID-Z2' },
  { label: t('tools.mttdl-calculator.texts.label-raid-z3'), value: 'RAID-Z3' },
  { label: t('tools.mttdl-calculator.texts.label-raid-50'), value: 'RAID 50' },
];

function basicMTTDL(raidLevel: string, numDrives: number, mtbf: number, rebuildTime: number) {
  const λ = 1 / mtbf;
  switch (raidLevel) {
    case 'RAID 0':
      return mtbf / numDrives;
    case 'RAID 1':
      return mtbf / (numDrives * (numDrives - 1));
    case 'RAID 5':
      return mtbf / (numDrives * (numDrives - 1) * λ * rebuildTime);
    case 'RAID 6':
      return mtbf / (numDrives * (numDrives - 1) * (numDrives - 2) * λ * rebuildTime);
    case 'RAID 10':
      return mtbf / (numDrives / 2);
    default:
      return 0;
  }
}

function getMTTDL(
  { raidLevel, numDrives, mtbf, rebuildTime, ber, driveCapacityTB }:
  { raidLevel: string; numDrives: number; mtbf: number; rebuildTime: number; ber: number; driveCapacityTB: number },
) {
  const λ = 1 / mtbf;
  const bitsPerDrive = driveCapacityTB * 1e12 * 8;
  const unrecoverableReadProb = 1 - (1 - 10 ** ber) ** bitsPerDrive;
  const groupSize = 5;
  const numGroups = Math.floor(numDrives / groupSize);

  switch (raidLevel) {
    case 'RAID-Z1':
      return mtbf / (numDrives * (numDrives - 1) * λ * rebuildTime * unrecoverableReadProb);
    case 'RAID-Z2':
      return mtbf / (numDrives * (numDrives - 1) * (numDrives - 2) * λ * rebuildTime * unrecoverableReadProb);
    case 'RAID-Z3':
      return mtbf / (numDrives * (numDrives - 1) * (numDrives - 2) * (numDrives - 3) * λ * rebuildTime * unrecoverableReadProb);
    case 'RAID 50':
      return mtbf / (numGroups * groupSize * (groupSize - 1) * λ * rebuildTime);
    default:
      return basicMTTDL(raidLevel, numDrives, mtbf, rebuildTime);
  }
}

const computedMTTDL = computed(() => {
  const hours = getMTTDL(form.value);
  return {
    hours,
    years: hours / 8760,
  };
});

function simulateFailureProbability(mttdl: number, years: number) {
  const hours = years * 365.25 * 24;
  return 1 - Math.exp(-hours / mttdl);
}

const failureProbability = computed(() =>
  simulateFailureProbability(computedMTTDL.value.hours, form.value.yearsToSimulate),
);
</script>

<template>
  <NCard :title="t('tools.mttdl-calculator.texts.title-mttdl-failure-probability-calculator')" style="max-width: 600px; margin: auto;">
    <NForm :model="form" label-width="190px" label-placement="left">
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-raid-level')">
        <NSelect v-model:value="form.raidLevel" :options="raidOptions" :placeholder="t('tools.mttdl-calculator.texts.placeholder-select-raid-level')" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-number-of-drives')">
        <NInputNumber v-model:value="form.numDrives" :min="1" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-drive-mtbf-hours')">
        <NInputNumber v-model:value="form.mtbf" :min="1" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-rebuild-time-hours')">
        <NInputNumber v-model:value="form.rebuildTime" :min="1" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-bit-error-rate-ber-in-1ex')">
        <NInputNumber v-model:value="form.ber" :min="-18" :max="-6" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-drive-capacity-tb')">
        <NInputNumber v-model:value="form.driveCapacityTB" :min="1" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-years-for-failure-probability')">
        <NInputNumber v-model:value="form.yearsToSimulate" :min="1" />
      </NFormItem>

      <NDivider />

      <NFormItem :label="t('tools.mttdl-calculator.texts.label-mttdl-hours')">
        <input-copyable :value="computedMTTDL.hours.toFixed(2)" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-mttdl-years')">
        <input-copyable :value="computedMTTDL.years.toFixed(2)" />
      </NFormItem>
      <NFormItem :label="t('tools.mttdl-calculator.texts.label-failure-probability')">
        <input-copyable :value="`${(failureProbability * 100).toFixed(4)}%`" />
      </NFormItem>

      <NDivider />

      <details>
        <summary>{{ t('tools.mttdl-calculator.texts.tag-key-terms-explained') }}</summary>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-raid-level') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-raid-redundant-array-of-independent-disks-is-a-method-of-combining-multiple-physical-drives-into-one-logical-unit-to-improve-performance-redundancy-or-both') }}</p>
        <table border="1" cellpadding="8" cellspacing="0">
          <thead>
            <tr>
              <th>{{ t('tools.mttdl-calculator.texts.tag-raid-level') }}</th>
              <th>{{ t('tools.mttdl-calculator.texts.tag-description') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-0') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-striping-only-no-redundancy-fast-but-risky-if-one-drive-fails-all-data-is-lost') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-1') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-mirroring-data-is-duplicated-across-drives-high-redundancy-low-capacity-efficiency') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-5') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-striping-with-parity-can-tolerate-one-drive-failure-balanced-speed-and-redundancy') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-6') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-double-parity-can-survive-two-drive-failures') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-10') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-mirrored-pairs-striped-together-high-performance-and-redundancy') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-z1-z2-z3') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-zfs-based-raid-levels-with-single-double-or-triple-parity-designed-for-data-integrity') }}</td>
            </tr>
            <tr>
              <td>{{ t('tools.mttdl-calculator.texts.tag-raid-50') }}</td>
              <td>{{ t('tools.mttdl-calculator.texts.tag-stripe-of-raid-5-arrays-combines-performance-of-raid-0-with-redundancy-of-raid-5') }}</td>
            </tr>
          </tbody>
        </table>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-️-mtbf-mean-time-between-failures') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-the-average-time-in-hours-a-drive-is-expected-to-operate-before-failing-higher-mtbf-means-more-reliable-hardware') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-rebuild-time') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-the-time-required-to-reconstruct-data-on-a-replacement-drive-after-a-failure-longer-rebuild-times-increase-the-risk-of-a-second-failure-during-recovery') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-mttdl-mean-time-to-data-loss') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-a-statistical-estimate-of-how-long-a-raid-system-can-operate-before-data-loss-occurs-it-considers-drive-failures-rebuild-time-and-raid-redundancy-higher-mttdl-means-a-safer-system') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-bit-error-rate-ber') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-the-probability-that-a-bit-read-from-a-disk-will-be-incorrect-due-to-hardware-limitations-even-tiny-bers-like-1-in-a-trillion-can-cause-issues-during-rebuilds-especially-with-large-drives') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-unrecoverable-read-error-ure') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-occurs-when-a-drive-fails-to-read-a-sector-during-rebuild-ber-contributes-to-ure-risk-which-can-compromise-raid-recovery') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-drive-capacity-tb') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-total-storage-per-drive-larger-drives-take-longer-to-rebuild-and-are-more-susceptible-to-ber-related-errors') }}</p>

        <h3>{{ t('tools.mttdl-calculator.texts.tag-failure-probability') }}</h3>
        <p>{{ t('tools.mttdl-calculator.texts.tag-the-chance-that-the-raid-system-will-experience-data-loss-over-a-given-time-period-e-g-5-years-calculated-using-mttdl-and-exponential-failure-models') }}</p>
      </details>
    </NForm>
  </NCard>
</template>
