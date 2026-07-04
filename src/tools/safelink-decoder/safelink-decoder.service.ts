import { translate as t } from '@/plugins/i18n.plugin';

export function decodeSafeLinksURL(safeLinksUrl: string) {
  if (!/\.safelinks\.protection\.outlook\.com/.test(safeLinksUrl)) {
    throw new Error(t('tools.safelin-decoder.text.invalid-safelinks-url-provided'));
  }

  return new URL(safeLinksUrl).searchParams.get('url');
}
