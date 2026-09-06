import ICAL from 'ical.js';
import { v4 as uuidv4 } from 'uuid';

import { translate as t } from '@/plugins/i18n.plugin';

export function mergeIcals(
  inputs: Array<string>,
  options: {
    calname?: string;
    timezone?: string;
    caldesc?: string;
    regenerate_uids?: boolean;
  } = {},
) {
  let calendar;
  for (const input of inputs) {
    try {
      const jcal = ICAL.parse(input);
      const cal = new ICAL.Component(jcal);

      if (!calendar) {
        calendar = cal;
        calendar.updatePropertyWithValue('prodid', 'it-tools-ical-merger');
        calendar.updatePropertyWithValue('version', '1.0');

        if (options.calname) {
          calendar.updatePropertyWithValue('x-wr-calname', options.calname);
        }
        if (options.timezone) {
          calendar.updatePropertyWithValue('x-wr-timezone', options.timezone);
        }
        if (options.caldesc) {
          calendar.updatePropertyWithValue('x-wr-caldesc', options.caldesc);
        }
      } else {
        for (const vevent of cal.getAllSubcomponents('vevent')) {
          calendar.addSubcomponent(vevent);
        }
      }
    } catch (e) {
      throw new Error(t('tools.ical-merger.service.text.failed-to-merge-e-n-nwith-input-input', [e, input]));
    }
  }

  if (!calendar) {
    throw new Error(t('tools.ical-merger.service.text.no-icals-parsed-successfully'));
  }

  if (options.regenerate_uids) {
    for (const vevent of calendar.getAllSubcomponents('vevent')) {
      vevent.updatePropertyWithValue('uid', uuidv4());
    }
  }

  return calendar.toString();
}
