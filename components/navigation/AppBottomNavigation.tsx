import { useTempStore } from '@/app/store/temporaryStore';
import { useLabels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppBottomNavigation = ({ state, navigation }: BottomTabBarProps) => {
  const labels = useLabels();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const items = [
    { name: 'index', icon: 'home', label: labels.home },
    { name: 'authors', icon: 'users', label: labels.authors },
    { name: 'write-book', icon: 'pencil', label: labels.writeBook, isAction: true },
    { name: 'category', icon: 'list', label: labels.categories },
    { name: 'download', icon: 'download', label: labels.download },
  ];

  const openWriteBook = () => {
    useTempStore.getState().setBookContent('');
    router.push('/screens/book/write-new-book');
  };

  return (
    <View style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View pointerEvents="none" style={[styles.systemNavigationArea, { height: insets.bottom }]} />
      <View style={styles.bar}>
        {items.map((item) => {
          const route = state.routes.find((currentRoute) => currentRoute.name === item.name);
          if (!route) return null;

          const isFocused = state.routes[state.index]?.key === route.key;
          const onPress = () => {
            if (item.isAction) {
              openWriteBook();
              return;
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.72}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={item.label}
              style={[styles.item, item.isAction && styles.actionItem]}
            >
              <View
                style={[
                  styles.iconShell,
                  isFocused && styles.iconShellActive,
                  item.isAction && styles.actionIconShell,
                ]}
              >
                <FontAwesome
                  name={item.icon as any}
                  size={item.isAction ? 20 : 18}
                  color={item.isAction || isFocused ? '#ffffff' : '#706963'}
                />
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                style={[styles.label, isFocused && styles.labelActive, item.isAction && styles.actionLabel]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AppBottomNavigation;

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  systemNavigationArea: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#ffffff',
  },
  bar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffdfb',
    borderWidth: 1,
    borderColor: '#ebe1d9',
    borderRadius: 22,
    paddingHorizontal: 4,
    elevation: 9,
    shadowColor: '#5e5147',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  iconShell: {
    width: 34,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3ece7',
  },
  iconShellActive: {
    backgroundColor: '#0a5d7d',
  },
  label: {
    alignSelf: 'stretch',
    marginTop: 4,
    paddingHorizontal: 1,
    color: '#706963',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: '#0a5d7d',
    fontWeight: '700',
  },
  actionItem: {
    paddingTop: 0,
    transform: [{ translateY: -13 }],
  },
  actionIconShell: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#0a5d7d',
    borderWidth: 4,
    borderColor: '#f9f0eb',
    elevation: 5,
    shadowColor: '#244653',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
  },
  actionLabel: {
    color: '#0a5d7d',
    fontWeight: '700',
  },
});
