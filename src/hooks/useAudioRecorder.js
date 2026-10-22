import { useState, useEffect } from 'react';
import {
  useAudioRecorder as useExpoAudioRecorder,
  AudioModule,
  AudioOptions,
} from 'expo-audio';

export const useAudioRecorder = () => {
  const audioRecorder = useExpoAudioRecorder(
    AudioOptions?.RecordingPresets?.HIGH_QUALITY || {}
  );
  const [isRecording, setIsRecording] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => {
        setDurationMillis((prev) => prev + 1000);
      }, 1000);
    } else {
      setDurationMillis(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        return null;
      }
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setDurationMillis(0);
      return true;
    } catch (err) {
      return null;
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);
      const uri = audioRecorder.uri;
      const finalDuration = durationMillis;
      setDurationMillis(0);
      return { uri, durationMillis: finalDuration };
    } catch (err) {
      setIsRecording(false);
      return null;
    }
  };

  return {
    isRecording,
    durationMillis,
    startRecording,
    stopRecording,
  };
};