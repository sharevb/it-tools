import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import EventCronParser from 'event-cron-parser';

export type CronType = 'standard' | 'aws';

// AWS EventBridge requires a '?' in exactly one of the two day fields, and standard cron gives it no
// meaning. cron-parser v4 rejected those expressions outright, which is how they used to be routed
// to the aws branch; v5 accepts the six field dialect, so the marker has to do the routing instead.
function looksLikeAwsExpression(cronExpression: string) {
  return /(?:^|\s)\?(?:\s|$)/.test(cronExpression);
}

export function getLastExecutionTimes(cronExpression: string, tz?: string | undefined, count: number = 5) {
  const cronType = getCronType(cronExpression);

  if (cronType === 'standard') {
    const interval = CronExpressionParser.parse(cronExpression, { tz });
    const times: string[] = [];
    for (let i = 0; i < count; i++) {
      // v5 types toJSON() as nullable, which the caller joins into a single string; keep the list
      // the requested length rather than letting a hole shorten it
      times.push(interval.next().toJSON() ?? '');
    }
    return times;
  }
  if (cronType === 'aws') {
    const parsed = new EventCronParser(cronExpression);
    const times = [];
    for (let i = 0; i < count; i++) {
      times.push(JSON.stringify(parsed.next()));
    }
    return times;
  }

  return [];
}

export function isCronValid(cronExpression: string, cronType: CronType | 'any' = 'any') {
  const expressionCronType = getCronType(cronExpression);
  return cronType === 'any' ? !!expressionCronType : expressionCronType === cronType;
}

function isStandardExpression(cronExpression: string) {
  try {
    CronExpressionParser.parse(cronExpression);
    cronstrue.toString(cronExpression, { throwExceptionOnParseError: true });
    return true;
  }
  catch (_) {
    return false;
  }
}

function isAwsExpression(cronExpression: string) {
  try {
    const parsed = new EventCronParser(cronExpression);
    parsed.validate();
    return true;
  }
  catch (_) {
    return false;
  }
}

export function getCronType(cronExpression: string) {
  // Whichever dialect the marker points at gets asked first, and each parser runs at most once.
  if (looksLikeAwsExpression(cronExpression)) {
    if (isAwsExpression(cronExpression)) {
      return 'aws';
    }

    return isStandardExpression(cronExpression) ? 'standard' : false;
  }

  if (isStandardExpression(cronExpression)) {
    return 'standard';
  }

  return isAwsExpression(cronExpression) ? 'aws' : false;
}
