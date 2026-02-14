import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Divider = ({ label, color = '#94A3B8', textColor = '#F8FAFC' }: {label: string, color?: string, textColor?: string}) => {
  return (
    <View style={styles.container}>
      {/* Left Dotted Line */}
      <View style={styles.lineWrapper}>
        <View style={[styles.dottedLine, { borderColor: color }]} />
      </View>


      {/* Right Dotted Line */}
      <View style={styles.lineWrapper}>
        <View style={[styles.dottedLine, { borderColor: color }]} />
      </View>
      
      <View style={styles.lineWrapper}>
        <View style={[styles.dottedLine, { borderColor: color }]} />
      </View>
      
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.labelText, { color: textColor }]}>{label}</Text>
        </View>
      )}

      <View style={styles.lineWrapper}>
        <View style={[styles.dottedLine, { borderColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  lineWrapper: {
    flex: 1,
    height: 1,
    overflow: 'hidden',
  },
  dottedLine: {
    borderWidth: 1,
    borderRadius: 1,
    // borderStyle: 'dashed',
    height: 2,
    marginTop: -1,
  },
  labelContainer: {
    paddingHorizontal: 12,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
});

export default Divider;