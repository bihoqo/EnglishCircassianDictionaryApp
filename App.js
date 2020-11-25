import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import HomePage from './screens/HomePage.js';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <View>
        <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "gray" translucent = {true}/>
      </View>
      <HomePage></HomePage>
    </View>
  );
}

const styles = StyleSheet.create({
  appHeader: {
    backgroundColor: 'black',
    paddingTop: StatusBar.currentHeight
  }
});
