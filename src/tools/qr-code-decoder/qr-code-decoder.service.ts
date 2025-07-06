import ICAL from 'ical.js';

import { translate as t } from '@/plugins/i18n.plugin';

export function parseQRData(qrContent: string | null) {
  if (!qrContent) {
    return { type: t('tools.qr-code-decoder.service.text.unknown'), value: '' };
  }
  if (qrContent.startsWith('BEGIN:VCALENDAR')) {
    return { type: t('tools.qr-code-decoder.service.text.ical'), value: ICAL.parse(qrContent?.trim()) };
  }
  if (qrContent.startsWith('TEL:')) {
    return { type: t('tools.qr-code-decoder.service.text.phone'), value: qrContent.substring(4)?.trim() };
  }
  if (qrContent.startsWith('MATMSG:')) {
    // MATMSG:TO: email@example.com;SUB:email subject;BODY:Email text;;
    const parsing = /^MATMSG:(?:TO:([^;]*);)?(?:SUB:([^;]*);)?(?:BODY:([^;]*))?;;$/.exec(qrContent) || [];
    return {
      type: t('tools.qr-code-decoder.service.text.email'),
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('mailto:')) {
    // mailto:email@example.com?subject=email subject&body=Email text
    const parsing = /^mailto:([^\?]+)\?subject=([^\&]*)(?:&body=(.*))$/.exec(qrContent) || [];
    return {
      type: t('tools.qr-code-decoder.service.text.email-0'),
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('SMTP:')) {
    // SMTP:email@example.com:email subject:Email text
    const parsing = /^SMTP:([^:]+)(?::([^:]*))(?::([^:]*))?$/.exec(qrContent) || [];
    return {
      type: t('tools.qr-code-decoder.service.text.email-1'),
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('smsto:')) {
    // smsto:${phoneNumber}:${message}
    const parsing = /^smsto:([^:]+)(?::(.+))$/.exec(qrContent) || [];
    return {
      type: t('tools.qr-code-decoder.service.text.sms'),
      value: {
        to: parsing[1]?.trim(),
        message: parsing[2]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('WIFI:')) {
    // WIFI:T:${authentication};S:${name};${authentication !== 'nopass' ? `P:${password};` : ''}H:${hidden};
    const parsing = /^WIFI:T:([^;]+);S:([^;]+);(?:P:([^;]+);)?(?:H:([^;]+);)?$/.exec(qrContent) || [];
    return {
      type: t('tools.qr-code-decoder.service.text.wifi'),
      value: {
        authentication: parsing[1]?.trim(),
        name: parsing[2]?.trim(),
        password: parsing[3]?.trim(),
        hidden: parsing[4]?.trim(),
      },
    };
  }
  if (/^(?:https?|ftp):\/\//.test(qrContent)) {
    return {
      type: t('tools.__i18n_ally_root__.websocket-tester.texts.label-url'),
      value: qrContent,
    };
  }
  return {
    type: t('tools.__i18n_ally_root__.categories.text'),
    value: qrContent,
  };
}
