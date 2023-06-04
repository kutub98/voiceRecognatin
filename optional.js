import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Voice from 'react-native-voice';

export default function App() {
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Voice.onSpeechResults = (event) => {
        const transcript = event.value[0];
        setRecognizedText(transcript);
      };
  
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, []);

  const startRecognition = async () => {
    if (Platform.OS === 'web') {
      startWebSpeechRecognition();
    } else {
      try {
        await Voice.start('bn-BD');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const startWebSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'bn-BD';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setRecognizedText(transcript);
    };

    recognition.start();
  };

  const stopRecognition = async () => {
    if (Platform.OS === 'web') {
      stopWebSpeechRecognition();
    } else {
      try {
        await Voice.stop();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const stopWebSpeechRecognition = () => {
    window.webkitSpeechRecognition.stop();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={startRecognition}>
        <Text>Click to Start Voice Recognition</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopRecognition}>
        <Text>Click to Stop Voice Recognition</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Recognized Text: {recognizedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
  },
});
