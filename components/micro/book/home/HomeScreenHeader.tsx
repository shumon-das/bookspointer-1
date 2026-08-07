import NotificationBadge from '@/components/NotificationBadge';
import { useUserStore } from '@/app/store/userStore';
import { userImageUri } from '@/app/utils/user/imageUri';
import { useLabels } from '@/app/utils/labels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChangeLanguage from './ChangeLanguage';

const HomeScreenHeader = () => {
  const router = useRouter();
  const labels = useLabels();
  const insets = useSafeAreaInsets();
  const userStore = useUserStore();
  const [loggedInUser, setLoggedInUser] = useState(userStore.authUser);
  const [openingProfile, setOpeningProfile] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setOpeningProfile(false);

      const loadLoggedInUser = async () => {
        if (userStore.authUser) {
          setLoggedInUser(userStore.authUser);
          return;
        }

        const storageUser = await AsyncStorage.getItem('auth-user');
        setLoggedInUser(storageUser ? JSON.parse(storageUser) : null);
      };

      void loadLoggedInUser();
    }, [userStore.authUser]),
  );

  const goToProfile = async () => {
    if (openingProfile) return;
    setOpeningProfile(true);

    const cachedUser = useUserStore.getState().authUser;
    if (cachedUser) {
      router.push('/screens/user/user-profile');
      return;
    }

    try {
      const authUser = await useUserStore.getState().fetchAuthUserFromDb();

      if (!authUser) {
        router.push('/auth/login');
        return;
      }

      router.push('/screens/user/user-profile');
    } catch (error) {
      console.error('Unable to open the user profile.', error);
      setOpeningProfile(false);
    }
  };

  return (
    <View style={[styles.header, { height: 64 + insets.top, paddingTop: 5 + insets.top }]}>
      <View style={styles.card}>
        <View style={styles.brand}>
          <View style={styles.logoTile}>
            <Image source={require('../../../../assets/images/bp_small_logo.png')} style={styles.logo} />
          </View>
          <Text numberOfLines={1} style={styles.brandName}>
            {labels.booksPointer}
          </Text>
        </View>

        <ChangeLanguage variant="light" />

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/search')}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={labels.search}
          >
            <FontAwesome name="search" size={17} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.iconButton}>
            <NotificationBadge color="#ffffff" />
          </View>

          {loggedInUser ? (
            <TouchableOpacity
              disabled={openingProfile}
              onPress={goToProfile}
              style={[styles.profileButton, openingProfile && styles.profileButtonOpening]}
              accessibilityRole="button"
              accessibilityState={{ busy: openingProfile }}
            >
              <Image source={userImageUri(loggedInUser.image)} style={styles.userImage} />
              {openingProfile && <View style={styles.profileLoading}><ActivityIndicator size="small" color="#ffffff" /></View>}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={openingProfile}
              onPress={goToProfile}
              style={[styles.iconButton, openingProfile && styles.profileButtonOpening]}
              accessibilityRole="button"
              accessibilityLabel={labels.signIn}
            >
              {openingProfile ? <ActivityIndicator size="small" color="#ffffff" /> : <FontAwesome name="user-o" size={18} color="#ffffff" />}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  header: {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0a5d7d',
  },
  card: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  logoTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    width: 23,
    height: 19,
    resizeMode: 'contain',
  },
  brandName: {
    flexShrink: 1,
    marginLeft: 7,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 7,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  profileButton: {
    position: 'relative',
    width: 34,
    height: 34,
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f9f0eb',
  },
  userImage: {
    width: '100%',
    height: '100%',
  },
  profileButtonOpening: {
    opacity: 0.72,
  },
  profileLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 93, 125, 0.42)',
  },
});
