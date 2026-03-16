import ICAL from 'ical.js';
import { URI as OTPURI } from 'otpauth-migration';

interface OTPAuthURI {
  type: string;
  label: {
    issuer?: string;
    account?: string;
    raw: string;
  };
  params: Record<string, string>;
  uri: string;
}

function parseOtpAuthUri(uri: string): OTPAuthURI | null {
  const url = new URL(uri);

  if (url.protocol !== 'otpauth:') {
    return null;
  }

  const type = url.hostname;
  const rawLabel = decodeURIComponent(url.pathname.slice(1));

  let issuer: string | undefined;
  let account: string | undefined;

  const labelParts = rawLabel.split(':');
  if (labelParts.length > 1) {
    issuer = labelParts[0];
    account = labelParts.slice(1).join(':');
  } else {
    account = rawLabel;
  }

  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

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

const TYPE_UNKNOWN = 'Unknown';
const TYPE_ICAL = 'iCal';
const TYPE_PHONE = 'Phone';
const TYPE_EMAIL = 'Email';
const TYPE_SMS = 'SMS';
const TYPE_WIFI = 'Wifi';
const TYPE_OTP_AUTH = 'OTP Auth';
const TYPE_OTP_MIGRATION = 'OTP Migration';
const TYPE_URL = 'URL';

export function parseQRData(qrContent: string | null) {
  if (!qrContent) {
    return { type: TYPE_UNKNOWN, value: '' };
  }
  if (qrContent.startsWith('BEGIN:VCALENDAR')) {
    return { type: TYPE_ICAL, value: ICAL.parse(qrContent?.trim()) };
  }
  if (qrContent.startsWith('TEL:')) {
    return { type: TYPE_PHONE, value: qrContent.substring(4)?.trim() };
  }
  if (qrContent.startsWith('MATMSG:')) {
    const parsing = /^MATMSG:(?:TO:([^;]*);)?(?:SUB:([^;]*);)?(?:BODY:([^;]*))?;;$/.exec(qrContent) || [];
    return {
      type: TYPE_EMAIL,
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('mailto:')) {
    const parsing = /^mailto:([^\?]+)\?subject=([^\&]*)(?:&body=(.*))$/.exec(qrContent) || [];
    return {
      type: TYPE_EMAIL,
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('SMTP:')) {
    const parsing = /^SMTP:([^:]+)(?::([^:]*))(?::([^:]*))?$/.exec(qrContent) || [];
    return {
      type: TYPE_EMAIL,
      value: {
        to: parsing[1]?.trim(),
        subject: parsing[2]?.trim(),
        body: parsing[3]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('smsto:')) {
    const parsing = /^smsto:([^:]+)(?::(.+))$/.exec(qrContent) || [];
    return {
      type: TYPE_SMS,
      value: {
        to: parsing[1]?.trim(),
        message: parsing[2]?.trim(),
      },
    };
  }
  if (qrContent.startsWith('WIFI:')) {
    const parsing = /^WIFI:T:([^;]+);S:([^;]+);(?:P:([^;]+);)?(?:H:([^;]+);)?$/.exec(qrContent) || [];
    return {
      type: TYPE_WIFI,
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
      type: TYPE_OTP_AUTH,
      value: parseOtpAuthUri(qrContent),
    };
  }
  if (qrContent.startsWith('otpauth-migration:')) {
    const otpauthUris = OTPURI.toOTPAuthURIs(qrContent);
    return {
      type: TYPE_OTP_MIGRATION,
      value: otpauthUris.map((otpauthUri) => parseOtpAuthUri(otpauthUri)),
    };
  }
  if (/^(?:https?|ftp):\/\//.test(qrContent)) {
    return {
      type: TYPE_URL,
      value: qrContent,
    };
  }
  return {
    type: TYPE_UNKNOWN,
    value: qrContent,
  };
}
