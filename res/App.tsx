/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react'
import AppNavigation from './navigations/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './components/AuthContext';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { storeFrontAccessToken, shopifyStoreUrl, storeFrontApiAccessToken } from './components/ShopifyStoreConfig';

export default function App() {

  useEffect( ()=> {
    StatusBar.setBarStyle("dark-content");
    SplashScreen.hide();
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <AuthProvider>
      <AppNavigation />
    </AuthProvider>
    </GestureHandlerRootView>

        );
}
