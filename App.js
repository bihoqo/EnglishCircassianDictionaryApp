import React from 'react';
import { View, I18nManager } from 'react-native';
import HomePage from './screens/HomePage.js';
import { Provider as PaperProvider } from 'react-native-paper';

I18nManager.allowRTL(false);

export default function App() {
  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <HomePage></HomePage>
      </View>
    </PaperProvider>
  );
}