// eslint-disable-next-line no-restricted-imports
import { useClipboard, useClipboardItems } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import type { MaybeRefOrGetter } from 'vue';
import { translate as t } from '@/plugins/i18n.plugin';

export function useCopy({ source, text = t('tools.copy.text.copied-to-the-clipboard'), createToast = true }: { source?: MaybeRefOrGetter<string>; text?: string; createToast?: boolean } = {}) {
  const { copy, copied, ...rest } = useClipboard({
    source,
    legacy: true,
  });

  const message = useMessage();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy(content);
      }

      if (createToast) {
        message.success(notificationMessage ?? text);
      }
    },
  };
}

export function useCopyClipboardItems({ source, text = t('tools.copy.text.copied-to-the-clipboard'), createToast = true }: { source?: MaybeRefOrGetter<Array<{ mime: string; content: string }>>; text?: string; createToast?: boolean } = {}) {
  function toClipboardItem(item: { mime: string; content: string }) {
    return new ClipboardItem({
      [item.mime]: new Blob([item.content], { type: item.mime }),
    });
  }
  const sourceClipboardItems = computed(() => (toValue(source) || []).map(toClipboardItem));
  const { copy, copied, ...rest } = useClipboardItems({
    source: sourceClipboardItems,
  });

  const message = useMessage();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: { mime: string; content: string }[], { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy((content || []).map(toClipboardItem));
      }

      if (createToast) {
        message.success(notificationMessage ?? text);
      }
    },
  };
}

export function useCopyHtml({ sourceHtml, fallbackText, toastText = t('tools.copy.text.copied-to-the-clipboard'), createToast = true }: { sourceHtml?: MaybeRefOrGetter<string>; fallbackText?: MaybeRefOrGetter<string>; toastText?: string; createToast?: boolean } = {}) {
  const message = useMessage();

  const copied = ref(false);
  const error = ref('');

  function legacyCopy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
    }
    finally {
      document.body.removeChild(textarea);
    }
  }

  async function copyHtml(html: string, fallbackText?: string) {
    copied.value = false;
    error.value = '';

    try {
      const ClipboardItemCtor = (window as any).ClipboardItem;

      if (navigator.clipboard && ClipboardItemCtor) {
        // Modern HTML clipboard support
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([fallbackText || html], { type: 'text/plain' });
        const item = new ClipboardItemCtor({ 'text/plain': blobText, 'text/html': blobHtml });
        await navigator.clipboard.write([item]);
      }
      else if (navigator.clipboard?.writeText) {
        // Async text fallback
        await navigator.clipboard.writeText(fallbackText || html);
      }
      else {
        // Legacy execCommand fallback
        legacyCopy(fallbackText || html);
      }

      copied.value = true;
    }
    catch (e: any) {
      error.value = e.toString();
    }
  }

  return {
    isJustCopied: copied,
    async copy(html?: string, text?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      if (sourceHtml) {
        await copyHtml(toValue(sourceHtml), toValue(fallbackText));
      }
      else if (html) {
        await copyHtml(html, text);
      }

      if (createToast) {
        if (error.value) {
          message.error(error.value);
        }
        else {
          message.success(notificationMessage ?? toastText);
        }
      }
    },
    error,
  };
}
