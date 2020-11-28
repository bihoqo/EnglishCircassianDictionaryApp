import React, { useEffect } from 'react';
import { View, Text, BackHandler, Alert} from 'react-native';
import HomePage from './screens/HomePage.js';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <HomePage></HomePage>
    </View>
  );
}