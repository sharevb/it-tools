import { type Ref, computed, ref } from 'vue';

export { useMediaRecorder };

function useMediaRecorder({ stream }: { stream: Ref<MediaStream | undefined> }): {
  isRecordingSupported: Ref<boolean>;
  recordingState: Ref<'stopped' | 'recording' | 'paused'>;
  startRecording: () => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  onRecordAvailable: (cb: (url: string) => void) => void;
} {
  const isRecordingSupported = computed(() => MediaRecorder.isTypeSupported('video/webm'));
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const recordedChunks = ref<Blob[]>([]);
  const recordAvailable = createEventHook();
  const recordingState = ref<'stopped' | 'recording' | 'paused'>('stopped');
  const createdUrls = ref<string[]>([]);

  const createVideo = () => {
    const blob = new Blob(recordedChunks.value, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    createdUrls.value.push(url);
    recordedChunks.value = [];
    return url;
  };

  const cleanupUrls = () => {
    createdUrls.value.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    createdUrls.value = [];
  };

  const startRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!stream.value) {
      return;
    }
    if (recordingState.value !== 'stopped') {
      return;
    }

    cleanupUrls();

    mediaRecorder.value = new MediaRecorder(stream.value, { mimeType: 'video/webm' });

    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.value.push(e.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      recordAvailable.trigger(createVideo());
    };

    if (mediaRecorder.value.state !== 'inactive') {
      return;
    }

    mediaRecorder.value.start();
    recordingState.value = 'recording';
  };

  const stopRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }
    if (recordingState.value === 'stopped') {
      return;
    }

    mediaRecorder.value.stop();
    recordingState.value = 'stopped';
  };

  const pauseRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }
    if (recordingState.value !== 'recording') {
      return;
    }

    mediaRecorder.value.pause();
    recordingState.value = 'paused';
  };

  const resumeRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }

    if (recordingState.value !== 'paused') {
      return;
    }

    mediaRecorder.value.resume();
    recordingState.value = 'recording';
  };

  return {
    isRecordingSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingState,

    onRecordAvailable: recordAvailable.on,
  };
}
