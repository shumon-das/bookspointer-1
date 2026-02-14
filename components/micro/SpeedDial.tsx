import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, TouchableOpacity, Animated, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

export default function SpeedDial({ data = [] }: {data: any[]}) {
  const [items, setItems] = useState([] as any)
  useFocusEffect(useCallback(() => setItems(data), [data]))

  const [open, setOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(animation, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setOpen(!open);
  };

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {/* ACTION BUTTONS */}
      {items.map((pageNumber: number, index: number) => {
        const offset = (index + 1) * 70;

        const translateY = animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -offset], // move UP
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionWrapper,
              {
                transform: [{ translateY }],
                opacity: animation,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => console.log(index)}
            ><Text>{pageNumber}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {/* MAIN BUTTON */}
      <TouchableOpacity style={styles.mainButton} onPress={toggleMenu}>
        <MaterialIcons name={open ? "close" : "add"} size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 25,
    right: 0,
    width: 70,
    alignItems: "center",
  },

  mainButton: {
    width: 35,
    height: 35,
    borderRadius: 5,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  actionWrapper: {
    position: "absolute",
    bottom: 0, // starting point above main button
    alignItems: "center",
  },

  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
});
