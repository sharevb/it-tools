import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCirclePause,
  faCirclePlay,
  faComputer,
  faMugHot,
  faPersonWalking,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';

// The pomodoro timer is the only Font Awesome consumer; registering just its six
// icons here (inside the lazy tool chunk) keeps the ~300 KB gzip full icon set out
// of the startup bundle.
library.add(faCirclePlay, faCirclePause, faComputer, faMugHot, faPersonWalking, faVolumeHigh);
