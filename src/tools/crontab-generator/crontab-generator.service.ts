import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import EventCronParser from 'event-cron-parser';

export type CronType = 'standard' | 'aws';

export function getLastExecutionTimes(cronExpression: string, tz: string | undefined = undefined, count: number = 5) {
  if (getCronType(cronExpression) === 'standard') {
    const interval = CronExpressionParser.parse(cronExpression, { tz });
    const times = [];
    for (let i = 0; i < count; i++) {
      times.push(interval.next().toJSON());
    }
    return times;
  }
  if (getCronType(cronExpression) === 'aws') {
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

export function getCronType(cronExpression: string) {
  // Standard cron has 5 fields; AWS EventBridge cron has 6 fields
  const fieldCount = cronExpression.trim().split(/\s+/).length;
  if (fieldCount === 5) {
    try {
      CronExpressionParser.parse(cronExpression);
      cronstrue.toString(cronExpression, { throwExceptionOnParseError: true });
      return 'standard';
    }
    catch (_) {}
  }
  try {
    const parsed = new EventCronParser(cronExpression);
    parsed.validate();
    return 'aws';
  }
  catch (_) {}
  return false;
}
