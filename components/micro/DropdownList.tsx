import { useCategoryStore } from '@/app/store/categories';
import { useUserStore } from '@/app/store/user';
import { labels } from '@/app/utils/labels';
import { fetchCategories } from '@/services/api';
import { fetchFilteredAuthorsData, fetchIniitialCategories, fetchInitialAuthors } from '@/services/searchapi';
import { styles } from '@/styles/dropdownList.styles';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Category } from '../types/Category';
import { User } from '../types/User';

interface DATA {
  context: string,
  defaultOption: Category|User|null;
  field: string;
  onChange?: (value: Category|User|null) => void;
}

const DropdownList = ({context, defaultOption, field, onChange}: DATA) => {

  const categories = useCategoryStore((state) => state.categories)
  const setCategories = useCategoryStore((state) => state.setCategories)
  const authors = useUserStore((state) => state.authors)
  const selectItem = 'authors' === context ? labels.selectAuthor : labels.selectCategory;
  const [options, setOptions] = useState('categories' === context ? authors : categories)

  const [loading, setLoading] = useState(false)

  const initCategories = async () => {
    setLoading(true)
    try {
      const data = await fetchIniitialCategories(50);
      setOptions(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const fetchFilteredCategories = async () => {
    setLoading(true)
    try {
      const data = await fetchCategories()
      const c = [...categories, ...data]
      setCategories(c)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const initAuthors = async () => {
    setLoading(true)
    try {
      let data = await fetchInitialAuthors(0, defaultOption ? 1000 : 50);
      setOptions(data)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const fetchFilteredAuthors = async (text: string) => {
    setLoading(true)
    try {
      const data = await fetchFilteredAuthorsData(text)
      const mergedMap = new Map();

      for (const obj of [...options, ...data]) {
        mergedMap.set(obj.id, obj);
      }
      setOptions([...mergedMap.values()])
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const handleChange = (event: any) => {
    const item = event
    if (onChange) {
      onChange(item)
    }
  }

  // const renderItem = (item: any) => {
  //   return (
  //     <View style={styles.item}>
  //       <Text style={styles.textItem}>{item.label}</Text>
  //       {item.name === value && (
  //         <AntDesign
  //           style={styles.icon}
  //           color="black"
  //           name="Safety"
  //           size={20}
  //         />
  //       )}
  //     </View>
  //   );
  // };

  useEffect(() => {
    if (options.length < 1) {
      'categories' === context ? initCategories() : initAuthors()
    }

  }, [])

  return (
    <Dropdown
      style={styles.dropdown}
      dropdownPosition="bottom"
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={options}
      search
      maxHeight={300}
      labelField={field}
      valueField={field}
      placeholder={selectItem}
      searchPlaceholder="Search..."
      value={defaultOption ? defaultOption[field as keyof typeof defaultOption] : ''}
      onChange={handleChange}
      onChangeText={text => {
        if ('categories' === context) {
          if (text.length > 0 && !categories.find((c) => c.label === text.trim())) {
            fetchFilteredCategories(); // Server search
          }
        }
        if ('authors' === context) {
          if (text.length > 0 && !authors.find((c) => c.fullName === text.trim())) {
            fetchFilteredAuthors(text); // Server search
          }
        }
      }}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name={loading ? "loading1" : "Safety"} size={20} />
      )}
      // renderItem={renderItem}
    />
  );
};

export default DropdownList;
