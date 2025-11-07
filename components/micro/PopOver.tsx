import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { styles } from '@/styles/popOver.styles';

interface PopOverProps {
  icon: React.ReactElement;
  menus: { index?: number; label: string; }[];
  action: (item: any) => any;
}

const PopOver = ({icon, menus, action}: PopOverProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const buttonRef = useRef(null as any);

  const openMenu = () => {
    if (buttonRef.current) {
      // Measure button position
      buttonRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setButtonPosition({ x, y, w: width, h: height });
        setIsVisible(true);
      });
    }
  };
  
  return (<View>
    <Button onPress={openMenu} ref={buttonRef}>
      {icon}
    </Button>
  
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        backdropOpacity={0.1}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.popoverContainer}
      >
        <View 
          style={[
            styles.popoverBox,
            {
              position: 'absolute',
              top: buttonPosition.y + buttonPosition.h + 5, // below button
              left: Math.min(
                buttonPosition.x,
                Dimensions.get('window').width - 160 // prevent overflow
              ),
            },
          ]}
        >
          <FlatList 
            data={menus} 
            keyExtractor={(item) => item.label} 
            renderItem={(item) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => action(item)}>
                <Text>{item.item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
  </View>)
};

export default PopOver;