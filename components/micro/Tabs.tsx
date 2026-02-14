import labels from '@/app/utils/labels';
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Tabs = ({onPress, tabs}: {onPress: (index: number) => void, tabs?: string[]}) => {
  const TABS = tabs || [labels.forYours, labels.currentlyReading, labels.userBookTypes.library];
  const TAB_WIDTH = (width - 10) / TABS.length; // 40 is the horizontal padding
  const [activeTab, setActiveTab] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: index * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
    onPress(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* Animated Background Pill */}
        <Animated.View 
          style={[
            styles.pill, 
            { width: TAB_WIDTH, transform: [{ translateX }] }
          ]} 
        />
        
        {/* Tab Buttons */}
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => handleTabPress(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 4,
    width: width - 10,
    position: 'relative',
  },
  pill: {
    position: 'absolute',
    height: '100%',
    top: 4,
    left: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 21,
    // Soft shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Ensures text is above the pill
  },
  tabText: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#000000',
  },
});

export default Tabs;