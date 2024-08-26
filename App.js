import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native'
import { Provider } from 'react-redux'
import { persistor, store } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import Root from './src/navigations/Root';
import { AlertProvider } from './src/providers/AlertContext';
import DynamicAlert from './src/components/DynamicAlert';
import theme from './src/styles/theme';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={theme.colors.primary} />
            <Root />
            <DynamicAlert />
          </SafeAreaView>
        </AlertProvider>
      </PersistGate>

    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
})