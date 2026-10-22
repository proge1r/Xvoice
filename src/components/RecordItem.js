import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration, formatDate } from '../utils/formatters';
import { CATEGORIES } from '../constants/categories';

export const RecordItem = ({ item, onSelect, onDelete, onRename, onCategoryChange, isSelected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleSaveRename = () => {
    if (title.trim()) {
      onRename(item.id, title.trim());
    } else {
      setTitle(item.title);
    }
    setIsEditing(false);
  };

  const categoryName = CATEGORIES.find((c) => c.id === item.category)?.name || 'General';

  return (
    <View style={[styles.container, isSelected && styles.selectedContainer]}>
      <TouchableOpacity style={styles.infoArea} activeOpacity={0.7} onPress={() => onSelect(item)}>
        <View style={[styles.playIconBg, isSelected && styles.playIconBgActive]}>
          <Ionicons
            name={isSelected ? "pause" : "play"}
            size={18}
            color={isSelected ? "#000000" : "#00FF66"}
          />
        </View>

        <View style={styles.textContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              onBlur={handleSaveRename}
              onSubmitEditing={handleSaveRename}
              autoFocus
            />
          ) : (
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          )}

          <View style={styles.detailsRow}>
            <Text style={styles.date} numberOfLines={1}>{formatDate(item.createdAt)}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.duration}>{formatDuration(item.durationMillis)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.categoryBadge}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryText}>{categoryName}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionBtn}>
          <Ionicons name="pencil" size={16} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.modalOption}
                onPress={() => {
                  onCategoryChange(item.id, cat.id);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={styles.modalOptionText}># {cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  selectedContainer: {
    backgroundColor: '#1E2D24',
    borderColor: '#00FF66',
  },
  infoArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 6,
  },
  playIconBg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  playIconBgActive: {
    backgroundColor: '#00FF66',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 2,
  },
  input: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    borderBottomWidth: 1,
    borderBottomColor: '#00FF66',
    paddingVertical: 0,
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: '#666666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dot: {
    fontSize: 11,
    color: '#666666',
    marginHorizontal: 4,
  },
  duration: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryBadge: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
    color: '#00FF66',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333333',
  },
  modalOptionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#E0E0E0',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});