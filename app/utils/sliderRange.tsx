import Slider from '@react-native-community/slider';
import React from 'react';
import { Text, View } from 'react-native';

interface propsData {
  value: number;
  onChange?: (value: number) => void;
  estimateSpeechTime: number
}

const SliderRange = ({value, onChange, estimateSpeechTime}: propsData) => {
  const [sliderValue, setSliderValue] = React.useState(0);

  const onValueChange = (value: number) => {
    setSliderValue(value);
    console.log('Slider value:', value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
      <Text style={{ color: '#FFFFFF' }}>{sliderValue}</Text>
      <Slider
          style={{width: '80%', height: 40}}
          value={100}
          onValueChange={onValueChange}
          minimumValue={0}
          maximumValue={estimateSpeechTime}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
      />
      <Text style={{ color: '#FFFFFF' }}>{estimateSpeechTime}</Text>
    </View>
  )
}

export default SliderRange