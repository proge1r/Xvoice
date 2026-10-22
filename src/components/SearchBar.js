import React from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#00FF66" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="search_recordings..."
        placeholderTextColor="#555555"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery ? (
        <Ionicons
          name="close-circle"
          size={18}
          color="#00FF66"
          onPress={() => setSearchQuery('')}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});