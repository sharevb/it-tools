import { translate as t } from '@/plugins/i18n.plugin';

export function decodeSafeLinksURL(safeLinksUrl: string) {
  if (!safeLinksUrl.match(/\.safelinks\.protection\.outlook\.com/)) {
    throw new Error(t('tools.safelin-decoder.text.invalid-safelinks-url-provided'));
  }

  return new URL(safeLinksUrl).searchParams.get('url');
}
