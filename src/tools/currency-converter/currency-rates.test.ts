import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CURRENCY_API_URL, convertWithRates, currencyRatesUrl, fetchCurrencyRates } from './currency-rates';

describe('currency-rates', () => {
  it('builds the jsDelivr URL by default', () => {
    expect(currencyRatesUrl(DEFAULT_CURRENCY_API_URL, ' EUR ')).to.equal(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
    );
  });

  it('builds mirror URLs with or without a trailing slash', () => {
    expect(currencyRatesUrl('https://intranet.example/currency-api/', 'usd')).to.equal(
      'https://intranet.example/currency-api/v1/currencies/usd.json',
    );
    expect(currencyRatesUrl('https://intranet.example/currency-api', 'usd')).to.equal(
      'https://intranet.example/currency-api/v1/currencies/usd.json',
    );
  });

  it('fetches the rates of the base currency and converts with them', async () => {
    const fetchFn = vi.fn<(url: string) => Promise<Response>>(
      async () => new Response(JSON.stringify({ date: '2026-10-04', eur: { usd: 1.1, sek: 11.5 } })),
    );

    const rates = await fetchCurrencyRates('https://intranet.example/currency-api/', 'EUR', fetchFn);

    expect(fetchFn).toHaveBeenCalledWith('https://intranet.example/currency-api/v1/currencies/eur.json');
    expect(convertWithRates(rates, 2, 'USD')).to.equal(2.2);
    expect(convertWithRates(rates, 2, 'xyz')).toBeNaN();
  });
});
