import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const JUMP_HEIGHT = -10;
const JUMP_DURATION = 180;
const WAVE_STAGGER = 110;
const CYCLE_DELAY = 260;

export default function ThreeDotsLoader() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dots = [dot1, dot2, dot3];
    const jump = (dot: Animated.Value) => Animated.sequence([
      Animated.timing(dot, { toValue: JUMP_HEIGHT, duration: JUMP_DURATION, useNativeDriver: true }),
      Animated.timing(dot, { toValue: 0, duration: JUMP_DURATION, useNativeDriver: true }),
    ]);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.stagger(WAVE_STAGGER, dots.map(jump)),
        Animated.delay(CYCLE_DELAY),
      ]),
    );

    animation.start();
    return () => {
      animation.stop();
      dots.forEach((dot) => dot.stopAnimation(() => dot.setValue(0)));
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View key={index} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, marginHorizontal: 4, borderRadius: 4, backgroundColor: '#e63946' },
});
