import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const NotificationBadge = () => {
  const [count, setCount] = useState(0);
  

  return (<View style={styles.iconContainer}>
    {count > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    )}

    <MaterialIcons name="notifications" size={24} color="white" />
  </View>)
};

export default NotificationBadge;

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative', 
    marginHorizontal: 10,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 10,
  },

  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // You can also add styles for the icon itself if needed
  // icon: { ... }
});