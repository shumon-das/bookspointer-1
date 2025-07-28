import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Slider from '@react-native-community/slider';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { htmlToPlainTexts } from '../utils/htmlToPlainTexts';
import { labels } from '../utils/labels';

const audio = () => {
  const { book } = useLocalSearchParams();
  const bookData = book ? JSON.parse(book as string) : null;
  const [text, setText] = React.useState(htmlToPlainTexts(bookData?.content || ''));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playedDuration, setPlayedDuration] = React.useState(0);
  
  const estimateSpeechTime = (text: string, wpm = 150) => {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedSeconds = wordCount / (wpm / 60);
    return Math.ceil(estimatedSeconds);
  };
  const estimatedDuration = estimateSpeechTime(text);

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const playAudio = () => {
    setIsPlaying(true);

    const intervalId = setInterval(() => {
      setPlayedDuration((prev) => {
        return Math.min(prev + 1, estimatedDuration);
      });
    }, 1000);

    Speech.speak(text, {
      language: 'bn-BD',
      pitch: 1.0,
      rate: 1.0,
      onDone: () => {
        setIsPlaying(false);
        setPlayedDuration(0);
        clearInterval(intervalId);
      },
      onError: () => {
        setIsPlaying(false);
        setPlayedDuration(0);
        clearInterval(intervalId);
      },
      onStopped: () => {
        setIsPlaying(false);
        setPlayedDuration(0);
        clearInterval(intervalId);
      }
    });
  };

  const pauseAudio = () => {
    Speech.pause();
  };

  const stopAudio = () => {
    setIsPlaying(false);
    Speech.stop();
    setPlayedDuration(0);
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF' }}>{formatTime(playedDuration)}</Text>
                    <Slider
                        style={{width: '80%', height: 40}}
                        value={playedDuration}
                        onValueChange={(value: number) => setPlayedDuration(value)}
                        minimumValue={0}
                        maximumValue={estimatedDuration}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        disabled={true}
                    />
                    <Text style={{ color: '#FFFFFF' }}>{formatTime(estimatedDuration)}</Text>
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