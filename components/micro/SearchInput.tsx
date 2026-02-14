import { View, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import labels from '@/app/utils/labels';

interface SearchState {
  items: any[], 
  filterField: string, 
  onFiltered: (items: any[]) => void,
  isNotFound: (value: boolean) => void,
}

const SearchInput = ({items, filterField, onFiltered, isNotFound}: SearchState) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    // Always filter from the 'items' prop (the full list)
    const normalizedSearch = text.normalize('NFC').toLowerCase();
        
    const filtered = items.filter((item) => {
        const value = item[filterField] || "";
        return value.toString().normalize('NFC').toLowerCase().includes(normalizedSearch);
    });

    isNotFound(filtered.length === 0);
    onFiltered(filtered.length === 0 ? [] : filtered);
  };

  return (
    <View style={styles.searchInput}>
      <EvilIcons name="search" size={24} color="black" />
      <TextInput 
        placeholder={labels.search}
        placeholderTextColor="#999"
        style={styles.searchInputText}
        value={searchQuery}
        onChangeText={handleSearch}
      />
    </View>
  )
}

export default SearchInput

const styles = StyleSheet.create({
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    searchInputText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    }
})