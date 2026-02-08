import ICAL from 'ical.js';
import { URI as OTPURI } from 'otpauth-migration';

import { translate as t } from '@/plugins/i18n.plugin';

interface OTPAuthURI {
  type: string
  label: {
    issuer?: string
    account?: string
    raw: string
  }
  params: Record<string, string>
  uri: string
}

function parseOtpAuthUri(uri: string): OTPAuthURI | null {
  const url = new URL(uri);

  if (url.protocol !== 'otpauth:') {
    return null;
  }

  // url.hostname contains the OTP type (totp, hotp, etc.)
  const type = url.hostname;

  // url.pathname starts with "/", so strip it
  const rawLabel = decodeURIComponent(url.pathname.slice(1));

  let issuer: string | undefined;
  let account: string | undefined;

  const labelParts = rawLabel.split(':');
  if (labelParts.length > 1) {
    issuer = labelParts[0];
    account = labelParts.slice(1).join(':');
  }
  else {
    account = rawLabel;
  }

  // Extract query parameters
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  // If issuer missing in label but present in params, use it
  if (!issuer && params.issuer) {
    issuer = params.issuer;
  }

  return {
    type,
    label: {
      issuer,
      account,
      raw: rawLabel,
    },
    params,
    uri,
  };
}

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
  if (qrContent.startsWith('otpauth:')) {
    return {
      type: t('tools.qr-code-decoder.service.text.otpauth'),
      value: parseOtpAuthUri(qrContent),
    };
  }
  if (qrContent.startsWith('otpauth-migration:')) {
    const otpauthUris = OTPURI.toOTPAuthURIs(qrContent);
    return {
      type: t('tools.qr-code-decoder.service.text.otpmigration'),
      value: otpauthUris.map(otpauthUri => parseOtpAuthUri(otpauthUri)),
    };
  }
  if (/^(?:https?|ftp):\/\//.test(qrContent)) {
    return {
      type: t('tools.websocket-tester.texts.label-url'),
      value: qrContent,
    };
  }
  return {
    type: t('tools.categories.text'),
    value: qrContent,
  };
}
