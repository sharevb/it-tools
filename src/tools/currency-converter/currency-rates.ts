// Exchange rates from https://github.com/fawazahmed0/exchange-api, read the way currency-exchanger-js did, but from a
// configurable base URL so an intranet mirror of the package's file layout can be used instead of jsDelivr.

/** Root of the @fawazahmed0/currency-api package; it serves `v1/currencies/<code>.json` with the latest rates */
export const DEFAULT_CURRENCY_API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/';

export function currencyRatesUrl(baseUrl: string, currency: string) {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${base}v1/currencies/${currency.trim().toLowerCase()}.json`;
}

/** Rates of one unit of `currency` in every other currency, keyed by lowercase currency code */
export async function fetchCurrencyRates(
  baseUrl: string,
  currency: string,
  fetchFn: (url: string) => Promise<Response> = fetch,
): Promise<Record<string, number>> {
  const response = await fetchFn(currencyRatesUrl(baseUrl, currency));
  const data = await response.json();
  return data[currency.trim().toLowerCase()];
}

/** `amount` of the base currency converted with `rates` (NaN when the target currency is unknown, like before) */
export function convertWithRates(rates: Record<string, number>, amount: number, toCurrency: string) {
  return amount * rates[toCurrency.trim().toLowerCase()];
}
