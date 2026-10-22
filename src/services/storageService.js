import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = '@voice_recordings';

export const loadRecordings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
};

export const saveRecordingMeta = async (newRecording) => {
  try {
    const currentRecordings = await loadRecordings();
    const updatedRecordings = [newRecording, ...currentRecordings];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecordings));
    return updatedRecordings;
  } catch (e) {
    return [];
  }
};

export const deleteRecording = async (id) => {
  try {
    const currentRecordings = await loadRecordings();
    const targetId = String(id);
    const itemToDelete = currentRecordings.find((item) => String(item.id) === targetId);

    if (itemToDelete && itemToDelete.uri) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(itemToDelete.uri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(itemToDelete.uri, { idempotent: true });
        }
      } catch (fileErr) {
        // file system error ignored to guarantee metadata deletion
      }
    }

    const updatedRecordings = currentRecordings.filter((item) => String(item.id) !== targetId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecordings));
    return updatedRecordings;
  } catch (e) {
    const current = await loadRecordings();
    return current.filter((item) => String(item.id) !== String(id));
  }
};

export const renameRecording = async (id, newTitle) => {
  try {
    const currentRecordings = await loadRecordings();
    const targetId = String(id);
    const updatedRecordings = currentRecordings.map((item) => {
      if (String(item.id) === targetId) {
        return { ...item, title: newTitle };
      }
      return item;
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecordings));
    return updatedRecordings;
  } catch (e) {
    return [];
  }
};

export const updateCategory = async (id, newCategory) => {
  try {
    const currentRecordings = await loadRecordings();
    const targetId = String(id);
    const updatedRecordings = currentRecordings.map((item) => {
      if (String(item.id) === targetId) {
        return { ...item, category: newCategory };
      }
      return item;
    });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecordings));
    return updatedRecordings;
  } catch (e) {
    return [];
  }
};