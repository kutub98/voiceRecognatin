import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, Picker } from 'react-native';
import Voice from 'react-native-voice';
import axios from 'axios';

export default function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default language is English (United States)

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
      startWebSpeechRecognition(selectedLanguage);
    } else {
      try {
        await Voice.start(selectedLanguage);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const startWebSpeechRecognition = (language) => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;

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

  const transcribeSpeechToText = async (audioData, languageCode) => {
    const apiKey = 'YOUR_GOOGLE_CLOUD_API_KEY';
    const url = `https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${apiKey}`;

    try {
      const response = await axios.post(url, {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: languageCode,
        },
        audio: {
          content: audioData,
        },
      });

      const transcript = response.data.results[0].alternatives[0].transcript;
      setRecognizedText(transcript);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={(value) => setSelectedLanguage(value)}
      >
        <Picker.Item label="English (United States)" value="en-US" />
        <Picker.Item label="Spanish" value="es-ES" />
        <Picker.Item label="French" value="fr-FR" />
        <Picker.Item label="Bengali" value="bn-BD" />
      </Picker>

      <TouchableOpacity onPress={startRecognition}>
        <Text><svg style={styles.microphone} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopRecognition}>
        <Text>Click to Stop Voice Recognition</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Recognized Text: {recognizedText}</Text>
    </View>

    // test branch 
  
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
  microphone:{
    height: 30,
    width: 30,
    backgroundColor: "#f7f7f7"
  }
});
