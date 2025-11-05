import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const Dropdown = ({ selectedOption, options = [], optionLabel, placeholder = "Select an option", onSelect }: any) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(selectedOption);

  useEffect(() => {
    setSelected(selectedOption);
  }, [selectedOption]);

  const handleSelect = (option: any) => {
    setSelected(option);
    setVisible(false);
    if (onSelect) onSelect(option);
  };

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
          <FlatList
            data={options}
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

