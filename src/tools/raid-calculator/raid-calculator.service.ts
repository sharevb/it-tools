export { raidCalculations };

import { translate as t } from '@/plugins/i18n.plugin';

interface RaidType {
  about: string
  requirements: string
  validate(num: number, size: number, stripeSize: number): boolean
  capacity(num: number, size: number, stripeSize: number, unit: number): number
  efficiency(num: number, stripeSize: number): number
  fault(num: number, size: number, unit: number): string
}

const raidCalculations: { [key: string]: RaidType } = {
  raid_0: {
    about: t('tools.raid-calculator.service.text.raid-0-splits-data-evenly-across-2-or-more-disks-without-redunancy-or-fault-tolerance-creating-one-large-storage-space'),
    requirements: t('tools.raid-calculator.service.text.raid-0-requires-at-least-1-disk'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num > 1;
    },
    capacity(num: number, size: number, _stripeSize: number, unit: number) {
      // total disks * size
      return (num * size) * unit;
    },
    efficiency(_num: number, _stripeSize: number) {
      // uses 100% of space
      return 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      return t('tools.__i18n_ally_root__.mac-address-generator.texts.label-none');
    },
  },
  raid_1: {
    about: t('tools.raid-calculator.service.text.raid-1-consists-of-an-exact-copy-of-the-data-mirror-across-two-or-more-disks-the-array-will-operate-as-long-as-at-least-one-drive-is-operational'),
    requirements: t('tools.raid-calculator.service.text.raid-1-requires-at-least-1-disk'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num > 1;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // total size is size of a single drive
      return size * unit;
    },
    efficiency(num: number, _stripeSize: number) {
      // 1/N
      return (1 / num) * 100;
    },
    fault(num: number, _size: number, _unit: number) {
      // FT = total - 1
      return t('tools.raid-calculator.text.num-1-drive-failures', [num - 1]);
    },
  },
  raid_5: {
    about: t('tools.raid-calculator.service.text.raid-5-uses-block-level-striping-with-parity-this-allows-for-fault-tolerance-with-a-storage-reduction-equal-to-one-drive-for-the-parity-information'),
    requirements: t('tools.raid-calculator.service.text.raid-5-requires-at-least-3-disks'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num >= 3;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // (N-1) * S (one drive for parity)
      return ((num - 1) * size) * unit;
    },
    efficiency(num: number, _stripeSize: number) {
      // 1 - (1/N)
      return (1 - (1 / num)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // always 1 failure
      return t('tools.raid-calculator.service.text.1-drive-failure');
    },
  },
  raid_6: {
    about: t('tools.raid-calculator.service.text.raid-6-is-similiar-to-raid-5-but-with-an-additional-parity-block-this-allows-for-an-additional-disk-failure-at-the-cost-of-storage-reduction-equal-to-two-drives'),
    requirements: t('tools.raid-calculator.service.text.raid-6-requires-at-least-4-disks'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num >= 4;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // (N-2) * S (2 parity)
      return ((num - 2) * size) * unit;
    },
    efficiency(num: number, _stripeSize: number) {
      // 1 - (2/N)
      return (1 - (2 / num)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // always 2 drive failures
      return t('tools.raid-calculator.service.text.2-drive-failures');
    },
  },
  raid_7: {
    about: t('tools.raid-calculator.service.text.raid-7-raid-tp-non-standard-is-similiar-to-raid-5-and-raid-6-but-with-a-third-parity-block-this-allows-for-a-third-disk-failure-at-the-cost-of-storage-reduction-equal-to-three-drives'),
    requirements: t('tools.raid-calculator.service.text.raid-7-requires-at-least-5-disks'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num >= 5;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // (N-3) * S (3 parity)
      return ((num - 3) * size) * unit;
    },
    efficiency(num: number, _stripeSize: number) {
      // 1 - (3/N)
      return (1 - (3 / num)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // always 3 drive failures
      return t('tools.raid-calculator.service.text.3-drive-failures');
    },
  },
  raid_10: {
    about: t('tools.raid-calculator.service.text.raid-10-is-a-stripe-of-mirrors-raid-1-raid-0-each-set-of-drives-is-mirrored-and-striped-together-so-that-each-drive-in-the-set-is-fault-tolerant-within-the-group'),
    requirements: t('tools.raid-calculator.service.text.raid-10-requires-an-even-number-of-at-least-4-disks'),
    validate(num: number, _size: number, _stripeSize: number) {
      return num >= 4 && num % 2 === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // Total disks (stripe)/2 (mirror)
      return ((num * size) / 2) * unit;
    },
    efficiency(_num: number, _stripeSize: number) {
      // 1/2 (1/strips per stripe, 2 in this case)
      return 50;
    },
    fault(_num: number, _size: number, _unit: number) {
      // one per mirror
      return t('tools.raid-calculator.service.text.1-drive-failure-per-mirrored-set');
    },
  },
  raid_50: {
    about: t('tools.raid-calculator.service.text.raid-50-stripes-multiple-raid-5-arrays-together-raid-5-raid-0-each-raid-5-set-can-sustain-a-single-drive-failure'),
    requirements: t('tools.raid-calculator.service.text.raid-50-requires-at-least-6-disks-with-3-minimum-per-stripe-stripes-must-contain-an-equal-number-of-disks'),
    validate(num: number, size: number, stripeSize: number) {
      return num >= 6 && stripeSize >= 3 && num % stripeSize === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // RAID 5 per stripe
      const perStripe = ((stripeSize - 1) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (1 / strips per stripe)
      return (1 - (1 / stripeSize)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // one per set
      return t('tools.raid-calculator.service.text.1-drive-failure-per-raid-5-set');
    },
  },
  raid_60: {
    about: t('tools.raid-calculator.service.text.raid-60-stripes-multiple-raid-6-arrays-together-raid-6-raid-0-each-raid-6-set-can-sustain-two-drive-failures'),
    requirements: t('tools.raid-calculator.service.text.raid-60-requires-at-least-8-disks-with-4-minimum-per-stripe-stripes-must-contain-an-equal-number-of-disks'),
    validate(num: number, size: number, stripeSize: number) {
      return num >= 8 && stripeSize >= 4 && num % stripeSize === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // RAID 6 per stripe
      const perStripe = ((stripeSize - 2) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (2 / strips per stripe)
      return (1 - (2 / stripeSize)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // 2 per set
      return t('tools.raid-calculator.service.text.2-drive-failures-per-raid-6-set');
    },
  },
  raid_70: {
    about: t('tools.raid-calculator.service.text.raid-70-stripes-multiple-raid-7-arrays-together-raid-7-raid-0-each-raid-7-set-can-sustain-three-drive-failures'),
    requirements: t('tools.raid-calculator.service.text.raid-70-requires-at-least-10-disks-with-5-minimum-per-stripe-stripes-must-contain-an-equal-number-of-disks'),
    validate(num: number, size: number, stripeSize: number) {
      return num >= 10 && stripeSize >= 5 && num % stripeSize === 0;
    },
    capacity(num: number, size: number, stripeSize: number, unit: number) {
      // RAID 7 per stripe
      const perStripe = ((stripeSize - 3) * size) * unit;

      // sum each stripe
      return perStripe * (num / stripeSize);
    },
    efficiency(num: number, stripeSize: number) {
      // 1 - (3 / strips per stripe)
      return (1 - (3 / stripeSize)) * 100;
    },
    fault(_num: number, _size: number, _unit: number) {
      // 2 per set
      return t('tools.raid-calculator.service.text.3-drive-failures-per-raid-7-set');
    },
  },
};
