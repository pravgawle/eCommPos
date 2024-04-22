import { View, Text, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import { useCart } from '../../hooks/useCart';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import WebView from 'react-native-webview';

type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckoutScreen'>;

type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'CheckoutScreen'>;

type CheckoutScreenProps = {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
};

export default function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { clearCart } = useCart();
  const webUrl  = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Checkout",
      headerLeft: () => (
        <HeaderBackButton onPress={() => navigation.goBack()} />
      )
    });
  }, [navigation]);

    const handleNavigationStateChange = (navState: any) => {
        // Track each URL loaded in WebView
        console.log("Navigated to:", navState.url);
        if (navState.url.includes('/thank-you')) {
            // Detected thank-you in the URL, clear the cart
            clearCart();
          }
    };
    return webUrl ? (
        <WebView 
            source={{ uri: route.params?.webUrl }} 
            style={{ flex: 1 }}
            onNavigationStateChange={handleNavigationStateChange}
            startInLoadingState={true}
        />
    ) : (
        <View style={styles.centeredView}>
            <Text>No checkout URL provided.</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});