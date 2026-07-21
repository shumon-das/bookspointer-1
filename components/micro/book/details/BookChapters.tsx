import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ChapterItem } from '@/app/store/bookDetailsStore';

interface BookChaptersProps {
  chapters: ChapterItem[];
  activeChapter: number;
  onSelect: (chapter: number) => void;
  disabled?: boolean;
}

const BookChapters = ({ chapters, activeChapter, onSelect, disabled = false }: BookChaptersProps) => {
  const [open, setOpen] = useState(false);
  const activeItem = chapters.find((chapter) => chapter.index === activeChapter) ?? chapters[0];

  if (chapters.length <= 1) return null;

  const selectChapter = (chapter: number) => {
    setOpen(false);
    onSelect(chapter);
  };

  return (
    <View style={{ marginHorizontal: 10, marginVertical: 12 }}>
      <TouchableOpacity
        accessibilityRole="button"
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={{
          minHeight: 46,
          paddingHorizontal: 14,
          borderWidth: 1,
          borderColor: '#9ca3af',
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <MaterialIcons name="menu-book" size={18} color="#374151" />
          <Text numberOfLines={1} style={{ marginLeft: 8, fontSize: 14, fontWeight: '600', flexShrink: 1 }}>
            {activeItem?.title || `Chapter ${activeChapter}`}
          </Text>
          <Text style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>
            ({activeChapter}/{chapters.length})
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#6b7280" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.35)', padding: 24 }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{ maxHeight: '70%', backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden' }}
          >
            <FlatList
              data={chapters}
              keyExtractor={(chapter) => String(chapter.index)}
              renderItem={({ item }) => {
                const selected = item.index === activeChapter;
                return (
                  <TouchableOpacity
                    onPress={() => selectChapter(item.index)}
                    style={{
                      minHeight: 48,
                      paddingHorizontal: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: selected ? '#eff6ff' : '#fff',
                    }}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: selected ? '#3b82f6' : '#d1d5db' }} />
                    <Text numberOfLines={1} style={{ flex: 1, marginLeft: 12, color: selected ? '#2563eb' : '#374151', fontWeight: selected ? '700' : '400' }}>
                      {item.title || `Chapter ${item.index}`}
                    </Text>
                    <Text style={{ marginLeft: 10, fontSize: 12, color: '#9ca3af' }}>{item.page_count}p</Text>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default BookChapters;
