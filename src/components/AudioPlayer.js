import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '../utils/formatters';

export const AudioPlayer = ({ record, onClose }) => {
  const player = useAudioPlayer(record.uri);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const durationMillis = record.durationMillis || (player.duration * 1000) || 0;

  useEffect(() => {
    player.play();
    setIsPlaying(true);
  }, [player]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player) {
        setPositionMillis(player.currentTime * 1000);
        setIsPlaying(player.playing);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [player]);

  const handlePlayPause = () => {
    if (player.playing) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleSlidingComplete = (value) => {
    if (player) {
      player.seekTo(value / 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>▶ {record.title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={20} color="#888888" />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={durationMillis > 0 ? durationMillis : 100}
        value={positionMillis}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor="#00FF66"
        maximumTrackTintColor="#333333"
        thumbTintColor="#00FF66"
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatDuration(positionMillis)}</Text>
        <Text style={styles.timeText}>{formatDuration(durationMillis)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={52}
            color="#00FF66"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#00FF66',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    marginRight: 8,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#888888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  controls: {
    alignItems: 'center',
    marginTop: 4,
  },
});