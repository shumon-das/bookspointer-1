import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Slider from '@react-native-community/slider'

interface TextFormatingProps {
    currentFontSize: number;
    onChange: (value: number) => void;
    onResetEverything: () => void;
    onChangeBgColor: (value: string) => void;
}

const TextFormating = ({currentFontSize, onChange, onResetEverything, onChangeBgColor}: TextFormatingProps) => {
    const [fontSize, setFontSize] = useState(currentFontSize);
    const [tempSize, setTempSize] = useState(currentFontSize);
    const onCompleteChange = (value: number) => {
        setFontSize(value);
        onChange(value);
    }
    const onReset = () => {
        setFontSize(currentFontSize);
        onResetEverything();
    }
    const onChangeBackgroundColor = (value: string) => {
        onChangeBgColor(value);
    }
    return (
    <View style={{ margin: 10, backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: 10, borderWidth: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
            <Text>Text Formating</Text>
            <TouchableOpacity onPress={() => onReset()}>
                <Text>Reset</Text>
            </TouchableOpacity>
        </View>
        <View>
            <Text style={{ marginHorizontal: 10 }}>Font Size</Text>
            <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={10}
            maximumValue={30}
            step={1}
            value={fontSize}
            onValueChange={(value) => setTempSize(value)}
            onSlidingComplete={(value) => onCompleteChange(value)}
            minimumTrackTintColor="#26a7e2ff"
            maximumTrackTintColor="#0e8cd4ff"
            thumbTintColor="#2e99f0ff"
            />
        </View>
        <View>
            <Text style={{ marginHorizontal: 10 }}>Background Color</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                <TouchableOpacity 
                    style={{ width: 35, height: 25, borderWidth: 1, borderColor: '#666', backgroundColor: '#fff' }} 
                    onPress={() => onChangeBackgroundColor('#fff')}
                >
                    <Text style={{ textAlign: 'center' }}>অ</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ width: 35, height: 25, borderWidth: 1, borderColor: '#666', backgroundColor: '#f9f0eb' }} 
                    onPress={() => onChangeBackgroundColor('#f9f0eb')}
                >
                    <Text style={{ textAlign: 'center' }}>আ</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}

export default TextFormating