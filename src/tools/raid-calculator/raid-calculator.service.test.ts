import { describe, expect, it } from 'vitest';
import { raidCalculations } from './raid-calculator.service';

describe('raid-calculator', () => {
  describe('raidCalculations', () => {
    describe('RAID 0', () => {
      it('should validate correctly (num > 1)', () => {
        expect(raidCalculations.raid_0.validate(2, 0, 0)).toBe(true);
        expect(raidCalculations.raid_0.validate(1, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_0.capacity(2, 500, 0, 1)).toBe(1000);
        expect(raidCalculations.raid_0.capacity(3, 500, 0, 1)).toBe(1500);
      });

      it('should have 100% efficiency', () => {
        expect(raidCalculations.raid_0.efficiency(2, 0)).toBe(100);
      });

      it('should have no fault tolerance', () => {
        expect(raidCalculations.raid_0.fault(2, 500, 1)).toBe('None');
      });
    });

    describe('RAID 1', () => {
      it('should validate correctly (num > 1)', () => {
        expect(raidCalculations.raid_1.validate(2, 0, 0)).toBe(true);
        expect(raidCalculations.raid_1.validate(1, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_1.capacity(2, 500, 0, 1)).toBe(500);
        expect(raidCalculations.raid_1.capacity(3, 500, 0, 1)).toBe(500);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_1.efficiency(2, 0)).toBe(50);
      });

      it('should have fault tolerance for 1 drive failure', () => {
        expect(raidCalculations.raid_1.fault(2, 500, 1)).toBe('1 drive failures');
      });
    });

    describe('RAID 5', () => {
      it('should validate correctly (num >= 3)', () => {
        expect(raidCalculations.raid_5.validate(3, 0, 0)).toBe(true);
        expect(raidCalculations.raid_5.validate(2, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_5.capacity(3, 500, 0, 1)).toBe(1000);
        expect(raidCalculations.raid_5.capacity(4, 500, 0, 1)).toBe(1500);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_5.efficiency(3, 0).toFixed(2)).toBe('66.67');
      });

      it('should have fault tolerance for 1 drive failure', () => {
        expect(raidCalculations.raid_5.fault(3, 500, 1)).toBe('1 drive failure');
      });
    });

    describe('RAID 6', () => {
      it('should validate correctly (num >= 4)', () => {
        expect(raidCalculations.raid_6.validate(4, 0, 0)).toBe(true);
        expect(raidCalculations.raid_6.validate(3, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_6.capacity(4, 500, 0, 1)).toBe(1000);
        expect(raidCalculations.raid_6.capacity(5, 500, 0, 1)).toBe(1500);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_6.efficiency(4, 0)).toBe(50);
      });

      it('should have fault tolerance for 2 drive failures', () => {
        expect(raidCalculations.raid_6.fault(4, 500, 1)).toBe('2 drive failures');
      });
    });

    describe('RAID 7', () => {
      it('should validate correctly (num >= 5)', () => {
        expect(raidCalculations.raid_7.validate(5, 0, 0)).toBe(true);
        expect(raidCalculations.raid_7.validate(4, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_7.capacity(5, 500, 0, 1)).toBe(1000);
        expect(raidCalculations.raid_7.capacity(6, 500, 0, 1)).toBe(1500);
        expect(raidCalculations.raid_7.capacity(7, 500, 0, 1)).toBe(2000);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_7.efficiency(5, 0)).toBe(40);
        expect(raidCalculations.raid_7.efficiency(6, 0)).toBe(50);
        expect(raidCalculations.raid_7.efficiency(7, 0)).toBe(57.14285714285714);
      });

      it('should have fault tolerance for 3 drive failures', () => {
        expect(raidCalculations.raid_7.fault(5, 500, 1)).toBe('3 drive failures');
        expect(raidCalculations.raid_7.fault(6, 500, 1)).toBe('3 drive failures');
        expect(raidCalculations.raid_7.fault(7, 500, 1)).toBe('3 drive failures');
      });
    });

    describe('RAID 10', () => {
      it('should validate correctly (num >= 4 and even)', () => {
        expect(raidCalculations.raid_10.validate(4, 0, 0)).toBe(true);
        expect(raidCalculations.raid_10.validate(3, 0, 0)).toBe(false);
        expect(raidCalculations.raid_10.validate(5, 0, 0)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_10.capacity(4, 500, 0, 1)).toBe(1000);
        expect(raidCalculations.raid_10.capacity(6, 500, 0, 1)).toBe(1500);
      });

      it('should have 50% efficiency', () => {
        expect(raidCalculations.raid_10.efficiency(4, 0)).toBe(50);
      });

      it('should have fault tolerance for 1 drive failure per mirrored set', () => {
        expect(raidCalculations.raid_10.fault(4, 500, 1)).toBe('1 drive failure per mirrored set');
      });
    });

    describe('RAID 50', () => {
      it('should validate correctly (num >= 6 and stripeSize >= 3)', () => {
        expect(raidCalculations.raid_50.validate(6, 0, 3)).toBe(true);
        expect(raidCalculations.raid_50.validate(5, 0, 3)).toBe(false);
        expect(raidCalculations.raid_50.validate(6, 0, 2)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_50.capacity(6, 500, 3, 1)).toBe(2000);
        expect(raidCalculations.raid_50.capacity(9, 500, 3, 1)).toBe(3000);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_50.efficiency(6, 3).toFixed(2)).toBe('66.67');
      });

      it('should have fault tolerance for 1 drive failure per RAID 5 set', () => {
        expect(raidCalculations.raid_50.fault(6, 500, 1)).toBe('1 drive failure per RAID 5 set');
      });
    });

    describe('RAID 60', () => {
      it('should validate correctly (num >= 8 and stripeSize >= 4)', () => {
        expect(raidCalculations.raid_60.validate(8, 0, 4)).toBe(true);
        expect(raidCalculations.raid_60.validate(7, 0, 4)).toBe(false);
        expect(raidCalculations.raid_60.validate(8, 0, 3)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_60.capacity(8, 500, 4, 1)).toBe(2000);
        expect(raidCalculations.raid_60.capacity(10, 500, 4, 1)).toBe(2500);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_60.efficiency(8, 4)).toBe(50);
      });

      it('should have fault tolerance for 2 drive failures per RAID 6 set', () => {
        expect(raidCalculations.raid_60.fault(8, 500, 1)).toBe('2 drive failures per RAID 6 set');
      });
    });

    describe('RAID 70', () => {
      it('should validate correctly (num >= 10 and stripeSize >= 5)', () => {
        expect(raidCalculations.raid_70.validate(10, 0, 5)).toBe(true);
        expect(raidCalculations.raid_70.validate(9, 0, 5)).toBe(false);
        expect(raidCalculations.raid_70.validate(10, 0, 4)).toBe(false);
        expect(raidCalculations.raid_70.validate(10, 0, 6)).toBe(false);
      });

      it('should calculate capacity correctly', () => {
        expect(raidCalculations.raid_70.capacity(10, 500, 5, 1)).toBe(2000);
        expect(raidCalculations.raid_70.capacity(15, 500, 5, 1)).toBe(3000);
        expect(raidCalculations.raid_70.capacity(20, 500, 5, 1)).toBe(4000);
      });

      it('should calculate efficiency correctly', () => {
        expect(raidCalculations.raid_70.efficiency(10, 5)).toBe(40);
        expect(raidCalculations.raid_70.efficiency(15, 5)).toBe(40);
        expect(raidCalculations.raid_70.efficiency(20, 5)).toBe(40);
      });

      it('should have fault tolerance for 3 drive failures', () => {
        expect(raidCalculations.raid_70.fault(10, 500, 1)).toBe('3 drive failures per RAID 7 set');
        expect(raidCalculations.raid_70.fault(15, 500, 1)).toBe('3 drive failures per RAID 7 set');
        expect(raidCalculations.raid_70.fault(20, 500, 1)).toBe('3 drive failures per RAID 7 set');
      });
    });
  });
});
