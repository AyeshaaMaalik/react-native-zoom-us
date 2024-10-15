import React, { useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet } from 'react-native';
import ZoomUs from 'react-native-zoom-us';
import axios from 'axios';

const App = () => {
  const [meetingNumber, setMeetingNumber] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [userName, setUserName] = useState('Guest');
  const [accessToken, setAccessToken] = useState('');

  const clientID = 'mus6DIf4SzO9BKe2jr7sRw';
  const clientSecret = 'HSOeXR47z1mHJUtVFlfpiWIa86n2XPr1';
  const redirectUri = 'https://marketplacefront.zoom.us/sdk/custom/reactnative/index.html'; // Example: 'https://your-app.com/oauth/callback'
  const zoomOAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`;

  const getAccessToken = async (authCode) => {
    try {
      const response = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: redirectUri,
        },
        auth: {
          username: clientID,
          password: clientSecret,
        },
      });
      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const initializeZoom = async () => {
    try {
      await ZoomUs.initialize({ jwtToken: accessToken });
      console.log('Zoom initialized');
    } catch (error) {
      console.error('Error initializing Zoom:', error);
    }
  };

  const joinMeeting = async () => {
    try {
      await ZoomUs.joinMeeting({
        userName: userName,
        meetingNumber: meetingNumber,
        password: meetingPassword,
      });
      console.log('Meeting joined successfully');
    } catch (error) {
      console.error('Error joining meeting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Join Zoom Meeting</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Meeting Number"
        value={meetingNumber}
        onChangeText={setMeetingNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Meeting Password"
        value={meetingPassword}
        onChangeText={setMeetingPassword}
        secureTextEntry
      />

      <Button title="Initialize Zoom" onPress={initializeZoom} />
      <Button title="Join Meeting" onPress={joinMeeting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default App;
