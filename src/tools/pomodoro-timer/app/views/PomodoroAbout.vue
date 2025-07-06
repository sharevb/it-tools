<template>
  <div class="about-root">
    <h1>{{ $t('home.__i18n_ally_root__.nav.aboutLabel') }}</h1>

    <h2>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.the-pomodoro-technique') }}</h2>

    <p>
      {{ $t('tools.pomodoro-timer.PomodoroAbout.text.the-pomodoro-technique-is-a-time-management-method-developed-by-francesco-cirillo-in-the-1980s-it-uses-a-timer-to-break-work-into-intervals-typically-25-minutes-in-length-separated-by-short-breaks-each-interval-is-known-as-a-pomodoro-from-the-italian-word-for-tomato-after-the-tomato-shaped-kitchen-timer-cirillo-used-as-a-university-student') }}
    </p>

    <h2>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.five-steps-of-the-pomodoro-technique') }}</h2>

    <ol>
      <li>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.decide-on-a-task-and-set-the-timer-25-minutes-is-common') }}</li>
      <li>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.work-on-the-task-during-that-time') }}</li>
      <li>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.when-the-timer-rings-take-a-short-break-5-10-minutes-is-common') }}</li>
      <li>
        {{ $t('tools.pomodoro-timer.PomodoroAbout.text.keep-repeating-steps-1-3-but-after-your-4th-task-take-a-long-break-instead-of-a-short-break-20-30-minutes-is-common') }}
      </li>
      <li>{{ $t('tools.pomodoro-timer.PomodoroAbout.text.once-the-long-break-is-finished-return-to-step-1') }}</li>
    </ol>

    <p>
      {{ $t('tools.pomodoro-timer.PomodoroAbout.text.source-wikipedia') }} <a target="_blank" href="https://en.wikipedia.org/wiki/Pomodoro_Technique">https://en.wikipedia.org/wiki/Pomodoro_Technique</a>
    </p>
  </div>
</template>

<style scoped>
.about-root {
    width: 90%;
}
p, ol {
    font-size: 0.9375rem;
}
</style>
