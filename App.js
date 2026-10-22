import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder } from './src/hooks/useAudioRecorder';
import {
  loadRecordings,
  saveRecordingMeta,
  deleteRecording,
  renameRecording,
  updateCategory,
} from './src/services/storageService';
import { SearchBar } from './src/components/SearchBar';
import { CategoryFilter } from './src/components/CategoryFilter';
import { RecordItem } from './src/components/RecordItem';
import { AudioPlayer } from './src/components/AudioPlayer';
import { formatDuration } from './src/utils/formatters';

export default function App() {
  const [recordings, setRecordings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { isRecording, durationMillis, startRecording, stopRecording } = useAudioRecorder();

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    const data = await loadRecordings();
    setRecordings(data);
  };

  const handleStartRecording = async () => {
    const result = await startRecording();
    if (!result) {
      Alert.alert('Permission Error', 'Microphone permission is required.');
    }
  };

  const handleStopRecording = async () => {
    const recordData = await stopRecording();
    if (recordData) {
      const newRecording = {
        id: Date.now().toString(),
        title: `rec_${recordings.length + 1}`,
        uri: recordData.uri,
        durationMillis: recordData.durationMillis,
        createdAt: Date.now(),
        category: 'personal',
      };
      const updatedList = await saveRecordingMeta(newRecording);
      setRecordings(updatedList);
    }
  };

  const handleDelete = async (id) => {
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
    const updatedList = await deleteRecording(id);
    setRecordings(updatedList);
  };

  const handleRename = async (id, newTitle) => {
    const updatedList = await renameRecording(id, newTitle);
    setRecordings(updatedList);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const handleCategoryChange = async (id, newCategory) => {
    const updatedList = await updateCategory(id, newCategory);
    setRecordings(updatedList);
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => ({ ...prev, category: newCategory }));
    }
  };

  const filteredRecordings = useMemo(() => {
    return recordings
      .filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [recordings, searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111111" translucent={false} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xvoice</Text>
        <Text style={styles.headerSub}>v1.0.0</Text>
      </View>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordItem
            item={item}
            isSelected={selectedRecord?.id === item.id}
            onSelect={(rec) => setSelectedRecord(rec)}
            onDelete={handleDelete}
            onRename={handleRename}
            onCategoryChange={handleCategoryChange}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: selectedRecord ? 220 : 120 }
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="terminal-outline" size={40} color="#333333" />
            <Text style={styles.emptyText}>no_recordings_found</Text>
          </View>
        }
      />

      {selectedRecord && (
        <AudioPlayer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      {!selectedRecord && (
        <View style={styles.recordControlBar}>
          {isRecording && (
            <Text style={styles.timerText}>● {formatDuration(durationMillis)}</Text>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.recordButton, isRecording && styles.recordingButtonActive]}
            onPress={isRecording ? handleStopRecording : handleStartRecording}
          >
            <Ionicons
              name={isRecording ? "square" : "mic"}
              size={26}
              color={isRecording ? "#FF4444" : "#000000"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerSub: {
    fontSize: 12,
    color: '#555555',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  listContent: {
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#444444',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recordControlBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4444',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00FF66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButtonActive: {
    backgroundColor: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
});