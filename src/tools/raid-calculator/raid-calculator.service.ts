export { raidCalculations };

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
    about: 'RAID 0 splits data evenly across 2 or more disks without redunancy or fault tolerance creating one large storage space.',
    requirements: 'RAID 0 requires at least 1 disk',
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
      return 'None';
    },
  },
  raid_1: {
    about: 'RAID 1 consists of an exact copy of the data (mirror) across two or more disks. The array will operate as long as at least one drive is operational.',
    requirements: 'RAID 1 requires at least 1 disk',
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
      return `${num - 1} drive failures`;
    },
  },
  raid_5: {
    about: 'RAID 5 uses block level striping with parity. This allows for fault tolerance with a storage reduction equal to one drive for the parity information.',
    requirements: 'RAID 5 requires at least 3 disks',
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
      return '1 drive failure';
    },
  },
  raid_6: {
    about: 'RAID 6 is similiar to RAID 5 but with an additional parity block. This allows for an additional disk failure at the cost of storage reduction equal to two drives.',
    requirements: 'RAID 6 requires at least 4 disks',
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
      return '2 drive failures';
    },
  },
  raid_7: {
    about: 'RAID 7/RAID TP (non-standard) is similiar to RAID 5 and RAID 6 but with a third parity block. This allows for a third disk failure at the cost of storage reduction equal to three drives.',
    requirements: 'RAID 7 requires at least 5 disks',
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
      return '3 drive failures';
    },
  },
  raid_10: {
    about: 'RAID 10 is a stripe of mirrors (RAID 1 + RAID 0). Each set of drives is mirrored and striped together so that each drive in the set is fault tolerant within the group.',
    requirements: 'RAID 10 requires an even number of at least 4 disks',
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
      return '1 drive failure per mirrored set';
    },
  },
  raid_50: {
    about: 'RAID 50 stripes multiple RAID 5 arrays together (RAID 5 + RAID 0). Each RAID 5 set can sustain a single drive failure.',
    requirements: 'RAID 50 requires at least 6 disks with 3 minimum per stripe. Stripes must contain an equal number of disks.',
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
      return '1 drive failure per RAID 5 set';
    },
  },
  raid_60: {
    about: 'RAID 60 stripes multiple RAID 6 arrays together (RAID 6 + RAID 0). Each RAID 6 set can sustain a two drive failures.',
    requirements: 'RAID 60 requires at least 8 disks with 4 minimum per stripe. Stripes must contain an equal number of disks.',
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
      return '2 drive failures per RAID 6 set';
    },
  },
  raid_70: {
    about: 'RAID 70 stripes multiple RAID 7 arrays together (RAID 7 + RAID 0). Each RAID 7 set can sustain a three drive failures.',
    requirements: 'RAID 70 requires at least 10 disks with 5 minimum per stripe. Stripes must contain an equal number of disks.',
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
      return '3 drive failures per RAID 7 set';
    },
  },
};
