import { getCurrentLocale, translate as t } from '@/plugins/i18n.plugin';

Intl.DurationFormat ??= class DurationFormat {
  format(duration: { seconds?: number; milliseconds?: number }): string {
    return 'seconds' in duration
      ? `${duration.seconds} seconds`
      : `${duration.milliseconds} milliseconds`;
  }
};

export type Update<Result> =
  | {
    kind: 'progress'
    progress: number
  }
  | {
    kind: 'success'
    value: Result
    timeTakenMs: number
  }
  | {
    kind: 'error'
    message: string
  };

// generic type for the callback versions of bcryptjs's `hash` and `compare`
export type BcryptFn<Param, Result> = (
  arg1: string,
  arg2: Param,
  callback: (err: Error | null, hash: Result) => void,
  progressCallback: (percent: number) => void,
) => void;

interface BcryptWithProgressOptions {
  signal: AbortSignal
  timeoutMs: number
}

export async function* bcryptWithProgressUpdates<Param, Result>(
  fn: BcryptFn<Param, Result>,
  args: [string, Param],
  options?: Partial<BcryptWithProgressOptions>,
): AsyncGenerator<Update<Result>, undefined, undefined> {
  const { timeoutMs = 10_000 } = options ?? {};
  // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore: AbortSignal.any breaks typecheck
  const signal: AbortSignal = AbortSignal.any([
    AbortSignal.timeout(timeoutMs),
    options?.signal,
  ].filter(x => x != null));

  let res = (_: Update<Result>) => {};
  const nextPromise = () => new Promise<Update<Result>>(resolve => res = resolve);
  const promises = [nextPromise()];
  const nextValue = (value: Update<Result>) => {
    res(value);
    promises.push(nextPromise());
  };

  const start = Date.now();

  fn(
    args[0],
    args[1],
    (err, result) => {
      nextValue(
        err == null
          ? { kind: 'success', value: result, timeTakenMs: Date.now() - start }
          : { kind: 'error', message: err.message },
      );
    },
    (progress) => {
      if (signal.aborted) {
        nextValue({ kind: 'progress', progress: 0 });
        if (signal.reason instanceof DOMException && signal.reason.name === 'TimeoutError') {
          const message = t('tools.bcrypt.texts.timed-out-after-timeout-period', {
            timeoutPeriod: new Intl.DurationFormat(getCurrentLocale(), { style: 'long' })
              .format({ seconds: Math.round(timeoutMs / 1000) }),
          });

          nextValue({ kind: 'error', message });
        }

        // throw inside callback to cancel execution of hashing/comparing
        throw signal.reason;
      }
      else {
        nextValue({ kind: 'progress', progress });
      }
    },
  );

  for await (const value of promises) {
    yield value;

    if (value.kind === 'success' || value.kind === 'error') {
      return;
    }
  }
}
