import { Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'

const ColorBar = ({ editor, colors }: { editor: any, colors: string[] }) => {
    
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor: '#f0f0f0', paddingVertical: 10 }}
    >
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => editor.setColor(color)} // This comes from ColorBridge
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: color,
            marginHorizontal: 8,
            // borderWidth: editor.isActive('textStyle', { color }) ? 2 : 0,
            borderColor: 'black'
          }}
        />
      ))}
      {/* Optional: Add a button to reset color */}
      <TouchableOpacity onPress={() => editor.unsetColor()} style={{ justifyContent: 'center', paddingHorizontal: 10 }}>
         <Text>Clear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default ColorBar