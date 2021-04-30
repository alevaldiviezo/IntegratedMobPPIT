import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { Audio } from 'expo-av';  // Library that allow us implement the functionality required(microphone)

export default function App() {
  const [RecordedURI, SetRecordedURI] = useState(''); // variable that saves the location of the recording created

  const [recording, setRecording] = React.useState(); // variable that saves the recorded object state
  const [sound, setSound] = React.useState(); // variable that saves the recorded object state


  //Function to start a recording
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync(); // method to request permissions
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');  // message to the console
      const recording = new Audio.Recording();  // class that create an object to record
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync(); 
      setRecording(recording);  // now we set the recording state to recording
      console.log('Recording started'); //message to the console
    } catch (err) {  // message in case that something does not work
      console.error('Failed to start recording', err);
    }
  }
  
  // Function that finishes the recording
  async function stopRecording() {
    console.log('Stopping recording..'); //console message
    setRecording(undefined); // set recording state to undefined before to call the next method
    await recording.stopAndUnloadAsync(); //Stops the recording and deallocates the recorder from memory
    const uri = recording.getURI(); // saves the recording to an uri location
    SetRecordedURI(uri); // now we set the recorded uri location
    console.log('Recording stopped and stored at', uri); // the console will show a message with the location of the file
  }
  
  // Function to play the sound generated
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(  // class that creates a sound object
       {uri: RecordedURI}  // source of the sound
    );
    setSound(sound); // state of sound

    console.log('Playing Sound');
    await sound.playAsync(); }

  React.useEffect(() => {  //if the sound is playing, unload the sound, otherwise return it
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);


  //User Interface
  return (
    <View style={styles.container}>
    
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'} // button to start and stop the recording
        onPress={recording ? stopRecording : startRecording}
      />
      {/* after we put here a button to play the recording */}
      <Button
        title="Play Sound" onPress={playSound}  // Button to play the sound recorded
        
      />
      {/* Text to show the file's location in memory */}
      <Text>{RecordedURI}</Text>  
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
