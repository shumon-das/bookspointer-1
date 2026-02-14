import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';

const Dropdown = ({ selectedOption, options = [], optionLabel, placeholder = "", filterPlaceholder = '', onSelect }: any) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(selectedOption);
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [optionsData, setOptionsData] = useState(options)

  useEffect(() => {
    setSelected(selectedOption);
    setOptionsData(options)
  }, [selectedOption, options]);

  const handleSelect = (option: any) => {
    setSelected(option);
    setVisible(false);
    if (onSelect) onSelect(option);
  };

  const filteredOptions = (text: string) => {
    setSearchText(text)
    if (text.trim().length <= 0) {
        setOptionsData(options);
        return;
      }

      setOptionsData(options.filter((item: any) => {
        return item[optionLabel].includes(text)
      }))
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setVisible(!visible)}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownText}>
          {selected ? selected[optionLabel] : placeholder}
        </Text>
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdownList}>
          <TextInput
              style={{paddingHorizontal: 12, borderWidth: 1, borderColor: 'lightgray'}}
              onChangeText={(event) => filteredOptions(event)}
              value={searchText}
              placeholder={filterPlaceholder}
          />
          <FlatList
            data={optionsData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => handleSelect(item)}>
                <Text style={styles.dropdownItemText}>{item[optionLabel]}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Dropdown

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
  },
  dropdownHeader: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

