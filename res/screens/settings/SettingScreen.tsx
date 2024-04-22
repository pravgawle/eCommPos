import { View, Text, Alert, Button, StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { setDrawerNavigationOptions } from '../../navigations/NavigationOptions';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../../navigations/AppNavigation';
import { useCart } from '../../hooks/useCart';
import ActionButtonSecondary from '../../components/ActionButtonSecondary';

type SettingScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'SettingScreen'>;

type SettingScreenProps = {
  navigation: SettingScreenNavigationProp;
};

export default function SettingScreen({ navigation }: SettingScreenProps) {
  const { cartProducts, addToCart, updateProductQuantity, cartItemCount } = useCart();


  useLayoutEffect(() => {
    setDrawerNavigationOptions({ navigation, cartItemCount, navigationTitle: 'Settings' });
  }, [navigation, cartItemCount]);

  const handleDeleteAccount = () => {
    // Here you should include the logic to handle the account deletion
    // This might involve showing a confirmation dialog, then calling your backend to delete the account
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Delete", onPress: () => console.log("Account deletion logic goes here") }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <ActionButtonSecondary title="Delete Account" onPress={handleDeleteAccount} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
    borderRadius: 25,
  },
});