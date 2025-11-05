import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';

export default function PopoverExample({menues = []}: any) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const renderItem = ({ item }: { item: {label: string, onPressed: any} }) => (
    <TouchableOpacity onPress={() => router.push(item.onPressed)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        style={{ padding: 10, borderRadius: 6 }}
        onPress={() => setIsVisible(true)}>
        <FontAwesome name="ellipsis-v" size={24} color="gray" />
      </TouchableOpacity>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        backdropOpacity={0.2}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ justifyContent: 'flex-start', alignItems: 'flex-end', margin: 0, paddingTop: 100, paddingRight: 20 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, width: 150 }}>
          <FlatList data={menues} renderItem={renderItem} />
        </View>
      </Modal>
    </View>
  );
}
