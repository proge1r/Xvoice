import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { CATEGORIES } from '../constants/categories';

export const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollStyle}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.7}
            style={[styles.chip, isSelected && styles.activeChip]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.text, isSelected && styles.activeText]}>
              {isSelected ? `# ${cat.name}` : cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollStyle: {
    maxHeight: 40,
    minHeight: 40,
    marginBottom: 10,
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: '#00FF66',
    borderColor: '#00FF66',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  activeText: {
    color: '#000000',
    fontWeight: '700',
  },
});