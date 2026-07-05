import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CInputNumberI18N from './n-input-number-i18n.vue';
import { formatNumber, parseNumber } from './n-input-number-i18n.utils';

describe('CInputNumberI18N', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Should render', async () => {
    const wrapper = mount(CInputNumberI18N);

    expect(wrapper.html()).toBeDefined();
  });

  it('Format value', () => {
    expect(formatNumber(1.3)).to.equal('1.3');
  });

  it('Parse a dot value', () => {
    expect(parseNumber('1.3')).to.equal(1.3);
  });

  it('Parse a comma value', () => {
    expect(parseNumber('1,3')).to.equal(1.3);
  });

  it('Parse a other values', () => {
    expect(parseNumber('$1,225.12')).to.equal(1225.12);
    expect(parseNumber('1,225.12')).to.equal(1225.12);
    expect(parseNumber('1.225,12')).to.equal(1225.12);
    expect(parseNumber('1225,12')).to.equal(1225.12);
    expect(parseNumber('1225.12')).to.equal(1225.12);
    expect(parseNumber('1,111,1225.12')).to.equal(11111225.12);
    expect(parseNumber('1.111.1225,12')).to.equal(11111225.12);
    expect(parseNumber('1.111.1225,12')).to.equal(11111225.12);
    expect(parseNumber('1.111.122')).to.equal(1111122);
  });
});
