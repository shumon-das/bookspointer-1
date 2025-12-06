import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getNoViewNotificationCount } from '@/services/notificationApi';

const NotificationBadge = () => {
  const [count, setCount] = useState(0);
  const router = useRouter();
  
  useEffect(() => {
    const fetchNotificationCount = async () => {
      const response = await getNoViewNotificationCount();
      if (response && response.count) {
        setCount(response.count);
      }
    };

    fetchNotificationCount();
  }, []);

  return (<TouchableOpacity onPress={() => router.push('/screens/notifications')}>
    <View style={styles.iconContainer}>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}

      <MaterialIcons name="notifications" size={24} color="white" />
    </View>
  </TouchableOpacity>)
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