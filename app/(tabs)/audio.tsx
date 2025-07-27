import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { htmlToPlainTexts } from '../utils/htmlToPlainTexts';
import { labels } from '../utils/labels';
import SliderRange from '../utils/sliderRange';

const audio = () => {
  const { book } = useLocalSearchParams();
  const bookData = book ? JSON.parse(book as string) : null;
  const [text, setText] = React.useState(htmlToPlainTexts(bookData?.content || ''));
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  
  const playAudio = () => {
    setIsPlaying(true);
    Speech.speak(text, {
      language: 'bn-BD',
      pitch: 1.0,
      rate: 1.0,
    });
  };

  const pauseAudio = () => {
    Speech.pause();
  };

  const stopAudio = () => {
    setIsPlaying(false);
    Speech.stop();
  };

  const estimateSpeechTime = (text: string, wpm = 150) => {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedSeconds = wordCount / (wpm / 60);
    return Math.ceil(estimatedSeconds); // round up to full seconds
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#343A46' }}>
        <Stack.Screen
            options={{ title: labels.audioBook, headerStyle: { backgroundColor: '#085a80' } }}
        />
        <View style={styles.screen}>
            <View><Text>start</Text></View>
            <View><Text>{bookData.title}</Text></View>
            <View style={{ width: '100%' }}>
                <View style={{ paddingHorizontal: 20 }}>
                    <SliderRange value={100} onChange={(value) => console.log(value)} estimateSpeechTime={estimateSpeechTime(htmlToPlainTexts(bookData?.content || ''))} />
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}><FontAwesome5 name="image" size={18} color="#D6DAE1" /></TouchableOpacity>
                    <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}><AntDesign name="banckward" size={18} color="#D6DAE1" /></TouchableOpacity>
                    <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}>
                        <FontAwesome5 name={isPlaying ? 'stop-circle' : "play-circle"} size={48} color="#D6DAE1" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}><AntDesign name="forward" size={18} color="#D6DAE1" /></TouchableOpacity>
                    <TouchableOpacity onPress={isPlaying ? stopAudio : playAudio}><FontAwesome5 name="list-ul" size={18} color="#D6DAE1" /></TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default audio

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    color: '#D6DAE1',
  }
});