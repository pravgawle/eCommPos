import React from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigations/AppNavigation'; // Adjust the import path as necessary
import CartIconWithBadge from '../screens/home/views/CartIconWithBadge';

type NavigationOptionsProps = {
  navigation: DrawerNavigationProp<RootStackParamList>;
  cartItemCount: number; 
  navigationTitle: string;
};

export const setDrawerNavigationOptions = ({ navigation, cartItemCount, navigationTitle }: NavigationOptionsProps) => {
  navigation.setOptions({
    headerTitle: navigationTitle,
    headerRight: () => (
      <CartIconWithBadge
        quantity={cartItemCount}
        onPress={() => navigation.navigate('CartScreen')}
      />
    ),
  });
};
