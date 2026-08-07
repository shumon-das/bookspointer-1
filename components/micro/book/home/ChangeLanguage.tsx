import { useSystemStore } from '@/app/store/systemStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChangeLanguageProps {
  variant?: 'default' | 'light';
}

const ChangeLanguage = ({ variant = 'default' }: ChangeLanguageProps) => {
  const userLang = useSystemStore((state) => state.lang);
  const loading = useSystemStore((state) => state.loading);
  const isLight = variant === 'light';

  const changeLanguage = async () => {
    useSystemStore.getState().setLoading(true);
    const newLang = userLang === 'en' ? 'bn' : 'en';
    await AsyncStorage.setItem('user-lang', newLang);
    useSystemStore.setState({ lang: newLang });
    useSystemStore.getState().setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="small" color={isLight ? '#ffffff' : '#0a5d7d'} />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={changeLanguage} activeOpacity={0.75} style={[styles.switch, isLight && styles.switchLight]} accessibilityRole="button">
      <Text style={[styles.language, isLight && styles.languageLight, userLang === 'en' && styles.languageActive, isLight && userLang === 'en' && styles.languageActiveLight]}>EN</Text>
      <View style={[styles.divider, isLight && styles.dividerLight]} />
      <Text style={[styles.language, isLight && styles.languageLight, userLang === 'bn' && styles.languageActive, isLight && userLang === 'bn' && styles.languageActiveLight]}>বাংলা</Text>
    </TouchableOpacity>
  );
};

export default ChangeLanguage;

const styles = StyleSheet.create({
  switch: {
    width: 66,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f3ece7',
  },
  switchLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  language: {
    color: '#90877f',
    fontSize: 9,
    fontWeight: '700',
  },
  languageActive: {
    color: '#0a5d7d',
  },
  languageLight: {
    color: 'rgba(255, 255, 255, 0.58)',
  },
  languageActiveLight: {
    color: '#ffffff',
  },
  divider: {
    width: 1,
    height: 13,
    marginHorizontal: 4,
    backgroundColor: '#d7ccc3',
  },
  dividerLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  loader: {
    width: 66,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
