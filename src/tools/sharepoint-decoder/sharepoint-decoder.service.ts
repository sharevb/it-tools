import { translate as t } from '@/plugins/i18n.plugin';

export function decodeSharePointsURL(sharePointsUrl: string) {
  if (!sharePointsUrl.match(/\.sharepoint\.com/)) {
    throw new Error(t('tools.sharepoint-decoder.text.invalid-sharepoint-url-provided'));
  }

  const url = new URL(sharePointsUrl);
  return `${url.protocol}//${url.hostname}${url.searchParams.get('id')}`;
}
