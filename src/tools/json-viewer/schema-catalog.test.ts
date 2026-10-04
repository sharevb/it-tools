import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_SCHEMA_CATALOG_URL, fetchSchemaCatalog, resolveSchemaCatalogUrl } from './schema-catalog';

describe('schema-catalog', () => {
  const mirror = { 'json-schemas': { 'catalog-url': ' https://intranet.example/schemastore/catalog.json ' } };

  it('uses schemastore.org online and no catalog offline when no mirror is configured', () => {
    expect(resolveSchemaCatalogUrl({}, false)).to.equal(DEFAULT_SCHEMA_CATALOG_URL);
    expect(resolveSchemaCatalogUrl({}, true)).to.equal('');
  });

  it('uses the configured mirror online and offline', () => {
    expect(resolveSchemaCatalogUrl(mirror, false)).to.equal('https://intranet.example/schemastore/catalog.json');
    expect(resolveSchemaCatalogUrl(mirror, true)).to.equal('https://intranet.example/schemastore/catalog.json');
  });

  it('does not fetch without a catalog URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    expect(await fetchSchemaCatalog('')).to.deep.equal([]);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
