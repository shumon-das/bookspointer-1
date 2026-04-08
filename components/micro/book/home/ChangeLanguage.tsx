import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import labels from '@/app/utils/labels';
import { useSystemStore } from '@/app/store/systemStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeLanguage = () => {
  const userLang = useSystemStore((state) => state.lang);

  const changeLanguage = async () => {
    useSystemStore.getState().setLoading(true);
    const newLang = userLang === 'en' ? 'bn' : 'en';
    await AsyncStorage.setItem('user-lang', newLang)
    useSystemStore.setState({lang: newLang});
    useSystemStore.getState().setLoading(false);
  };

  if (useSystemStore.getState().loading) return <ActivityIndicator />

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={changeLanguage} 
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          <Text style={userLang === 'en' ? styles.activeText : styles.inactiveText}>
            English
          </Text>
          <Text style={styles.inactiveText}> | </Text>
          <Text style={userLang === 'bn' ? styles.activeText : styles.inactiveText}>
            বাংলা
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Small Label Below */}
      <Text style={styles.smallLabel}>
        {userLang === 'en' ? labels.readBanglaBooks : labels.readEnglishBooks}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 50,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
  },
  activeText: {
    color: '#3b82f6',
    fontSize: 12
  },
  inactiveText: {
    color: '#cad1dfff',
    fontSize: 12
  },
  smallLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: '#c1ccdfff',
  },
});

export default ChangeLanguage
