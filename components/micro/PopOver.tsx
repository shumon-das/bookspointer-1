import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { styles } from '@/styles/popOver.styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const POPOVER_WIDTH = 160; // Set a fixed width or estimate it
const POPOVER_HEIGHT_ESTIMATE = 150; // Estimate or calculate based on menus.length

interface PopOverProps {
  icon: React.ReactElement;
  menus: { index?: number; name?: string; label: string; icon?: React.ReactElement }[];
  action: (item: any) => any;
  variant?: 'default' | 'feed';
}

const PopOver = ({ icon, menus, action, variant = 'default' }: PopOverProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const buttonRef = useRef<any>(null);

  const openMenu = () => {
    buttonRef.current?.measureInWindow((x: number, y: number, width: number, height: number) => {
      setButtonPosition({ x, y, w: width, h: height });
      setIsVisible(true);
    });
  };

  // Calculate if we should show above or below
  const isBottomSpaceSmall = buttonPosition.y + POPOVER_HEIGHT_ESTIMATE > SCREEN_HEIGHT - 50;
  // Calculate if we should show left or right
  const isRightSpaceSmall = buttonPosition.x + POPOVER_WIDTH > SCREEN_WIDTH - 20;

  const getPopoverStyles = () => {
    return {
      position: 'absolute' as const,
      // Vertical Positioning
      ...(isBottomSpaceSmall 
        ? { bottom: SCREEN_HEIGHT - buttonPosition.y + 5 } // Show above
        : { top: buttonPosition.y + buttonPosition.h + 5 } // Show below
      ),
      // Horizontal Positioning
      ...(isRightSpaceSmall 
        ? { right: SCREEN_WIDTH - (buttonPosition.x + buttonPosition.w) } // Align right edges
        : { left: buttonPosition.x } // Align left edges
      ),
      width: POPOVER_WIDTH,
    };
  };

  return (
    <View>
      <TouchableOpacity accessibilityRole="button" accessibilityLabel="More actions" activeOpacity={0.72} onPress={openMenu} ref={buttonRef} style={styles.trigger}>
        {icon}
      </TouchableOpacity>

      <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        backdropOpacity={0.16}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={150}
        animationOutTiming={120}
        backdropTransitionInTiming={150}
        backdropTransitionOutTiming={120}
        style={{ margin: 0 }}
      >
        <View style={[styles.popoverBox, variant === 'feed' && styles.feedPopoverBox, getPopoverStyles()]}>
          {menus.map((item, index) => {
            const destructive = ['report', 'block', 'delete'].includes(item.name ?? '');
            return <TouchableOpacity key={`${item.name ?? item.label}-${index}`} activeOpacity={0.72} style={[styles.menuItem, variant === 'feed' && styles.feedMenuItem, destructive && styles.menuItemDanger]} onPress={() => {
              setIsVisible(false);
              action(item);
            }}>
              {item.icon && <View style={styles.menuIcon}>{item.icon}</View>}
              <Text style={[styles.menuText, variant === 'feed' && styles.feedMenuText, destructive && styles.menuTextDanger]}>{item.label}</Text>
            </TouchableOpacity>;
          })}
        </View>
      </Modal>
    </View>
  );
};

export default PopOver;
