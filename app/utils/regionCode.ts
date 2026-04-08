import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSystemStore } from "../store/systemStore";

export const getRegionCode = async () => {
  const userPreferedLang = await AsyncStorage.getItem('user-lang');
  if (userPreferedLang && typeof userPreferedLang === 'string') {
    useSystemStore.setState(() => ({ lang: userPreferedLang }))
    return userPreferedLang
  }
  const locale = Intl.DateTimeFormat().resolvedOptions().locale; // example: "en-US"

  if (!locale) {
    AsyncStorage.setItem('user-lang', 'en')
    useSystemStore.setState(() => ({ lang: 'en' }))
    return 'en'
  };

  try {
    const region = new Intl.Locale(locale).region;
    const lang = region && region === 'BD' ? 'bn' : 'en';
    useSystemStore.setState(() => ({ lang: lang }))
    AsyncStorage.setItem('user-lang', lang)

    return lang;
  } catch {
    const region = locale.split('-')[1]
    const lang = region && region === 'BD' ? 'bn' : 'en';
    useSystemStore.setState(() => ({ lang: lang }))
    AsyncStorage.setItem('user-lang', lang)

    return lang
  }
}
